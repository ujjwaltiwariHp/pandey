"use client";
import { useState, useEffect, useRef } from "react";
import HindiInput from "./HindiInput";
import Dropdown from "./Dropdown";
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
  FaDownload,
  FaBoxOpen,
  FaSpinner,
  FaSeedling,
  FaListUl,
  FaTachometerAlt,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";

export default function AdminPanel() {
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null); // null means Dashboard Home
  const [loading, setLoading] = useState(true);
  const [showListModal, setShowListModal] = useState(false);
  
  // Item Form Panel (rendered above table)
  const [showItemForm, setShowItemForm] = useState(false);
  const [formValues, setFormValues] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  
  const [editingList, setEditingList] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [toast, setToast] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // Custom Delete Confirmation Modal target
  
  // Table Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const printRef = useRef(null);

  const loadLists = async () => {
    try {
      const data = await fetchLists();
      setLists(data || []);
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
    setCurrentPage(1);
    setSearchQuery("");
    setFilterType("");
    resetItemForm();
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

  const handleDeleteList = (id = activeListId, title = activeList?.title) => {
    if (!id) return;
    setDeleteTarget({ type: 'list', id, title });
  };

  // Item Form Methods
  const startEditItem = (item) => {
    setEditingItemId(item.id);
    setFormValues([...(item.item_values || [])]);
    setShowItemForm(true);
    // Scroll smoothly to form
    setTimeout(() => {
      const formEl = document.getElementById("inline-item-form-anchor");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const resetItemForm = () => {
    setEditingItemId(null);
    setShowItemForm(false);
    if (activeList) {
      setFormValues(new Array(activeList.columns.length).fill(""));
    } else {
      setFormValues([]);
    }
  };

  const handleSaveItemForm = async () => {
    if (!activeList) return;
    if (!formValues[0]?.trim()) {
      showToast("पहला कॉलम (नाम) भरना अनिवार्य है।", "error");
      return;
    }
    try {
      // Deterministic variety tag color based on hash of prakar value (usually columns[1])
      const prakarVal = formValues[1] || formValues[0] || "";
      const softColors = ["green", "orange", "purple", "blue", "teal", "rose", "cyan"];
      let hash = 0;
      for (let i = 0; i < prakarVal.length; i++) {
        hash = prakarVal.charCodeAt(i) + ((hash << 5) - hash);
      }
      const tagColor = softColors[Math.abs(hash) % softColors.length];

      if (editingItemId) {
        await updateItem(editingItemId, {
          item_values: formValues,
          highlight: tagColor,
        });
        showToast("उत्पाद अपडेट हो गया!");
      } else {
        await createItem(activeList.id, {
          item_values: formValues,
          highlight: tagColor,
        });
        showToast("उत्पाद जोड़ा गया!");
      }
      resetItemForm();
      await loadLists();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDeleteItem = (id, name) => {
    setDeleteTarget({ type: 'item', id, title: name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    try {
      if (type === 'list') {
        await deleteList(id);
        if (activeListId === id) setActiveListId(null);
        showToast("लिस्ट हटा दिया गया!");
      } else if (type === 'item') {
        await deleteItem(id);
        showToast("उत्पाद हटा दिया गया!");
      }
      setDeleteTarget(null);
      await loadLists();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Helper for color palettes
  const getVarietyColorStyles = (varietyName) => {
    if (!varietyName) return { bg: "#f5f5f5", text: "#666", name: "none" };
    const softColors = ["green", "orange", "purple", "blue", "teal", "rose", "cyan"];
    let hash = 0;
    for (let i = 0; i < varietyName.length; i++) {
      hash = varietyName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorName = softColors[Math.abs(hash) % softColors.length];
    switch (colorName) {
      case "green": return { bg: "#e8f5e9", text: "#2e7d32", name: "green" };
      case "orange": return { bg: "#fff3e0", text: "#e65100", name: "orange" };
      case "purple": return { bg: "#f3e5f5", text: "#6a1b9a", name: "purple" };
      case "blue": return { bg: "#e3f2fd", text: "#1565c0", name: "blue" };
      case "teal": return { bg: "#e0f2f1", text: "#00695c", name: "teal" };
      case "rose": return { bg: "#fce4ec", text: "#c2185b", name: "rose" };
      case "cyan": return { bg: "#e0f7fa", text: "#00838f", name: "cyan" };
      default: return { bg: "#f5f5f5", text: "#666", name: "none" };
    }
  };

  // Download functionality
  const downloadImage = async () => {
    if (!activeList || !activeList.items || activeList.items.length === 0) {
      showToast("डाउनलोड करने के लिए कोई आइटम नहीं है।", "error");
      return;
    }
    setIsDownloading(true);
    showToast("छवि डाउनलोड की जा रही है, कृपया प्रतीक्षा करें...");

    setTimeout(async () => {
      try {
        const container = printRef.current;
        if (!container) throw new Error("Print container not found");

        const pages = container.querySelectorAll(".print-page");
        const canvasList = [];

        for (let i = 0; i < pages.length; i++) {
          const canvas = await html2canvas(pages[i], {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
          });
          canvasList.push(canvas);
        }

        canvasList.forEach((canvas, index) => {
          const link = document.createElement("a");
          link.download = `${activeList.title.replace(/\s+/g, "_")}_Page_${index + 1}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        });

        showToast("डाउनलोड सफल!");
      } catch (err) {
        showToast("छवि जनरेट करने में विफलता", "error");
      } finally {
        setIsDownloading(false);
      }
    }, 500);
  };

  // Filtering Items
  const filteredItems = activeList
    ? (activeList.items || []).filter((item) => {
        const vals = item.item_values || [];
        const matchQ =
          !searchQuery ||
          vals.some((v) => (v || "").toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Find if types match variety filter
        const prakarColIdx = activeList.columns.findIndex(c => c.includes("प्रकार"));
        const itemVariety = prakarColIdx !== -1 ? vals[prakarColIdx] : "";
        const matchF = !filterType || itemVariety === filterType;
        
        return matchQ && matchF;
      })
    : [];

  // Dynmic Variety Counts
  const prakarCounts = {};
  const distinctVarieties = [];
  if (activeList && activeList.items) {
    const prakarColIdx = activeList.columns.findIndex(c => c.includes("प्रकार"));
    activeList.items.forEach((item) => {
      const vals = item.item_values || [];
      const val = prakarColIdx !== -1 ? vals[prakarColIdx] : "";
      if (val && val !== "—") {
        prakarCounts[val] = (prakarCounts[val] || 0) + 1;
        if (!distinctVarieties.includes(val)) {
          distinctVarieties.push(val);
        }
      }
    });
  }

  const totalItems = activeList?.items?.length || 0;

  // Dashboard Stats
  const totalCategories = lists.length;
  const grandTotalItems = lists.reduce((acc, l) => acc + (l.items?.length || 0), 0);

  // Pagination Slice
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Dynamic filter varieties options replace orange/green highlights
  const filterOptions = [
    { value: "", label: "— सभी प्रकार —" },
    ...distinctVarieties.map((v) => ({ value: v, label: v }))
  ];

  // Print Pagination (Max 20 per page)
  const renderPrintPages = () => {
    if (!activeList || !isDownloading) return null;
    const items = activeList.items || [];
    const itemsPerPagePrint = 20;
    const pages = [];
    
    for (let i = 0; i < items.length; i += itemsPerPagePrint) {
      pages.push(items.slice(i, i + itemsPerPagePrint));
    }

    return (
      <div className="print-container-hidden" ref={printRef}>
        {pages.map((pageItems, pageIndex) => (
          <div className="print-page" key={pageIndex}>
             <div className="print-header">
                <h2>पाण्डेय ट्रेडर्स</h2>
                <p>थोक एवं फुटकर विक्रेता</p>
                <div className="print-contact">
                  <span>मो: 9839424683, 9839356391</span>
                  <span>स्थान: बस डिपो के सामने, हरैया - बस्ती</span>
                </div>
             </div>
             
             <div className="print-title">
               {activeList.title} — Page {pageIndex + 1} of {pages.length}
             </div>

             <table className="print-table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>क्र.सं.</th>
                    {activeList.columns.map((col, ci) => (
                      <th key={ci}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((item, idx) => {
                    const vals = item.item_values || [];
                    const prakarColIdx = activeList.columns.findIndex(c => c.includes("प्रकार"));
                    const prakarVal = prakarColIdx !== -1 ? vals[prakarColIdx] : "";
                    const styles = getVarietyColorStyles(prakarVal);
                    
                    return (
                      <tr key={item.id} className={`print-row-${styles.name}`}>
                        <td>{pageIndex * itemsPerPagePrint + idx + 1}</td>
                        {activeList.columns.map((col, ci) => {
                          const isPrakar = col.includes("प्रकार");
                          if (isPrakar && styles.name !== "none") {
                            return (
                              <td key={ci} style={{ fontWeight: 'bold' }}>
                                {vals[ci] || "—"}
                              </td>
                            );
                          }
                          return <td key={ci}>{vals[ci] || "—"}</td>;
                        })}
                      </tr>
                    );
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
      
      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <FaTrash />
            </div>
            <h3 className="delete-modal-title">क्या आप हटाना चाहते हैं?</h3>
            <p className="delete-modal-text">
              क्या आप सचमुच <strong>"{deleteTarget.title}"</strong> को हमेशा के लिए हटाना चाहते हैं? यह प्रक्रिया वापस नहीं ली जा सकती।
            </p>
            <div className="delete-modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="btn-danger-confirm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
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

      {renderPrintPages()}

      {/* Sidebar navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaSeedling /> पाण्डेय ट्रेडर्स
          </div>
          <div className="sidebar-subtitle">Admin Dashboard</div>
        </div>
        
        <div className="sidebar-menu">
          <button 
            className={`sidebar-menu-btn ${activeListId === null ? "active" : ""}`}
            onClick={() => setActiveListId(null)}
          >
            <FaTachometerAlt /> Dashboard Home
          </button>
          <button 
            className="sidebar-menu-btn" 
            onClick={() => { setEditingList(null); setShowListModal(true); }}
          >
            <FaPlus /> Create Category
          </button>
        </div>

        <div className="sidebar-section-title">Categories</div>
        <div className="sidebar-lists">
          {lists.length === 0 ? (
            <div style={{ padding: '10px 24px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>कोई लिस्ट उपलब्ध नहीं है</div>
          ) : (
            lists.map((l) => (
              <button
                key={l.id}
                className={`sidebar-list-item ${l.id === activeListId ? "active" : ""}`}
                onClick={() => setActiveListId(l.id)}
              >
                <FaListUl />
                {l.title.length > 20 ? l.title.slice(0, 18) + "…" : l.title}
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Navigation Bar */}
        <div className="admin-topbar">
          <div className="topbar-title">
             {activeList ? activeList.title : "Dashboard"}
          </div>
          <div className="topbar-actions">
            <a href="/" target="_blank" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaExternalLinkAlt /> Public Site
            </a>
            {activeList ? (
              <>
                <button className="btn-primary" onClick={() => {
                  setShowItemForm(true);
                  setEditingItemId(null);
                  setFormValues(new Array(activeList.columns.length).fill(""));
                  setTimeout(() => {
                    const formEl = document.getElementById("inline-item-form-anchor");
                    if (formEl) formEl.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 100);
                }}>
                  <FaPlus /> Add Item
                </button>
                <button className="btn-secondary" onClick={() => { setEditingList(activeList); setShowListModal(true); }}>
                  <FaEdit /> Edit Category
                </button>
                <button className="btn-danger" onClick={() => handleDeleteList(activeList.id, activeList.title)}>
                  <FaTrash /> Delete Category
                </button>
                <button className="btn-primary" onClick={downloadImage} disabled={isDownloading} style={{background: 'var(--accent)'}}>
                  {isDownloading ? <FaSpinner className="fa-spin" /> : <FaDownload />} Download Image
                </button>
              </>
            ) : (
              <button className="btn-primary" onClick={() => { setEditingList(null); setShowListModal(true); }}>
                <FaPlus /> Create Category
              </button>
            )}
          </div>
        </div>

        <div className="admin-content">
          {/* DASHBOARD HOME VIEW */}
          {activeListId === null && (
            <div className="dashboard-view">
              <div className="dashboard-hero">
                <h2>स्वागत है, एडमिन!</h2>
                <p>यहाँ से आप अपने खाद, बीज एवं कृषि रसायनों के मूल्य और विवरण को व्यवस्थित कर सकते हैं।</p>
              </div>

              {/* General Stats */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{background: 'rgba(21,76,24,0.1)', color: 'var(--primary)'}}>
                    <FaListUl />
                  </div>
                  <div className="stat-info">
                    <h4>कुल श्रेणियाँ (Categories)</h4>
                    <p>{totalCategories}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{background: 'rgba(255,193,7,0.1)', color: 'var(--accent)'}}>
                    <FaSeedling />
                  </div>
                  <div className="stat-info">
                    <h4>कुल उपलब्ध उत्पाद</h4>
                    <p>{grandTotalItems}</p>
                  </div>
                </div>
              </div>

              <div className="dashboard-section-header">
                कैटेगरी लिस्ट
              </div>

              {/* Categories Grid (Cards) */}
              {lists.length === 0 ? (
                <div className="empty-state">
                  <FaBoxOpen style={{ fontSize: '4rem', color: "#ccc", marginBottom: 20 }} />
                  <h2>कोई लिस्ट नहीं मिली</h2>
                  <p>नया लिस्ट बनाने के लिए ऊपर "Create Category" पर क्लिक करें।</p>
                </div>
              ) : (
                <div className="category-cards-grid">
                  {lists.map((l) => (
                    <div className="category-card" key={l.id} onClick={() => setActiveListId(l.id)}>
                      <div className="card-icon-wrap">
                        <FaSeedling />
                      </div>
                      <h3>{l.title}</h3>
                      <div className="card-info">
                        <p style={{ marginBottom: 5 }}><strong>कॉलम:</strong> {l.columns.join(", ")}</p>
                        <p><strong>उत्पाद संख्या:</strong> {l.items?.length || 0} आइटम</p>
                      </div>
                      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                        <button className="btn-card-action btn-card-view" onClick={() => setActiveListId(l.id)}>
                          View Items
                        </button>
                        <button className="btn-card-action btn-card-edit" onClick={() => { setEditingList(l); setShowListModal(true); }}>
                          Edit
                        </button>
                        <button className="btn-card-action" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }} onClick={() => handleDeleteList(l.id, l.title)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ACTIVE CATEGORY VIEW */}
          {activeList && (
            <div className="category-view">
              {/* Category specific dynamic stats */}
              <div className="stats-grid" style={{ marginBottom: 30 }}>
                <div className="stat-card">
                  <div className="stat-icon" style={{background: 'rgba(21,76,24,0.1)', color: 'var(--primary)'}}>
                    <FaListUl />
                  </div>
                  <div className="stat-info">
                    <h4>कुल उत्पाद</h4>
                    <p>{totalItems}</p>
                  </div>
                </div>
                
                {Object.entries(prakarCounts).map(([varietyName, count]) => {
                  const styles = getVarietyColorStyles(varietyName);
                  return (
                    <div className="stat-card" key={varietyName}>
                      <div className="stat-icon" style={{
                        background: styles.bg,
                        color: styles.text
                      }}>
                        <FaBoxOpen />
                      </div>
                      <div className="stat-info">
                        <h4>{varietyName}</h4>
                        <p>{count}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Anchor for form scroll */}
              <div id="inline-item-form-anchor" />

              {/* Premium Inline Item Form Panel (Add / Edit) rendered directly above the table */}
              {(showItemForm || editingItemId) && (
                <div className="inline-form-card">
                  <div className="form-card-header">
                    <h3>
                      {editingItemId ? "उत्पाद विवरण बदलें (Edit Item)" : "नया उत्पाद जोड़ें (Add New Item)"}
                    </h3>
                    <button className="btn-close-form" onClick={resetItemForm} title="Close Form">
                      <FaTimes />
                    </button>
                  </div>
                  
                  <div className="form-card-grid">
                    {activeList.columns.map((col, idx) => (
                      <div className="form-field" key={idx}>
                        <label>{col} *</label>
                        <HindiInput
                          value={formValues[idx] || ""}
                          onChange={(v) => {
                            const copy = [...formValues];
                            copy[idx] = v;
                            setFormValues(copy);
                          }}
                          placeholder={`${col} दर्ज करें...`}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="form-card-actions">
                    <button className="btn-secondary" onClick={resetItemForm}>
                      Cancel
                    </button>
                    <button className="btn-primary" onClick={handleSaveItemForm}>
                      <FaSave /> {editingItemId ? "Update" : "Add"}
                    </button>
                  </div>
                </div>
              )}

              {/* Table Toolbar */}
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
                
                {/* Custom Dropdown variety filter replace native selects */}
                <Dropdown
                  options={filterOptions}
                  value={filterType}
                  onChange={setFilterType}
                  placeholder="— सभी प्रकार —"
                />
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
                    {currentItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={activeList.columns.length + 2}
                          style={{ textAlign: "center", padding: 50, color: "#999" }}
                        >
                          <FaBoxOpen style={{ fontSize: '3rem', color: "#eee", marginBottom: 15 }} />
                          <div>कोई उत्पाद नहीं मिला</div>
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((item, idx) => {
                        const vals = item.item_values || [];
                        
                        return (
                          <tr key={item.id}>
                            <td style={{color: '#888', fontWeight: 'bold'}}>{indexOfFirstItem + idx + 1}</td>
                            {activeList.columns.map((col, ci) => {
                              const isPrakar = col.includes("प्रकार");
                              const cellVal = vals[ci] || "—";
                              
                              if (isPrakar && cellVal !== "—") {
                                const styles = getVarietyColorStyles(cellVal);
                                return (
                                  <td key={ci} className="td-center">
                                    <span className={`label-badge label-badge-${styles.name}`}>
                                      {cellVal}
                                    </span>
                                  </td>
                                );
                              }
                              
                              return (
                                <td key={ci} className={ci === 0 ? "td-name" : "td-center"}>
                                  {cellVal}
                                </td>
                              );
                            })}
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-bar">
                  <div className="pagination-info">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} items
                  </div>
                  <div className="pagination-buttons">
                    <button 
                      className="btn-pagination" 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <FaAngleLeft style={{ marginRight: 6 }} /> Previous
                    </button>
                    <button 
                      className="btn-pagination" 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next <FaAngleRight style={{ marginLeft: 6 }} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
