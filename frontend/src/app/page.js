"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";
import { fetchLists } from "@/lib/api";
import { FaWhatsapp, FaPhone, FaSpinner, FaBoxOpen } from "react-icons/fa6";

export default function HomePage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLists()
      .then((data) => setLists(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="hero-section-wrap">
        <Hero />
        <Features />
      </div>

      <section className="products-section" id="products">
        <div className="section-header">
          <span className="section-badge">कैटलॉग</span>
          <h2>हमारे उपलब्ध उत्पाद</h2>
        </div>

        {loading ? (
          <div className="empty-state">
            <FaSpinner className="fa-spin" style={{ fontSize: '3rem', color: "var(--primary)" }} />
            <p style={{ marginTop: 15, fontWeight: 600 }}>उत्पादों की सूची लोड की जा रही है...</p>
          </div>
        ) : lists.filter((l) => l.items?.length > 0).length === 0 ? (
          <div className="empty-state">
            <FaBoxOpen style={{ fontSize: '4rem', color: "#ccc", marginBottom: 15 }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>वर्तमान में कोई उत्पाद उपलब्ध नहीं है।</p>
          </div>
        ) : (
          lists
            .filter((l) => l.items?.length > 0)
            .map((list) => <CategorySection key={list.id} list={list} />)
        )}
      </section>

      <div className="floating-actions">
        <a href="tel:+918969730344" className="float-btn call-float" title="Call Us">
          <FaPhone />
        </a>
        <a href="https://wa.me/918969730344" target="_blank" rel="noopener noreferrer" className="float-btn wa-float" title="Contact on WhatsApp">
          <FaWhatsapp />
        </a>
      </div>

      <Footer />
    </>
  );
}
