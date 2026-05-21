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
  FaBoxOpen,
  FaSpinner,
  FaSeedling,
  FaListUl,
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
                    <span>📞 8969730344</span>
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 15 }}>
        <FaSpinner className="fa-spin" style={{ fontSize: '3rem', color: "var(--primary)" }} />
        <div style={{ fontWeight: 'bold' }}>डेटा लोड हो रहा है...</div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
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

      {renderPrintPages()}

      <aside className="admin-sidebar hide-mobile">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaSeedling /> पाण्डेय ट्रेडर्स
          </div>
          <div className="sidebar-subtitle">Admin Dashboard</div>
        </div>
        
        <div className="sidebar-actions">
          <button className="btn-sidebar-add" onClick={() => { setEditingList(null); setShowListModal(true); }}>
            <FaPlus /> Create List
          </button>
        </div>

        <div className="sidebar-lists">
          {lists.map((l) => (
            <button
              key={l.id}
              className={`sidebar-list-item ${l.id === activeListId ? "active" : ""}`}
              onClick={() => setActiveListId(l.id)}
            >
              <FaListUl />
              {l.title.length > 20 ? l.title.slice(0, 18) + "…" : l.title}
            </button>
          ))}
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-title">
             {activeList ? activeList.title : "Dashboard"}
          </div>
          <div className="topbar-actions">
            {activeList && (
              <>
                <button className="btn-secondary" onClick={() => { setEditingList(activeList); setShowListModal(true); }}>
                  <FaEdit /> Edit
                </button>
                <button className="btn-danger" onClick={handleDeleteList}>
                  <FaTrash /> Delete
                </button>
                <button className="btn-primary" onClick={downloadImage} disabled={isDownloading} style={{background: 'var(--accent)'}}>
                  {isDownloading ? <FaSpinner className="fa-spin" /> : <FaDownload />} Download Image
                </button>
              </>
            )}
          </div>
        </div>

        <div className="admin-content">
          {!activeList ? (
            <div className="empty-state">
              <FaBoxOpen style={{ fontSize: '4rem', color: "#ccc", marginBottom: 20 }} />
              <h2>कोई लिस्ट नहीं है</h2>
              <p>नया लिस्ट बनाने के लिए "Create List" पर क्लिक करें।</p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{background: 'rgba(21,76,24,0.1)', color: 'var(--primary)'}}>
                    <FaListUl />
                  </div>
                  <div className="stat-info">
                    <h4>कुल आइटम</h4>
                    <p>{totalItems}</p>
                  </div>
                </div>
                {Object.entries(highlightCounts).map(([key, count]) =>
                  activeList.highlights[key] && (
                    <div className="stat-card" key={key}>
                      <div className="stat-icon" style={{
                        background: key==='orange'?'#fff3e0':key==='green'?'#e8f5e9':'#f3e5f5',
                        color: key==='orange'?'#e65100':key==='green'?'#2e7d32':'#6a1b9a'
                      }}>
                        <FaBoxOpen />
                      </div>
                      <div className="stat-info">
                        <h4>{activeList.highlights[key]}</h4>
                        <p>{count}</p>
                      </div>
                    </div>
                  )
                )}
              </div>

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

              {/* Table */}
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>क्र.सं.</th>
                      {activeList.columns.map((col, i) => (
                        <th key={i}>{col}</th>
                      ))}
                      <th style={{textAlign: 'center'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={activeList.columns.length + 2}
                          style={{ textAlign: "center", padding: 50, color: "#999" }}
                        >
                          <FaBoxOpen style={{ fontSize: '3rem', color: "#eee", marginBottom: 15 }} />
                          <div>कोई आइटम नहीं मिला</div>
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item, idx) => {
                        const vals = item.item_values || [];
                        const isEditing = editingItemId === item.id;

                        if (isEditing) {
                          return (
                            <tr key={item.id} style={{background: '#f8faf8'}}>
                              <td style={{fontWeight: 700}}>{idx + 1}</td>
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
                                <div className="action-btns" style={{flexDirection: 'column', gap: 10, alignItems: 'center'}}>
                                  <div className="radio-group-vertical">
                                     <label><input type="radio" name={`e-${item.id}`} value="none" checked={editHighlight === 'none'} onChange={(e) => setEditHighlight(e.target.value)} /> कोई नहीं</label>
                                     {Object.entries(activeList.highlights || {}).map(([k, v]) => v && (
                                       <label key={k} style={{color: k === 'orange' ? '#e65100' : k === 'green' ? '#2e7d32' : '#6a1b9a', fontWeight: 'bold'}}>
                                         <input type="radio" name={`e-${item.id}`} value={k} checked={editHighlight === k} onChange={(e) => setEditHighlight(e.target.value)} /> {v}
                                       </label>
                                     ))}
                                  </div>
                                  <div style={{display: 'flex', gap: 5}}>
                                    <button className="btn-icon" onClick={handleSaveEdit} title="Save"><FaSave style={{ color: '#2e7d32' }} /></button>
                                    <button className="btn-icon" onClick={() => setEditingItemId(null)} title="Cancel"><FaTimes style={{ color: '#dc2626' }} /></button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        const hColor = item.highlight || "none";
                        let borderClass = "";
                        if (hColor === "orange") borderClass = "4px solid #ff9800";
                        else if (hColor === "green") borderClass = "4px solid #4caf50";
                        else if (hColor === "purple") borderClass = "4px solid #9c27b0";

                        return (
                          <tr key={item.id} style={{borderLeft: borderClass}}>
                            <td style={{color: '#888', fontWeight: 'bold'}}>{idx + 1}</td>
                            {activeList.columns.map((col, ci) => (
                              <td key={ci} className={ci === 0 ? "td-name" : "td-center"}>
                                {vals[ci] || "—"}
                              </td>
                            ))}
                            <td className="td-center">
                              <div className="action-btns">
                                <button className="btn-icon" onClick={() => startEditItem(item)} title="Edit"><FaEdit style={{ color: 'var(--primary-light)' }} /></button>
                                <button className="btn-icon" onClick={() => handleDeleteItem(item.id, vals[0])} title="Delete"><FaTrash style={{ color: '#dc2626' }} /></button>
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
                <div className="add-form-title">
                  <div style={{background: 'rgba(46,125,50,0.1)', padding: 10, borderRadius: 10, display: 'flex'}}><FaPlus style={{ color: 'var(--primary-light)' }} /></div>
                  नया आइटम जोड़ें
                </div>
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
                    <FaPlus /> Add
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setNewValues(new Array(activeList.columns.length).fill(""));
                      setNewHighlight("none");
                    }}
                  >
                    <FaSync /> Clear
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
