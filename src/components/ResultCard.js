import React from "react";
import "./ResultCard.css"; // <- custom styles (provided below)

const ResultCard = ({ item }) => {
  if (!item) return null;

  // Extract title from first bold text <b>title</b>
  let title = "";
  const boldMatch = item.text?.match(/<b>(.*?)<\/b>/i);
  if (boldMatch) title = boldMatch[1];

  // Clean readable text (HTML removed)
  const cleanText = item.text
    ?.replace(/<[^>]+>/g, "")
    ?.replace(title, "")
    ?.trim();

  return (
    <div className="result-card">

      {/* IMAGE */}
      <div className="result-image-wrapper">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt="result"
            className="result-image"
          />
        ) : (
          <div className="image-placeholder">image</div>
        )}
      </div>

      {/* TITLE */}
      {title && <h2 className="result-title">{title}</h2>}

      {/* PARAGRAPH SUMMARY */}
      {cleanText && <p className="result-text">{cleanText}</p>}

      {/* FACT LIST — extracted from remaining lines */}
      {item.text && (
        <div className="facts-section">
          <h3>Facts:</h3>
          <ul>
            {cleanText
              ?.split(". ")
              ?.slice(1) // skip first sentence (already summary)
              ?.map((fact, index) =>
                fact.trim() ? <li key={index}>{fact.trim()}</li> : null
              )}
          </ul>
        </div>
      )}

      {/* COORDINATES */}
      {item.coordinates && (
        <div className="coordinates">
          <strong>Coordinates:</strong> {item.coordinates.lat},{" "}
          {item.coordinates.lon}
        </div>
      )}

      {/* SOURCE LINK */}
      {item.url && (
        <a
          className="source-link"
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Source →
        </a>
      )}
    </div>
  );
};

export default ResultCard;
