"use client";
import { FaLocationDot, FaPhone, FaFacebook, FaInstagram, FaWhatsapp, FaUser, FaSeedling, FaArrowUp } from "react-icons/fa6";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="site-footer">
      {/* Animated top bar */}
      <div className="footer-top-bar" />

      <div className="footer-content">
        {/* Left: Brand + Contact + Social */}
        <div className="footer-left">
          <div className="footer-brand-logo">
            <FaSeedling className="footer-brand-icon" />
            <span>पाण्डेय ट्रेडर्स</span>
          </div>
          <p className="footer-desc">
            गुणवत्तापूर्ण खाद, बीज एवं कृषि रसायन के विश्वसनीय विक्रेता।<br />
            किसानों का भरोसेमंद साथी — हर मौसम, हर फसल।
          </p>

          <div className="footer-contact-details">
            <div className="contact-item">
              <FaUser className="contact-icon" />
              <span>रतनेश पाण्डेय</span>
            </div>
            <div className="contact-item">
              <FaLocationDot className="contact-icon" />
              <span>बड़का गांव, गोपालगंज, बिहार</span>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <a href="tel:+918969730344">+91 8969730344</a>
            </div>
          </div>

          <div className="footer-social">
            <a href="https://www.facebook.com/share/1D1NWRnJez/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
              <FaFacebook />
            </a>
            <a href="https://www.instagram.com/ratnesh_kumar_pandey_?igsh=MTJqa3A2aGU0NDE4aA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
              <FaInstagram />
            </a>
            <a href="https://wa.me/918969730344" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Right: Map */}
        <div className="footer-map-container">
          <iframe
            src="https://maps.google.com/maps?q=26°24'45.1%22N%2084°16'01.4%22E&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "220px", borderRadius: "14px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Pandey Traders Location"
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-copy">© 2026 पाण्डेय ट्रेडर्स · All Rights Reserved</p>
        <button className="footer-scroll-top" onClick={scrollToTop} title="Back to top">
          <FaArrowUp />
        </button>
      </div>
    </footer>
  );
}
