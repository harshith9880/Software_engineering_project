import React from "react";
import { useState } from "react";
import api from "../services/api.js";
import NewsCard from "../components/NewsCard.jsx";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [newsData, setNewsData] = useState([]);

  const handleSearch = async () => {
  try {
    const res = await api.get("/news/search", {
      params: { query }
    });

    console.log("FULL RESPONSE:", res.data);

    setNewsData(res.data.data); // keep this for now
  } catch (error) {
    console.error("Search error:", error);
  }
};


  return (
    <div className="page-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search topic..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="news-scroll">
        {newsData.map((article) => (
          <NewsCard key={article.article_id} article={article} />
        ))}
      </div>
    </div>
  );
}
