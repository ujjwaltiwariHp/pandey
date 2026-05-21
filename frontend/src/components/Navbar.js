"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { FaSeedling, FaSignOutAlt, FaUserShield } from "react-icons/fa";

export default function Navbar() {
  const { admin, logout } = useAuth();
  const pathname = usePathname();
  const isAdmin = pathname === "/admin";

  return (
    <nav className="navbar">
      <Link href="/" className="nav-logo">
        <FaSeedling className="logo-icon" />
        <span>पाण्डेय ट्रेडर्स</span>
      </Link>
      <div className="nav-links">
        {!isAdmin && (
          <Link href="/#products" className="nav-link hide-mobile">
            हमारे उत्पाद
          </Link>
        )}
        {admin ? (
          <>
            {!isAdmin && (
              <Link href="/admin" className="nav-link hide-mobile">
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
