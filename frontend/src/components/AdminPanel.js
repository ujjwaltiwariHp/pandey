"use client";
import { useState, useEffect, useRef } from "react";
import HindiInput from "./HindiInput";
import AddItemModal from "./AddItemModal";
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
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editValues, setEditValues] = useState([]);
  const [editHighlight, setEditHighlight] = useState("none");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [toast, setToast] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
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

  const handleDeleteList = async (id = activeListId, title = activeList?.title) => {
    if (!id) return;
    if (!confirm(`क्या आप "${title}" लिस्ट को हटाना चाहते हैं?`)) return;
    try {
      await deleteList(id);
      if (activeListId === id) setActiveListId(null);
      await loadLists();
      showToast("लिस्ट हटा दिया गया!");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Item CRUD
  const handleAddItem = async (itemData) => {
    if (!activeList) return;
    try {
      await createItem(activeList.id, itemData);
      setShowAddItemModal(false);
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
    }, 500);
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

  // Dashboard Stats
  const totalCategories = lists.length;
  const grandTotalItems = lists.reduce((acc, l) => acc + (l.items?.length || 0), 0);

  // Pagination Slice
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Custom Dropdown values formulation
  const filterOptions = activeList
    ? [
        { value: "", label: "— सभी टैग —" },
        ...Object.entries(activeList.highlights || {})
          .map(([key, label]) => ({ value: key, label }))
          .filter((opt) => opt.label),
      ]
    : [];

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
                   <th>टैग</th>
                 </tr>
               </thead>
               <tbody>
                 {pageItems.map((item, idx) => {
                   const vals = item.item_values || [];
                   const hColor = item.highlight || "none";
                   const highlightText = activeList.highlights[item.highlight] || "सामान्य";
                   return (
                     <tr key={item.id} className={`print-row-${hColor}`}>
                       <td>{pageIndex * itemsPerPagePrint + idx + 1}</td>
                       {activeList.columns.map((col, ci) => (
                         <td key={ci}>{vals[ci] || "—"}</td>
                       ))}
                       <td style={{ fontWeight: 'bold' }}>{highlightText}</td>
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

      {showAddItemModal && activeList && (
        <AddItemModal
          columns={activeList.columns}
          highlights={activeList.highlights}
          onSave={handleAddItem}
          onClose={() => setShowAddItemModal(false)}
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
                <button className="btn-primary" onClick={() => setShowAddItemModal(true)}>
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
              {/* Category specific stats */}
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
                
                {/* Premium Custom Dropdown replace native select */}
                <Dropdown
                  options={filterOptions}
                  value={filterType}
                  onChange={setFilterType}
                  placeholder="— सभी टैग —"
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
                      <th>टैग (कैटेगरी)</th>
                      <th style={{textAlign: 'center'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={activeList.columns.length + 3}
                          style={{ textAlign: "center", padding: 50, color: "#999" }}
                        >
                          <FaBoxOpen style={{ fontSize: '3rem', color: "#eee", marginBottom: 15 }} />
                          <div>कोई आइटम नहीं मिला</div>
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((item, idx) => {
                        const vals = item.item_values || [];
                        const isEditing = editingItemId === item.id;

                        if (isEditing) {
                          return (
                            <tr key={item.id} style={{background: '#f8faf8'}}>
                              <td style={{fontWeight: 700}}>{indexOfFirstItem + idx + 1}</td>
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
                                <div className="radio-group-vertical">
                                   <label><input type="radio" name={`e-${item.id}`} value="none" checked={editHighlight === 'none'} onChange={(e) => setEditHighlight(e.target.value)} /> कोई नहीं</label>
                                   {Object.entries(activeList.highlights || {}).map(([k, v]) => v && (
                                     <label key={k} style={{color: k === 'orange' ? '#e65100' : k === 'green' ? '#2e7d32' : '#6a1b9a', fontWeight: 'bold'}}>
                                       <input type="radio" name={`e-${item.id}`} value={k} checked={editHighlight === k} onChange={(e) => setEditHighlight(e.target.value)} /> {v}
                                     </label>
                                   ))}
                                </div>
                              </td>
                              <td>
                                <div style={{display: 'flex', gap: 5, justifyContent: 'center'}}>
                                  <button className="btn-icon" onClick={handleSaveEdit} title="Save"><FaSave style={{ color: '#2e7d32' }} /></button>
                                  <button className="btn-icon" onClick={() => setEditingItemId(null)} title="Cancel"><FaTimes style={{ color: '#dc2626' }} /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        const hColor = item.highlight || "none";
                        const labelText = activeList.highlights[item.highlight] || "सामान्य";

                        return (
                          <tr key={item.id}>
                            <td style={{color: '#888', fontWeight: 'bold'}}>{indexOfFirstItem + idx + 1}</td>
                            {activeList.columns.map((col, ci) => (
                              <td key={ci} className={ci === 0 ? "td-name" : "td-center"}>
                                {vals[ci] || "—"}
                              </td>
                            ))}
                            {/* Premium pill variety tags as labels in columns */}
                            <td>
                              <span className={`label-badge label-badge-${hColor}`}>
                                {labelText}
                              </span>
                            </td>
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
