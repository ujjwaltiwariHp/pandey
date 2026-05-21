"use client";
import { useState } from "react";
import HindiInput from "./HindiInput";
import { FaTimes, FaPlus } from "react-icons/fa";

export default function ListModal({ list, onSave, onClose }) {
  const isEdit = !!list;
  const [title, setTitle] = useState(list?.title || "");
  const [columns, setColumns] = useState(
    list?.columns || ["", "", ""]
  );
  const [highlights, setHighlights] = useState(
    list?.highlights || { orange: "", green: "", purple: "" }
  );

  const updateCol = (idx, val) => {
    const copy = [...columns];
    copy[idx] = val;
    setColumns(copy);
  };

  const addCol = () => setColumns([...columns, ""]);
  const removeCol = (idx) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const validCols = columns.filter((c) => c.trim());
    if (!title.trim() || validCols.length < 1) {
      alert("शीर्षक और कम से कम एक कॉलम आवश्यक है।");
      return;
    }
    onSave({
      title: title.trim(),
      columns: validCols,
      highlights,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          {isEdit ? "लिस्ट बदलें" : "नया लिस्ट बनाएं"}
        </h2>

        <div className="form-field">
          <label>लिस्ट का शीर्षक *</label>
          <HindiInput
            value={title}
            onChange={setTitle}
            placeholder="जैसे: धान बीज मूल्य सूची — खरीफ"
          />
        </div>

        <div className="form-section-label">कॉलम के नाम</div>
        {columns.map((col, idx) => (
          <div className="form-field col-row" key={idx}>
            <label>कॉलम {idx + 1}</label>
            <HindiInput
              value={col}
              onChange={(v) => updateCol(idx, v)}
              placeholder={`कॉलम ${idx + 1} का नाम`}
            />
            {columns.length > 1 && (
              <button className="btn-icon-danger" onClick={() => removeCol(idx)} title="Remove">
                <FaTimes />
              </button>
            )}
          </div>
        ))}
        <button className="btn-small btn-outline-green" onClick={addCol}>
          <FaPlus /> Add Column
        </button>

        <div className="form-section-label" style={{ marginTop: 20 }}>
          हाइलाइट टैग (वैकल्पिक)
        </div>
        <div className="highlight-grid">
          <div className="form-field">
            <label style={{ color: "#e65100" }}>नारंगी टैग का नाम</label>
            <HindiInput
              value={highlights.orange || ""}
              onChange={(v) => setHighlights({ ...highlights, orange: v })}
              placeholder="जैसे: मोटा धान"
            />
          </div>
          <div className="form-field">
            <label style={{ color: "#2e7d32" }}>हरा टैग का नाम</label>
            <HindiInput
              value={highlights.green || ""}
              onChange={(v) => setHighlights({ ...highlights, green: v })}
              placeholder="जैसे: महीन धान"
            />
          </div>
          <div className="form-field">
            <label style={{ color: "#6a1b9a" }}>बैंगनी टैग का नाम</label>
            <HindiInput
              value={highlights.purple || ""}
              onChange={(v) => setHighlights({ ...highlights, purple: v })}
              placeholder="जैसे: नई किस्म"
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
