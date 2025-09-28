"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Admin, Role } from "@/types";
import api from "@/lib/axios";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isAxiosError } from "axios"; // Ensure this is imported

// ... CreateAdminForm component remains the same ...

// --- Main Page Component ---
export default function ManageAdminsPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const response = await api.get("/admins");
      setAdmins(response.data.data);
    } catch (err) {
      console.error("Failed to fetch admins", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === Role.SUPERADMIN) {
      fetchAdmins();
    }
  }, [user]);

  const handleDelete = async (adminId: number) => {
    if (
      confirm(
        "Are you sure you want to delete this admin? This action cannot be undone."
      )
    ) {
      try {
        await api.delete(`/admins/${adminId}`);
        alert("Admin deleted successfully.");
        fetchAdmins(); // Refresh list
      } catch (err) {
        // ✅ FIX: Catch error as 'unknown'
        let errorMessage = "Failed to delete admin.";
        // ✅ FIX: Use the type guard to safely get the server message
        if (isAxiosError(err) && err.response) {
          errorMessage = err.response.data.message || errorMessage;
        }
        alert(errorMessage);
      }
    }
  };

  // ... rest of the component is the same
  if (user?.role !== Role.SUPERADMIN) {
    return (
      <div className="p-8 text-center text-red-600">
        Access Denied: This page is for SuperAdmins only.
      </div>
    );
  }

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Admins</h1>
      {/* ... rest of the JSX ... */}
    </div>
  );
}
