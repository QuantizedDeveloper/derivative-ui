import React from "react";
import "./StudiesGrid.css";

export default function StudiesGrid({ studies = [], onDownload = () => {} }) {
  if (!studies || studies.length === 0) {
    return <div className="no-studies">No research papers found.</div>;
  }

  return (
    <div className="studies-grid">
      {studies.map((item, idx) => {
        // Try several common PDF fields (backend might use different names)
        const pdfUrl = item.pdf || item.pdf_url || item.pdf_link || item.oa_url || null;
        // Display the "thumbnail" as title text block (Option D)
        const thumbText = item.title || "Untitled";

        return (
          <div className="study-card" key={idx}>
            <div className="study-thumbnail">
              <div className="study-thumb-text">{thumbText}</div>

              <button
                className={`download-btn ${pdfUrl ? "" : "disabled"}`}
                title={pdfUrl ? "Download PDF" : "No PDF available"}
                onClick={() => pdfUrl && onDownload({ ...item, pdf: pdfUrl })}
                disabled={!pdfUrl}
                aria-disabled={!pdfUrl}
              >
                ↓
              </button>
            </div>

            <div className="study-body">
              <div className="study-title">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title || "Untitled Study"}
                </a>
              </div>

              <div className="study-meta">
                {item.year && <span className="study-year">{item.year}</span>}
                {typeof item.cited_by_count !== "undefined" && (
                  <span className="study-cites"> • {item.cited_by_count} citations</span>
                )}
              </div>

              <div className="study-source">
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    source [link]
                  </a>
                )}
                {item.doi && (
                  <span className="study-doi">
                    {" "}
                    • <a href={`https://doi.org/${item.doi}`} target="_blank" rel="noopener noreferrer">doi</a>
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
