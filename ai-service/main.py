import os
import json
from datetime import datetime
import requests
from dotenv import load_dotenv

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# LangChain / LangGraph
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import tool
from langchain_community.tools.ddg_search import DuckDuckGoSearchRun
from langgraph.prebuilt import create_react_agent

# ---------------------------------------------------
# 1. ENV & MODEL
# ---------------------------------------------------
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0
)

# ---------------------------------------------------
# 2. TOOLS
# ---------------------------------------------------
@tool
def get_current_time() -> str:
    """Return the current system date and time."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression."""
    try:
        return str(eval(expression))
    except Exception as e:
        return f"Calculation error: {str(e)}"


@tool
def get_latest_news(query: str = "", category: str = "") -> str:
    """Fetch latest news headlines based on query and category."""
    api_key = os.getenv("NEWSAPI_API_KEY")
    if not api_key:
        return "NEWSAPI_API_KEY missing."

    res = requests.get(
        "https://newsapi.org/v2/top-headlines",
        params={
            "apiKey": api_key,
            "language": "en",
            "pageSize": 5,
            "q": query or None,
            "category": category.lower() or None,
        },
        timeout=10
    )

    if res.status_code != 200:
        return f"News API error: {res.status_code}"

    articles = res.json().get("articles", [])
    if not articles:
        return "No news found."

    return "\n".join(
        f"- {a['title']} ({a['source']['name']})"
        for a in articles
    )


@tool
def get_location_news(location: str) -> str:
    """Fetch latest news for a specific location."""
    api_key = os.getenv("NEWSAPI_API_KEY")
    if not api_key:
        return "NEWSAPI_API_KEY missing."

    res = requests.get(
        "https://newsapi.org/v2/everything",
        params={
            "apiKey": api_key,
            "q": location,
            "pageSize": 5,
            "sortBy": "publishedAt",
        },
        timeout=10
    )

    if res.status_code != 200:
        return f"News API error: {res.status_code}"

    articles = res.json().get("articles", [])
    if not articles:
        return f"No recent news for {location}."

    return "\n".join(f"- {a['title']}" for a in articles)


@tool
def search_web(query: str) -> str:
    """Search the web for information to verify news claims."""
    try:
        ddg = DuckDuckGoSearchRun()
        return ddg.run(query)
    except Exception as e:
        return f"Search failed: {str(e)}"


# ---------------------------------------------------
# 3. AGENT
# ---------------------------------------------------
tools = [
    DuckDuckGoSearchRun(),
    calculator,
    get_current_time,
    get_latest_news,
    get_location_news,
]

agent_executor = create_react_agent(llm, tools)


# ---------------------------------------------------
# 4. REQUEST MODELS
# ---------------------------------------------------
class ChatRequest(BaseModel):
    message: str


class VerifyRequest(BaseModel):
    title: str
    description: str = ""
    source: str = ""
    publishedAt: str = ""
    url: str = ""


# ---------------------------------------------------
# 5. HEALTH CHECK
# ---------------------------------------------------
@app.get("/")
def health():
    return {"status": "AI service running", "timestamp": datetime.now().isoformat()}


# ---------------------------------------------------
# 6. CHAT ENDPOINT
# ---------------------------------------------------
@app.post("/chat")
def chat(request: ChatRequest):
    try:
        result = agent_executor.invoke({
            "messages": [
                {"role": "user", "content": request.message}
            ]
        })

        response = result["messages"][-1].content

        return {
            "success": True,
            "response": response
        }
    except Exception as e:
        return {
            "success": False,
            "response": f"I'm having trouble processing your request. Error: {str(e)}"
        }


# ---------------------------------------------------
# 7. NEWS VERIFICATION AGENT ENDPOINT
# ---------------------------------------------------
@app.post("/verify")
def verify_news(request: VerifyRequest):
    """
    News Verification Agent:
    Analyzes an article for authenticity, factual accuracy, timeliness,
    and regional consistency using web search cross-referencing.
    """
    try:
        ddg = DuckDuckGoSearchRun()

        # Step 1: Cross-reference search
        search_query = f"{request.title} {request.source} news fact check"
        try:
            search_results = ddg.run(search_query[:200])
        except Exception:
            search_results = "Search unavailable"

        # Step 2: Additional verification search
        try:
            alt_search = ddg.run(f'"{request.title[:80]}" site:reuters.com OR site:bbc.com OR site:apnews.com')
        except Exception:
            alt_search = "Secondary search unavailable"

        # Step 3: Ask LLM to analyze
        published_info = f"Published at: {request.publishedAt}" if request.publishedAt else ""
        source_info = f"Source: {request.source}" if request.source else ""

        prompt = f"""You are a professional news fact-checker and verification agent for NewsHive.

Analyze the following article for authenticity and return a JSON object.

ARTICLE TO VERIFY:
Title: {request.title}
Description: {request.description}
{source_info}
{published_info}

WEB SEARCH RESULTS (cross-reference data):
{search_results[:1500]}

SECONDARY SEARCH:
{alt_search[:800]}

Based on the above, return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{{
  "verdict": "VERIFIED",
  "confidence": 87,
  "summary": "Brief 1-2 sentence explanation of the verdict",
  "checks": {{
    "factual_accuracy": "PASS",
    "source_credibility": "PASS",
    "temporal_consistency": "PASS",
    "regional_accuracy": "PASS"
  }},
  "cross_references": ["Source 1 confirmed this", "Source 2 mentioned similar"],
  "flags": []
}}

Verdict options: "VERIFIED", "LIKELY TRUE", "UNVERIFIABLE", "NEEDS REVIEW", "SUSPICIOUS"
Check options: "PASS", "WARN", "FAIL", "UNKNOWN"
Confidence: integer 0-100
flags: list any concerns (empty list if none)
"""

        response = llm.invoke(prompt)
        raw = response.content.strip()

        # Clean up markdown code blocks if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        result = json.loads(raw)

        return {
            "success": True,
            "title": request.title,
            "source": request.source,
            "verification": result,
            "verified_at": datetime.now().isoformat()
        }

    except json.JSONDecodeError:
        # Return a safe fallback if JSON parsing fails
        return {
            "success": True,
            "title": request.title,
            "source": request.source,
            "verification": {
                "verdict": "UNVERIFIABLE",
                "confidence": 50,
                "summary": "Automated verification could not complete a full analysis for this article.",
                "checks": {
                    "factual_accuracy": "UNKNOWN",
                    "source_credibility": "UNKNOWN",
                    "temporal_consistency": "UNKNOWN",
                    "regional_accuracy": "UNKNOWN"
                },
                "cross_references": [],
                "flags": ["Manual review recommended"]
            },
            "verified_at": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "verification": {
                "verdict": "UNVERIFIABLE",
                "confidence": 0,
                "summary": "Verification service encountered an error.",
                "checks": {},
                "cross_references": [],
                "flags": [str(e)]
            }
        }


# ---------------------------------------------------
# 8. ANALYTICS ENDPOINT
# ---------------------------------------------------
@app.get("/analytics")
def get_analytics():
    """Returns mock analytics data for the admin dashboard."""
    return {
        "success": True,
        "data": {
            "total_articles_today": 1284,
            "api_calls_today": 3420,
            "verified_articles": 1102,
            "avg_verification_confidence": 82,
            "category_distribution": [
                {"category": "Technology", "count": 312, "percentage": 24},
                {"category": "Sports", "count": 241, "percentage": 19},
                {"category": "Finance", "count": 198, "percentage": 15},
                {"category": "Entertainment", "count": 179, "percentage": 14},
                {"category": "Science", "count": 153, "percentage": 12},
                {"category": "Health", "count": 128, "percentage": 10},
                {"category": "Global", "count": 73, "percentage": 6},
            ],
            "hourly_activity": [
                {"hour": "00", "articles": 42},
                {"hour": "02", "articles": 28},
                {"hour": "04", "articles": 15},
                {"hour": "06", "articles": 87},
                {"hour": "08", "articles": 156},
                {"hour": "10", "articles": 198},
                {"hour": "12", "articles": 212},
                {"hour": "14", "articles": 176},
                {"hour": "16", "articles": 143},
                {"hour": "18", "articles": 98},
                {"hour": "20", "articles": 72},
                {"hour": "22", "articles": 57},
            ],
            "verification_verdicts": {
                "VERIFIED": 68,
                "LIKELY TRUE": 18,
                "UNVERIFIABLE": 9,
                "NEEDS REVIEW": 4,
                "SUSPICIOUS": 1
            },
            "api_response_times_ms": [120, 145, 132, 189, 156, 142, 128, 167, 172, 158]
        }
    }


# ---------------------------------------------------
# 9. NOTIFICATIONS ENDPOINT
# ---------------------------------------------------
@app.get("/notifications")
def get_notifications():
    """Returns breaking news notifications."""
    return {
        "success": True,
        "notifications": [
            {
                "id": 1,
                "title": "Breaking: Major Tech Acquisition Announced",
                "category": "Technology",
                "time": "2 min ago",
                "read": False
            },
            {
                "id": 2,
                "title": "Global Markets React to New Economic Data",
                "category": "Finance",
                "time": "15 min ago",
                "read": False
            },
            {
                "id": 3,
                "title": "Science Breakthrough: New Climate Research Published",
                "category": "Science",
                "time": "1 hr ago",
                "read": True
            },
            {
                "id": 4,
                "title": "Sports: Championship Finals Schedule Confirmed",
                "category": "Sports",
                "time": "2 hr ago",
                "read": True
            }
        ],
        "unread_count": 2
    }
