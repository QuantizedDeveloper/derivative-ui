import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import TopBar from "./components/TopBar";
import Search from "./components/Search";
import ResultCard from "./components/ResultCard";
import ImagesGrid from "./components/ImagesGrid";
import ModalImageViewer from "./components/ModalImageViewer";
import StudiesGrid from "./components/StudiesGrid"; // <-- new

function App() {
  const [selected, setSelected] = useState("search");
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    search: [],
    images: [],
    reddit: [],
    finance: [],
    medical: [],
    math: [],
    space: [],
    news: [],
    studies: [],
  });

  const [imagePage, setImagePage] = useState(1);
  const [newsPage, setNewsPage] = useState(1);

  const resultsRef = useRef(null);
  const lastQueryRef = useRef("");

  // -----------------------------
  // Modal Image Viewer
  // -----------------------------
  const [openModal, setOpenModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const handleOpenImage = (index) => {
    setModalIndex(index);
    setOpenModal(true);
  };

  const handleDownloadImage = (src) => {
    const a = document.createElement("a");
    a.href = src;
    a.download = "image.jpg";
    a.click();
  };

  // -----------------------------
  // Backend fetch for general search
  // -----------------------------
  const fetchAllForSearch = async (query, page = 1) => {
    if (!query) return;
    setLoading(true);
    lastQueryRef.current = query;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/search/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, page }),
      });
      const json = await res.json();

      setData((prev) => ({
        search: page === 1 ? json.search || [] : prev.search,
        images: page === 1 ? json.images || [] : [...(prev.images || []), ...(json.images || [])],
        reddit: json.reddit || [],
        finance: json.finance || [],
        medical: json.medical || [],
        math: json.math || [],
        space: json.space || [],
        news: page === 1 ? json.news || [] : [...(prev.news || []), ...(json.news || [])],
        studies: prev.studies, // keep studies until user requests them
      }));

      if (page === 1) setSelected("search");
    } catch (e) {
      console.error("❌ Fetch error:", e);
    }
    setLoading(false);
  };

  // -----------------------------
  // Backend fetch for studies (OpenAlex)
  // -----------------------------
  // Note: This re-uses the /api/search/ endpoint which should return a `studies` field.
  const fetchStudies = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/search/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const json = await res.json();
      setData((prev) => ({
        ...prev,
        studies: json.studies || [],
      }));
    } catch (e) {
      console.error("❌ Fetch studies error:", e);
    }
    setLoading(false);
  };

  // -----------------------------
  // Function to handle study "download" (Option C)
  // - If study.pdf or study.pdf_url exists => open it (download)
  // - Otherwise do nothing (button will be disabled)
  // -----------------------------
  const handleStudyDownload = (study) => {
    const pdfCandidates = study.pdf || study.pdf_url || study.pdf_link || study.oa_url || null;
    if (pdfCandidates) {
      // Open in new tab so browser handles download or preview
      window.open(pdfCandidates, "_blank", "noopener,noreferrer");
    } else {
      // no-op; button will be disabled in UI
      console.warn("No PDF available for this study:", study.title);
    }
  };

  // -----------------------------
  // Search handler
  // -----------------------------
  const handleSearch = (query) => {
    if (!query) return;
    setImagePage(1);
    setNewsPage(1);
    fetchAllForSearch(query, 1);
  };

  // -----------------------------
  // Infinite scroll
  // -----------------------------
  const handleScroll = () => {
    if (!resultsRef.current || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = resultsRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 60) {
      if (selected === "images") setImagePage((prev) => prev + 1);
      else if (selected === "news") setNewsPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (imagePage > 1) fetchAllForSearch(lastQueryRef.current, imagePage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePage]);

  useEffect(() => {
    if (newsPage > 1) fetchAllForSearch(lastQueryRef.current, newsPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsPage]);

  useEffect(() => {
    const ref = resultsRef.current;
    if (ref) ref.addEventListener("scroll", handleScroll);
    return () => ref && ref.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultsRef.current, loading, selected]);

  // -----------------------------
  // Fetch studies when tab is selected
  // -----------------------------
  useEffect(() => {
    if (selected === "studies" && lastQueryRef.current) {
      fetchStudies(lastQueryRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const currentData = data[selected] || [];

  // -----------------------------
  // Main render
  // -----------------------------
  return (
    <div className="app-root">
      <TopBar selected={selected} onSelect={setSelected} loading={loading} />

      <main className="content-area">
        <div className="content-wrapper" ref={resultsRef}>
          <div className="content-inner">
            {selected === "images" ? (
              <ImagesGrid images={data.images} onOpenImage={handleOpenImage} />
            ) : selected === "studies" ? (
              <StudiesGrid
                studies={data.studies}
                onDownload={handleStudyDownload}
              />
            ) : currentData.length === 0 && !loading ? (
              <div className="empty-placeholder">No results found</div>
            ) : (
              currentData.map((item, i) => <ResultCard key={i} item={item} />)
            )}
          </div>
        </div>
      </main>

      <Search onSearch={handleSearch} />

      {openModal && (
        <ModalImageViewer
          images={data.images}
          index={modalIndex}
          onClose={() => setOpenModal(false)}
          onDownload={handleDownloadImage}
        />
      )}

      <div aria-live="polite" className="sr-only">
        {loading ? "Loading..." : ""}
      </div>
    </div>
  );
}

export default App;
