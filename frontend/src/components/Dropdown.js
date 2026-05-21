"use client";
import { useState, useRef, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa";

export default function Dropdown({ options = [], value, onChange, placeholder = "— Select —", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  // Resolve active option label
  const activeOption = options.find((opt) => 
    typeof opt === "object" ? opt.value === value : opt === value
  );
  
  const displayLabel = activeOption
    ? (typeof activeOption === "object" ? activeOption.label : activeOption)
    : placeholder;

  return (
    <div className={`custom-dropdown-wrap ${className}`} ref={dropdownRef}>
      <button 
        type="button" 
        className="custom-dropdown-btn" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayLabel}</span>
        <FaAngleDown className={`dropdown-chevron ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <ul className="custom-dropdown-list">
          {options.map((opt, idx) => {
            const val = typeof opt === "object" ? opt.value : opt;
            const label = typeof opt === "object" ? opt.label : opt;
            const isSelected = val === value;

            return (
              <li 
                key={idx} 
                className={`custom-dropdown-item ${isSelected ? "selected" : ""}`}
                onClick={() => handleSelect(val)}
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
