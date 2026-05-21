"use client";
import { FaLocationDot, FaPhone, FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <h3>पाण्डेय ट्रेडर्स</h3>
        <p className="footer-desc">गुणवत्तापूर्ण खाद, बीज एवं कृषि रसायन के विश्वनीय विक्रेता।</p>
        <p className="footer-contact">
          <span><FaLocationDot /> बड़का गांव, गोपालगंज, बिहार</span>
          <span className="footer-divider">|</span>
          <a href="tel:+918969730344"><FaPhone /> +91 8969730344</a>
        </p>

        <div className="footer-map">
          <iframe 
            src="https://maps.google.com/maps?q=26°24'45.1%22N%2084°16'01.4%22E&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="250" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Pandey Traders Location"
          ></iframe>
        </div>
        <div className="footer-social">
          <a href="https://www.facebook.com/share/1D1NWRnJez/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook />
          </a>
          <a href="https://www.instagram.com/ratnesh_kumar_pandey_?igsh=MTJqa3A2aGU0NDE4aA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://wa.me/918969730344" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <FaWhatsapp />
          </a>
        </div>
        <p className="footer-copy">© 2026 Pandey Traders. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
