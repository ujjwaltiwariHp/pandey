"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import AdminPanel from "@/components/AdminPanel";

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <i className="fa-solid fa-spinner fa-spin fa-3x" style={{ color: "#1b5e20" }}></i>
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
