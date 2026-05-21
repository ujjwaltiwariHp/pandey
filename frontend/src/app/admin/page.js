"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import AdminPanel from "@/components/AdminPanel";
import { FaSpinner } from "react-icons/fa";

export default function AdminPage() {
  const { admin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) {
      router.push("/login");
    }
  }, [admin, loading, router]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "16px", background: "var(--bg)" }}>
        <FaSpinner style={{ fontSize: "3rem", color: "#1b5e20", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#1b5e20", fontWeight: 600, fontSize: "1.1rem" }}>Loading Admin Panel...</p>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 70 }}>
        <AdminPanel />
      </div>
    </>
  );
}
