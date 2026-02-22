import os
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

# Allow Express to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0
)

# ---------------------------------------------------
# 2. TOOLS (UNCHANGED)
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


# ---------------------------------------------------
# 3. AGENT (UNCHANGED LOGIC)
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
# 4. REQUEST MODEL
# ---------------------------------------------------
class ChatRequest(BaseModel):
    message: str


# ---------------------------------------------------
# 5. HEALTH CHECK
# ---------------------------------------------------
@app.get("/")
def health():
    return {"status": "AI service running"}


# ---------------------------------------------------
# 6. CHAT ENDPOINT
# ---------------------------------------------------
@app.post("/chat")
def chat(request: ChatRequest):

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
