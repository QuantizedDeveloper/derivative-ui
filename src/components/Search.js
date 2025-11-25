import React, { useState } from "react";
import "./Search.css";
import { FaPlus, FaArrowUp, FaTimes } from "react-icons/fa";

const Search = ({ onSearch }) => {
  const [q, setQ] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle form submission
  const submit = async (e) => {
    if (e) e.preventDefault();
    if (!q.trim() && !image) return;

    let imageBase64 = null;
    if (image) {
      imageBase64 = await convertToBase64(image);
    }

    onSearch({ text: q.trim(), image: imageBase64 }); // send both text & image
    setQ("");
    setImage(null);
    setImagePreview(null);
  };

  const clearInput = () => setQ("");

  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Convert image file to Base64
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <form className="search-fixed" onSubmit={submit} role="search">
      <div className="search-pill">
        {/* + Button for image */}
        <label htmlFor="image-upload" className="icon-left">
          <FaPlus />
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        {/* Text input */}
        <input
          className="search-input"
          placeholder="Search anything — Google, YouTube, Twitter..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
        />

        {/* Image preview */}
        {imagePreview && (
          <div className="image-preview-wrapper">
            <img
              src={imagePreview}
              alt="preview"
              className="search-image-preview"
            />
            <button
              type="button"
              className="clear-btn"
              onClick={removeImage}
              aria-label="Remove image"
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* Send button */}
        <button
          type="submit"
          className={`send-btn ${q.trim() || image ? "active" : "disabled"}`}
          disabled={!q.trim() && !image}
          aria-label="Send"
        >
          <FaArrowUp />
        </button>
      </div>
    </form>
  );
};

export default Search;

