"use client";
import {
  FaBuilding,
  FaCalendarDays,
  FaMountainSun,
  FaIndianRupeeSign,
  FaWeightHanging,
  FaTags,
  FaClock,
  FaCircleInfo,
  FaSackXmark,
  FaWheatAwn,
  FaLeaf,
  FaBox,
} from "react-icons/fa6";

function getColIcon(colName) {
  const n = (colName || "").toLowerCase();
  if (n.includes("कंपनी") || n.includes("ब्रांड")) return <FaBuilding />;
  if (n.includes("अवधि") || n.includes("दिन")) return <FaCalendarDays />;
  if (n.includes("भूमि")) return <FaMountainSun />;
  if (n.includes("मूल्य") || n.includes("₹")) return <FaIndianRupeeSign />;
  if (n.includes("पैकिंग") || n.includes("वजन")) return <FaWeightHanging />;
  if (n.includes("प्रकार") || n.includes("श्रेणी")) return <FaTags />;
  if (n.includes("नर्सरी") || n.includes("समय")) return <FaClock />;
  return <FaCircleInfo />;
}

function getCatIcon(title) {
  if (title.includes("खाद") || title.includes("Fertiliser")) return <FaSackXmark />;
  if (title.includes("गेहूँ")) return <FaWheatAwn />;
  return <FaLeaf />;
}

export default function CategorySection({ list }) {
  if (!list.items || list.items.length === 0) return null;

  return (
    <div className="category-container">
      <div className="category-title">
        <div className="cat-title-left">
          <span className="cat-icon-wrap">{getCatIcon(list.title)}</span>
          <span>{list.title}</span>
        </div>
        <span className="cat-count">
          <FaBox style={{ marginRight: 5 }} /> {list.items.length} आइटम
        </span>
      </div>
      <div className="products-grid">
        {list.items.map((item) => {
          const values = item.item_values || [];
          const title = values[0] || "—";
          
          // Deterministically get tag color based on variety (prakar)
          const prakarColIdx = list.columns.findIndex(c => c.includes("प्रकार"));
          const prakarVal = prakarColIdx !== -1 ? values[prakarColIdx] : "";
          
          let badgeText = prakarVal;
          let tagColor = "none";
          if (badgeText && badgeText !== "—") {
            const softColors = ["green", "orange", "purple", "blue", "teal", "rose", "cyan"];
            let hash = 0;
            for (let i = 0; i < badgeText.length; i++) {
              hash = badgeText.charCodeAt(i) + ((hash << 5) - hash);
            }
            tagColor = softColors[Math.abs(hash) % softColors.length];
          }

          return (
            <div className="product-card" key={item.id}>
              {badgeText && badgeText !== "—" && (
                <div className={`product-badge badge-${tagColor}`}>{badgeText}</div>
              )}
              <div className="product-title">{title}</div>
              <div className="product-details">
                {list.columns.slice(1).map((col, i) => {
                  const colIdx = i + 1;
                  const val = values[colIdx];
                  if (!val || val === "—") return null;
                  
                  // Skip rendering प्रकार inside the details since it's already a badge
                  if (col.includes("प्रकार")) return null;
                  
                  return (
                    <div className="product-detail" key={i}>
                      <span className="detail-label">
                        {getColIcon(col)} {col}
                      </span>
                      <span className="detail-value">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
