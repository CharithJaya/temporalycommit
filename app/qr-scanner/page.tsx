"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import dynamic from "next/dynamic";

// ✅ Dynamic import of QRScanner component (client-side only)
const QRScanner = dynamic(() => import("@/components/qr-scanner/QRScanner"), {
  ssr: false,
});

export default function QRScannerPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const userIsAdmin = isAdmin();

  useEffect(() => {
    if (!user) router.push("/login");
    else if (!userIsAdmin) router.push("/dashboard");
  }, [user, userIsAdmin, router]);

  if (!user || !userIsAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar className="w-64 hidden lg:block" />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">QR Code Scanner</h1>
              <p className="text-muted-foreground mt-1">
                Scan member QR codes for quick attendance tracking.
              </p>
            </div>
            <div className="flex justify-center">
              <QRScanner />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
