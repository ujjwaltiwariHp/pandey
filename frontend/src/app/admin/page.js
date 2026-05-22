"use client";
import { useEffect, Suspense } from "react";
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
      router.replace("/login");
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
    <div style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <Navbar />
      <div style={{ flex: 1, marginTop: 70, height: "calc(100vh - 70px)", overflow: "hidden", position: "relative" }}>
        <Suspense fallback={
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50vh", gap: "16px" }}>
            <FaSpinner style={{ fontSize: "3rem", color: "#1b5e20", animation: "spin 1s linear infinite" }} />
            <p style={{ color: "#1b5e20", fontWeight: 600, fontSize: "1.1rem" }}>Loading Admin Panel...</p>
          </div>
        }>
          <AdminPanel />
        </Suspense>
      </div>
    </div>
  );
}
