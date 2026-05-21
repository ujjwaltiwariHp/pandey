"use client";
import { useState, useRef, useEffect } from "react";
import { getHindiSuggestions } from "@/lib/api";
import { FaKeyboard } from "react-icons/fa";

export default function HindiInput({ value, onChange, placeholder, className, style }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [rawText, setRawText] = useState("");
  const timerRef = useRef(null);
  const wrapRef = useRef(null);

  const hasLatin = (str) => /[a-zA-Z]/.test(str);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setRawText(val);
    onChange(val);

    clearTimeout(timerRef.current);
    if (!val.trim() || !hasLatin(val.trim())) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      const words = val.trim().split(/\s+/);
      const lastWord = words[words.length - 1];
      if (hasLatin(lastWord)) {
        const results = await getHindiSuggestions(lastWord);
        if (results.length > 0) {
          setSuggestions(results);
          setShowSuggestions(true);
        }
      }
    }, 250);
  };

  const selectSuggestion = (hindi) => {
    const words = (rawText || value || "").trim().split(/\s+/);
    words[words.length - 1] = hindi;
    const newVal = words.join(" ") + " ";
    setRawText(newVal);
    onChange(newVal.trim());
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const isInline = className?.includes("inline-input");

  return (
    <div className={`hindi-input-wrap ${isInline ? "inline-wrap" : ""}`} ref={wrapRef}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={className || ""}
        style={style}
        autoComplete="off"
        onFocus={() => {
          if (suggestions.length > 0) setShowSuggestions(true);
        }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="hindi-suggestions">
          <div className="hindi-hint">
            <FaKeyboard style={{ color: "var(--primary-light)", marginRight: 6 }} /> 
            हिंदी में चुनें:
          </div>
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="hindi-option"
              onClick={() => selectSuggestion(s)}
            >
              <span className="hindi-text">{s}</span>
              <span className="hindi-eng">{rawText.trim().split(/\s+/).pop()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
