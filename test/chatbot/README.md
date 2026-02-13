# Tool-Using AI Agent (LangGraph + LangChain)

This project implements a **tool-using AI agent** using LangGraph and LangChain. The agent can reason about user input, determine when external tools are required, invoke those tools, and synthesize their outputs into a final response.

The implementation demonstrates how large language models can be extended beyond text generation to perform real actions such as calculations, web search, and live data retrieval.

---

## Overview

Traditional language models rely solely on internal knowledge. This project implements an **agentic workflow** in which the model:

- Interprets the user request  
- Decides whether an external tool is required  
- Invokes the appropriate tool  
- Produces a grounded response using the tool output  

This reasoning-and-action loop follows the **ReAct (Reason + Act)** paradigm.

---

## Core Components

### AI Agent
A language model augmented with the ability to take actions. The agent reasons about each query and selectively uses tools to improve accuracy and usefulness.

### LangGraph
LangGraph manages the agent’s reasoning loop, including decision-making, tool invocation, observation handling, and final response synthesis.  
The agent is created using `create_react_agent`.

### Language Model
The agent uses OpenAI’s `gpt-4o-mini` via LangChain’s `ChatOpenAI`, configured for deterministic behavior (`temperature = 0`).

---

## Tools

The agent dynamically selects from the following tools:

- **Calculator** – Evaluates mathematical expressions  
- **Time Tool** – Returns the current system date and time  
- **Web Search** – Retrieves up-to-date information via DuckDuckGo  
- **News Tool** – Fetches live headlines using NewsAPI  
- **Location-Based News Tool** – Retrieves recent news for a specified location  

All tools are exposed to the agent using LangChain’s `@tool` interface.

---

## Execution Flow

1. A user query is passed to the agent  
2. The agent reasons about the intent of the query  
3. A tool is selected if required  
4. The tool executes and returns output  
5. The agent generates the final response  

This loop may repeat for complex queries.

---
