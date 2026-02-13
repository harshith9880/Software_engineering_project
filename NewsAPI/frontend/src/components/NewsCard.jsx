import React from "react";
import "./NewsCard.css";


export default function NewsCard({ article }) {
  const sentimentClass =
    article.sentiment === "positive"
      ? "badge-positive"
      : article.sentiment === "negative"
      ? "badge-negative"
      : "badge-neutral";

  return (
    <div className="news-row">
      {/* LEFT IMAGE BLOCK */}
      <div className="image-block">
        <img
          src={article.image_url}
          alt={article.title}
          className="news-image"
        />

        <div className="source-link">
          <img
            src={article.source_icon}
            alt="icon"
            className="source-icon"
          />
          <span>{article.source_url}</span>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="content-block">
        <div className="meta-row">
          <span className="date">
            {article.pubDate} ({article.pubDateTZ})
          </span>

          <span className={`sentiment-badge ${sentimentClass}`}>
            {article.sentiment}
          </span>
        </div>

        <h2 className="news-title">{article.title}</h2>

        <div className="info-row">
          <span className="label">Category</span>
          <span className="pill category-pill">
            {article.category?.[0]}
          </span>
        </div>

        <div className="info-row">
          <span className="label">AI Tags</span>
          <span className="pill ai-pill">
            {article.ai_tag?.[0]}
          </span>
        </div>
      </div>
    </div>
  );
}
