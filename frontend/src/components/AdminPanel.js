"use client";
import { useState, useEffect, useRef } from "react";
import HindiInput from "./HindiInput";
import {
  fetchLists,
  createList,
  updateList,
  deleteList,
  createItem,
  updateItem,
  deleteItem,
} from "@/lib/api";
import ListModal from "./ListModal";
import Toast from "./Toast";
import html2canvas from "html2canvas";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSave,
  FaTimes,
  FaSync,
  FaDownload,
  FaFileImage,
  FaMapMarkerAlt,
  FaPhone,
  FaBoxOpen,
  FaSpinner,
} from "react-icons/fa";

export default function AdminPanel() {
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showListModal, setShowListModal] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editValues, setEditValues] = useState([]);
  const [editHighlight, setEditHighlight] = useState("none");
  const [newValues, setNewValues] = useState([]);
  const [newHighlight, setNewHighlight] = useState("none");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [toast, setToast] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef(null);

  const loadLists = async () => {
    try {
      const data = await fetchLists();
      setLists(data);
      if (data.length > 0 && !activeListId) {
        setActiveListId(data[0].id);
      } else if (data.length > 0 && !data.find((l) => l.id === activeListId)) {
        setActiveListId(data[0].id);
      }
    } catch (err) {
      showToast("डेटा लोड करने में त्रुटि", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const activeList = lists.find((l) => l.id === activeListId);

  useEffect(() => {
    if (activeList) {
      setNewValues(new Array(activeList.columns.length).fill(""));
      setNewHighlight("none");
      setSearchQuery("");
      setFilterType("");
    }
  }, [activeListId]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // List CRUD
  const handleCreateList = async (data) => {
    try {
      const newList = await createList(data);
      await loadLists();
      setActiveListId(newList.id);
      setShowListModal(false);
      showToast("नया लिस्ट बनाया गया!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleUpdateList = async (data) => {
    try {
      await updateList(editingList.id, data);
      await loadLists();
      setShowListModal(false);
      setEditingList(null);
      showToast("लिस्ट अपडेट हो गया!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDeleteList = async () => {
    if (!activeList) return;
    if (!confirm(`क्या आप "${activeList.title}" लिस्ट को हटाना चाहते हैं?`)) return;
    try {
      await deleteList(activeList.id);
      setActiveListId(null);
      await loadLists();
      showToast("लिस्ट हटा दिया गया!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Item CRUD
  const handleAddItem = async () => {
    if (!activeList || !newValues[0]?.trim()) {
      showToast("पहला कॉलम भरना आवश्यक है।", "error");
      return;
    }
    try {
      await createItem(activeList.id, {
        item_values: newValues,
        highlight: newHighlight,
      });
      setNewValues(new Array(activeList.columns.length).fill(""));
      setNewHighlight("none");
      await loadLists();
      showToast("आइटम जोड़ा गया!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const startEditItem = (item) => {
    setEditingItemId(item.id);
    setEditValues([...(item.item_values || [])]);
    setEditHighlight(item.highlight || "none");
  };

  const handleSaveEdit = async () => {
    try {
      await updateItem(editingItemId, {
        item_values: editValues,
        highlight: editHighlight,
      });
      setEditingItemId(null);
      await loadLists();
      showToast("आइटम अपडेट हो गया!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (!confirm(`"${name}" को हटाना चाहते हैं?`)) return;
    try {
      await deleteItem(id);
      await loadLists();
      showToast("आइटम हटा दिया गया!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Download functionality
  const downloadImage = async () => {
    if (!activeList || !activeList.items || activeList.items.length === 0) {
      showToast("डाउनलोड करने के लिए कोई आइटम नहीं है।", "error");
      return;
    }
    
    setIsDownloading(true);
    showToast("इमेज बन रही है...", "success");

    setTimeout(async () => {
      try {
        const pages = printRef.current.querySelectorAll('.print-page');
        for (let i = 0; i < pages.length; i++) {
          const canvas = await html2canvas(pages[i], {
            scale: 2,
            useCORS: true,
            logging: false,
          });
          const imgData = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = imgData;
          link.download = `${activeList.title}_Page_${i + 1}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        showToast("डाउनलोड पूरा हुआ!", "success");
      } catch (err) {
        showToast("डाउनलोड विफल रहा।", "error");
        console.error(err);
      } finally {
        setIsDownloading(false);
      }
    }, 500); // Wait for DOM to update
  };


  // Filter
  const filteredItems = activeList
    ? (activeList.items || []).filter((item) => {
        const vals = item.item_values || [];
        const matchQ =
          !searchQuery ||
          vals.some((v) => (v || "").toLowerCase().includes(searchQuery.toLowerCase()));
        const matchF = !filterType || item.highlight === filterType;
        return matchQ && matchF;
      })
    : [];

  // Stats
  const totalItems = activeList?.items?.length || 0;
  const highlightCounts = {};
  if (activeList?.highlights) {
    Object.keys(activeList.highlights).forEach((key) => {
      highlightCounts[key] = (activeList.items || []).filter(
        (it) => it.highlight === key
      ).length;
    });
  }

  // Print Pagination (Max 20 per page)
  const renderPrintPages = () => {
    if (!activeList || !isDownloading) return null;
    const items = activeList.items || [];
    const itemsPerPage = 20;
    const pages = [];
    
    for (let i = 0; i < items.length; i += itemsPerPage) {
      pages.push(items.slice(i, i + itemsPerPage));
    }

    return (
      <div ref={printRef} className="print-container-hidden">
        {pages.map((pageItems, pageIndex) => (
          <div key={pageIndex} className="print-page">
             <div className="print-header">
                <h2>पाण्डेय ट्रेडर्स</h2>
                <p>खाद बीज भंडार</p>
                <div className="print-contact">
                    <span>बड़का गांव, गोपालगंज, बिहार</span>
                    <span><FaPhone /> 8969730344</span>
                </div>
             </div>
             
             <div className="print-title">
               {activeList.title} {pages.length > 1 ? `(पेज ${pageIndex + 1}/${pages.length})` : ''}
             </div>

             <table className="print-table">
               <thead>
                 <tr>
                   <th>क्र.सं.</th>
                   {activeList.columns.map((col, i) => (
                     <th key={i}>{col}</th>
                   ))}
                 </tr>
               </thead>
               <tbody>
                 {pageItems.map((item, idx) => {
                   const vals = item.item_values || [];
                   const hColor = item.highlight || "none";
                   return (
                     <tr key={item.id} className={`print-row-${hColor}`}>
                       <td>{pageIndex * itemsPerPage + idx + 1}</td>
                       {activeList.columns.map((col, ci) => (
                         <td key={ci}>{vals[ci] || "—"}</td>
                       ))}
                     </tr>
                   )
                 })}
               </tbody>
             </table>
             
             <div className="print-footer">
               <p>गुणवत्तापूर्ण खाद, बीज एवं कृषि रसायन के विश्वनीय विक्रेता।</p>
             </div>
          </div>
        ))}
      </div>
    );
  };


  if (loading) {
    return (
      <div className="admin-loading">
        <FaSpinner className="fa-spin" style={{ fontSize: '2rem', marginBottom: 10 }} />
        <div>डेटा लोड हो रहा है...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {showListModal && (
        <ListModal
          list={editingList}
          onSave={editingList ? handleUpdateList : handleCreateList}
          onClose={() => {
            setShowListModal(false);
            setEditingList(null);
          }}
        />
      )}

      {/* Hidden Print Container */}
      {renderPrintPages()}

      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-top">
          <span><FaMapMarkerAlt /> बड़का गांव, गोपालगंज, बिहार</span>
          <span><FaPhone /> 8969730344</span>
        </div>
        <div className="admin-header-body">
          <h1>पाण्डेय ट्रेडर्स</h1>
          <p>खाद बीज भंडार — Admin Dashboard</p>
        </div>
      </div>

      {/* List Tabs */}
      <div className="list-bar">
        <div className="list-tabs">
          {lists.map((l) => (
            <button
              key={l.id}
              className={`list-tab ${l.id === activeListId ? "active" : ""}`}
              onClick={() => setActiveListId(l.id)}
            >
              {l.title.length > 20 ? l.title.slice(0, 18) + "…" : l.title}
            </button>
          ))}
        </div>
        <div className="list-actions">
          <button
            className="btn-small btn-green"
            onClick={() => {
              setEditingList(null);
              setShowListModal(true);
            }}
          >
            <FaPlus /> Add List
          </button>
          {activeList && (
            <>
              <button
                className="btn-small btn-blue"
                onClick={() => {
                  setEditingList(activeList);
                  setShowListModal(true);
                }}
              >
                <FaEdit /> Edit List
              </button>
              <button className="btn-small btn-red" onClick={handleDeleteList}>
                <FaTrash /> Delete List
              </button>
              <button className="btn-small" style={{ background: '#f9a825', color: '#000' }} onClick={downloadImage} disabled={isDownloading}>
                {isDownloading ? <FaSpinner className="fa-spin" /> : <FaDownload />} Download
              </button>
            </>
          )}
        </div>
      </div>

      {!activeList ? (
        <div className="empty-state">
          <FaBoxOpen style={{ fontSize: '3rem', color: "#ccc" }} />
          <p style={{ marginTop: 10 }}>कोई लिस्ट नहीं है। "Add List" पर क्लिक करके नया लिस्ट बनाएं।</p>
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="admin-toolbar">
            <div className="search-wrap">
              <FaSearch />
              <input
                type="text"
                placeholder={`${activeList.columns[0]} से खोजें...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">— सभी टैग —</option>
              {activeList.highlights &&
                Object.entries(activeList.highlights).map(([key, label]) =>
                  label ? (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ) : null
                )}
            </select>
          </div>

          {/* Stats */}
          <div className="stats-bar">
            <span className="stat-chip">
              कुल आइटम <strong>{totalItems}</strong>
            </span>
            {Object.entries(highlightCounts).map(
              ([key, count]) =>
                activeList.highlights[key] && (
                  <span className={`stat-chip stat-${key}`} key={key}>
                     {activeList.highlights[key]} <strong>{count}</strong>
                  </span>
                )
            )}
          </div>

          {/* Table */}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>क्र.सं.</th>
                  {activeList.columns.map((col, i) => (
                    <th key={i}>{col}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={activeList.columns.length + 2}
                      style={{ textAlign: "center", padding: 30, color: "#999" }}
                    >
                      <FaBoxOpen style={{ fontSize: '2rem', color: "#eee", marginBottom: 10 }} />
                      <div>कोई आइटम नहीं मिला</div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => {
                    const vals = item.item_values || [];
                    const isEditing = editingItemId === item.id;

                    if (isEditing) {
                      return (
                        <tr key={item.id} className="row-editing">
                          <td className="td-sno">{idx + 1}</td>
                          {activeList.columns.map((col, ci) => (
                            <td key={ci}>
                              <HindiInput
                                value={editValues[ci] || ""}
                                onChange={(v) => {
                                  const copy = [...editValues];
                                  copy[ci] = v;
                                  setEditValues(copy);
                                }}
                                placeholder={col}
                                className="inline-input"
                              />
                            </td>
                          ))}
                          <td>
                            <div className="action-btns">
                              <div className="radio-group-vertical">
                                 <label><input type="radio" name={`e-${item.id}`} value="none" checked={editHighlight === 'none'} onChange={(e) => setEditHighlight(e.target.value)} /> कोई नहीं</label>
                                 {Object.entries(activeList.highlights || {}).map(([k, v]) => v && (
                                   <label key={k} style={{color: k === 'orange' ? '#e65100' : k === 'green' ? '#2e7d32' : '#6a1b9a'}}>
                                     <input type="radio" name={`e-${item.id}`} value={k} checked={editHighlight === k} onChange={(e) => setEditHighlight(e.target.value)} /> {v}
                                   </label>
                                 ))}
                              </div>
                              <button className="btn-icon btn-save" onClick={handleSaveEdit} title="Save"><FaSave style={{ color: '#2e7d32' }} /></button>
                              <button
                                className="btn-icon btn-cancel-edit"
                                onClick={() => setEditingItemId(null)}
                                title="Cancel"
                              >
                                <FaTimes style={{ color: '#d32f2f' }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    const hColor = item.highlight || "none";
                    let rowClass = "";
                    if (hColor === "orange") rowClass = "row-orange";
                    else if (hColor === "green") rowClass = "row-green";
                    else if (hColor === "purple") rowClass = "row-purple";

                    return (
                      <tr key={item.id} className={rowClass}>
                        <td className="td-sno">{idx + 1}</td>
                        {activeList.columns.map((col, ci) => {
                          const val = vals[ci] || "—";
                          const isFirst = ci === 0;
                          
                          return (
                            <td
                              key={ci}
                              className={isFirst ? "td-name" : "td-center"}
                            >
                              {val}
                            </td>
                          );
                        })}
                        <td className="td-center">
                          <div className="action-btns">
                            <button
                              className="btn-icon btn-edit"
                              onClick={() => startEditItem(item)}
                              title="Edit"
                            >
                              <FaEdit style={{ color: '#1976d2' }} />
                            </button>
                            <button
                              className="btn-icon btn-delete"
                              onClick={() => handleDeleteItem(item.id, vals[0])}
                              title="Delete"
                            >
                              <FaTrash style={{ color: '#d32f2f' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Add Item Form */}
          <div className="add-form">
            <h3 className="add-form-title">
              <FaPlus style={{ color: '#2e7d32' }} /> नया आइटम जोड़ें
            </h3>
            <div className="add-form-grid">
              {activeList.columns.map((col, i) => (
                <div className="form-field" key={i}>
                  <label>{col}</label>
                  <HindiInput
                    value={newValues[i] || ""}
                    onChange={(v) => {
                      const copy = [...newValues];
                      copy[i] = v;
                      setNewValues(copy);
                    }}
                    placeholder={`${col} दर्ज करें...`}
                  />
                </div>
              ))}
              <div className="form-field">
                <label>हाइलाइट टैग</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="newH" value="none" checked={newHighlight === "none"} onChange={(e) => setNewHighlight(e.target.value)} />
                    कोई नहीं
                  </label>
                  {Object.entries(activeList.highlights || {}).map(
                    ([k, v]) =>
                      v && (
                        <label key={k} className={`radio-label radio-${k}`}>
                          <input type="radio" name="newH" value={k} checked={newHighlight === k} onChange={(e) => setNewHighlight(e.target.value)} />
                          {v}
                        </label>
                      )
                  )}
                </div>
              </div>
            </div>
            <div className="add-form-actions">
              <button className="btn-primary" onClick={handleAddItem}>
                <FaPlus style={{ marginRight: 6 }} /> Create
              </button>
              <button
                className="btn-outline-light"
                onClick={() => {
                  setNewValues(new Array(activeList.columns.length).fill(""));
                  setNewHighlight("none");
                }}
              >
                <FaSync style={{ marginRight: 6 }} /> Clear
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
