"use client";
import { FaArrowDown } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          उत्कृष्ट कृषि उत्पाद, <br />
          <span className="hero-highlight">सफल किसान का आधार</span>
        </h1>
        <p>
          पाण्डेय ट्रेडर्स — खाद एवं बीज भंडार में आपका स्वागत है। हम आपके
          खेतों के लिए सर्वोत्तम गुणवत्ता वाले खाद, बीज और कृषि रसायन प्रदान
          करते हैं।
        </p>
        <a href="#products" className="btn-explore">
          सभी उत्पाद देखें <FaArrowDown style={{ marginLeft: 8 }} />
        </a>
      </div>
    </section>
  );
}
