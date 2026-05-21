"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { FaSeedling, FaSignOutAlt, FaUserShield } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { admin, logout } = useAuth();
  const pathname = usePathname();
  const isAdmin = pathname === "/admin";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled || isAdmin ? "glass" : ""}`} style={{ background: scrolled || isAdmin ? 'rgba(255,255,255,0.9)' : 'transparent' }}>
      <Link href="/" className="nav-logo" style={{ color: scrolled || isAdmin ? 'var(--primary)' : 'white' }}>
        <FaSeedling className="logo-icon" style={{ color: scrolled || isAdmin ? 'var(--primary-light)' : '#ffc107' }} />
        <span>पाण्डेय ट्रेडर्स</span>
      </Link>
      <div className="nav-links">
        {!isAdmin && (
          <Link href="/#products" className="nav-link hide-mobile" style={{ color: scrolled || isAdmin ? 'var(--text)' : 'white' }}>
            हमारे उत्पाद
          </Link>
        )}
        {admin ? (
          <>
            {!isAdmin && (
              <Link href="/admin" className="nav-link hide-mobile" style={{ color: scrolled ? 'var(--text)' : 'white' }}>
                Admin Panel
              </Link>
            )}
            {isAdmin && (
              <Link href="/" className="nav-link hide-mobile">
                Public Site
              </Link>
            )}
            <button onClick={logout} className="btn-nav-logout">
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="btn-nav-admin">
            <FaUserShield /> Admin Login
          </Link>
        )}
      </div>
    </nav>
  );
}
