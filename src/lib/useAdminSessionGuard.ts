"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

/**
 * Confirms the admin_token cookie is still valid on the server. A cached
 * `adminInfo` in localStorage is not proof of an active session — logging in
 * elsewhere invalidates the server-side session immediately (single-session
 * enforcement), so any open admin tab must re-check with the server rather
 * than trusting its local cache.
 */
export function useAdminSessionGuard() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const adminInfo = localStorage.getItem("adminInfo");
    if (!adminInfo) {
      router.push("/admin/login");
      return;
    }

    axios.get("/api/admin/check-auth").catch(() => {
      if (cancelled) return;
      localStorage.removeItem("adminInfo");
      router.push("/admin/login");
    });

    return () => {
      cancelled = true;
    };
  }, [router]);
}
