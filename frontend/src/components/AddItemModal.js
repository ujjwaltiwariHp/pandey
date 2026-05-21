"use client";
import { useState } from "react";
import HindiInput from "./HindiInput";
import { FaTimes, FaPlus } from "react-icons/fa";

export default function AddItemModal({ columns, highlights, onSave, onClose }) {
  const [values, setValues] = useState(new Array(columns.length).fill(""));
  const [highlight, setHighlight] = useState("none");

  const updateVal = (idx, val) => {
    const copy = [...values];
    copy[idx] = val;
    setValues(copy);
  };

  const handleSave = () => {
    if (!values[0]?.trim()) {
      alert("पहला कॉलम (आइटम का नाम) भरना अनिवार्य है।");
      return;
    }
    onSave({
      item_values: values,
      highlight,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="modal-title" style={{ margin: 0 }}>नया आइटम जोड़ें</h2>
          <button className="btn-icon" onClick={onClose}><FaTimes /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {columns.map((col, idx) => (
            <div className="form-field" key={idx}>
              <label>{col} *</label>
              <HindiInput
                value={values[idx] || ""}
                onChange={(v) => updateVal(idx, v)}
                placeholder={`${col} दर्ज करें...`}
              />
            </div>
          ))}

          <div className="form-field">
            <label>हाइलाइट टैग</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="modalNewH"
                  value="none"
                  checked={highlight === "none"}
                  onChange={(e) => setHighlight(e.target.value)}
                />
                कोई नहीं
              </label>
              {Object.entries(highlights || {}).map(
                ([k, v]) =>
                  v && (
                    <label key={k} className={`radio-label radio-${k}`}>
                      <input
                        type="radio"
                        name="modalNewH"
                        value={k}
                        checked={highlight === k}
                        onChange={(e) => setHighlight(e.target.value)}
                      />
                      {v}
                    </label>
                  )
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>
            <FaPlus /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
