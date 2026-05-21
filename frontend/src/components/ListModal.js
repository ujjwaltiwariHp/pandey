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

  const [errorMsg, setErrorMsg] = useState("");

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
    if (!title.trim()) {
      setErrorMsg("सूची का शीर्षक दर्ज करना अनिवार्य है। *");
      return;
    }
    if (validCols.length < 1) {
      setErrorMsg("कम से कम एक कॉलम का नाम होना अनिवार्य है। *");
      return;
    }
    setErrorMsg("");
    onSave({
      title: title.trim(),
      columns: validCols,
      highlights,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '950px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '2px solid #eee', paddingBottom: 16 }}>
          <h2 className="modal-title" style={{ margin: 0 }}>
            {isEdit ? "लिस्ट बदलें" : "नया लिस्ट बनाएं"}
          </h2>
          <button className="btn-icon" onClick={onClose}><FaTimes /></button>
        </div>

        {errorMsg && (
          <div style={{
            background: '#fef2f2',
            color: '#dc2626',
            padding: '12px 20px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontWeight: '700',
            fontSize: '0.95rem',
            border: '1px solid #fecaca',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="modal-grid-2">
          {/* List Title - Full width inside grid */}
          <div className="form-field modal-span-full">
            <label>लिस्ट का शीर्षक *</label>
            <HindiInput
              value={title}
              onChange={setTitle}
              placeholder="जैसे: धान बीज मूल्य सूची — खरीफ"
            />
          </div>

          {/* Columns Section */}
          <div className="modal-span-full">
            <div className="form-section-label" style={{ marginTop: 10 }}>कॉलम के नाम (कॉलम का नाम लिखें)</div>
            <div className="modal-grid-3">
              {columns.map((col, idx) => (
                <div className="form-field col-row" key={idx} style={{ position: 'relative' }}>
                  <div style={{ flexGrow: 1 }}>
                    <label>कॉलम {idx + 1}</label>
                    <HindiInput
                      value={col}
                      onChange={(v) => updateCol(idx, v)}
                      placeholder={`कॉलम ${idx + 1} का नाम`}
                    />
                  </div>
                  {columns.length > 1 && (
                    <button className="btn-icon-danger" onClick={() => removeCol(idx)} title="Remove column">
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button className="btn-outline-green" onClick={addCol} style={{ width: 'auto', padding: '12px 30px', marginTop: 20 }}>
              <FaPlus style={{ marginRight: 8 }} /> Add Column
            </button>
          </div>

        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>
            {isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
