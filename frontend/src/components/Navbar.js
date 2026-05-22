"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { FaSeedling, FaSignOutAlt, FaUserShield, FaBars } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { admin, logout } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const isAdmin = pathname === "/admin";
  const showTransparent = isHome && !scrolled;

  return (
    <nav 
      className="navbar" 
      style={
        showTransparent 
          ? { background: 'transparent', borderBottom: 'none', boxShadow: 'none' } 
          : {}
      }
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {isAdmin && (
          <button 
            className="nav-mobile-menu-btn" 
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-admin-sidebar'))}
            aria-label="Open Sidebar"
          >
            <FaBars />
          </button>
        )}
        <Link href="/" className="nav-logo">
          <FaSeedling className="logo-icon" />
          <span>पाण्डेय ट्रेडर्स</span>
        </Link>
      </div>
      
      <div className="nav-links">
        {isHome && (
          <Link href="/#products" className="nav-link hide-mobile">
            हमारे उत्पाद
          </Link>
        )}
        {admin ? (
          <>
            {isHome ? (
              <Link href="/admin" className="nav-link hide-mobile">
                Admin Panel
              </Link>
            ) : (
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
