"use client";
import { FaArrowDown, FaPhone } from "react-icons/fa6";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="hero-overlay"></div>
      
      <div className="hero-content">
        <h1>
          उत्कृष्ट कृषि उत्पाद, <br />
          <span className="hero-highlight">सफल किसान का आधार</span>
        </h1>
        <p>
          पाण्डेय ट्रेडर्स — खाद एवं बीज भंडार में आपका स्वागत है। हम आपके
          खेतों के लिए सर्वोत्तम गुणवत्ता वाले खाद, बीज और कृषि रसायन प्रदान
          करते हैं। हमारी प्राथमिकता आपकी फसल की सर्वोत्तम पैदावार है।
        </p>
        <div className="hero-actions">
          <a href="#products" className="btn-primary-lg">
            सभी उत्पाद देखें <FaArrowDown />
          </a>
          <a href="tel:+918969730344" className="btn-secondary-lg">
            संपर्क करें <FaPhone />
          </a>
        </div>
      </div>
    </section>
  );
}
