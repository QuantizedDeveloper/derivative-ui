import React, { useEffect, useRef, useState } from "react";
import "./ModalImageViewer.css";

export default function ModalImageViewer({
  images = [],
  index = 0,
  onClose,
  onDownload,
}) {
  const [current, setCurrent] = useState(index);
  const wrapperRef = useRef(null);

  useEffect(() => setCurrent(index), [index]);

  // swipe handling
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    let startX = 0;
    let endX = 0;

    const touchStart = (e) => {
      startX = e.touches[0].clientX;
    };
    const touchMove = (e) => {
      endX = e.touches[0].clientX;
    };
    const touchEnd = () => {
      const diff = endX - startX;
      if (diff > 40 && current > 0) setCurrent((c) => c - 1);
      else if (diff < -40 && current < images.length - 1) setCurrent((c) => c + 1);
      startX = endX = 0;
    };
    el.addEventListener("touchstart", touchStart);
    el.addEventListener("touchmove", touchMove);
    el.addEventListener("touchend", touchEnd);
    return () => {
      el.removeEventListener("touchstart", touchStart);
      el.removeEventListener("touchmove", touchMove);
      el.removeEventListener("touchend", touchEnd);
    };
  }, [current, images.length]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const src = images[current]?.url || images[current]?.image_url || images[current]?.thumbnail;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-inner" onClick={(e) => e.stopPropagation()} ref={wrapperRef}>
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-body">
          <button
            className="nav prev"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            aria-label="Previous"
          >
            ‹
          </button>

          <div className="modal-image-wrap">
            <img src={src} alt={`image-${current}`} loading="eager" />
            <p className="modal-caption">{images[current]?.title || "Untitled Image"}</p>
            <button
              className="modal-download"
              onClick={() => onDownload && onDownload(src)}
              aria-label="Download image"
            >
              ↓
            </button>
          </div>

          <button
            className="nav next"
            onClick={() => setCurrent((c) => Math.min(images.length - 1, c + 1))}
            disabled={current === images.length - 1}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
