import React from "react";
import "./ImagesGrid.css";

export default function ImagesGrid({ images, onOpenImage }) {
  if (!images || images.length === 0) {
    return <div className="no-images">No images found</div>;
  }

  return (
    <div className="masonry-grid">
      {images.map((img, index) => {
        const src =
          img.image_url ||
          img.thumbnail ||
          img.image ||
          img.url ||
          "";

        return (
          <div
            className="masonry-item"
            key={index}
            onClick={() => onOpenImage && onOpenImage(index)} // ✅ Open modal
          >
            <img src={src} alt={img.title || "image"} className="masonry-img" />

            <div className="img-labels">
              <p className="img-title">
                {img.title?.trim() || "Untitled Image"}
              </p>

              {img.source && (
                <span className="img-source">{img.source}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
