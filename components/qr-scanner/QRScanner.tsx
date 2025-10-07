"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Camera, Scan, X, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ✅ Load RealQRScannerWrapper dynamically, client-side only
const RealQRScannerWrapper = dynamic(
  () =>
    import("./RealQRScannerWrapper").then(
      (mod) => mod.RealQRScannerWrapper
    ),
  { ssr: false }
);

export default function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"info" | "success" | "error">("info");

  const handleScanResult = useCallback((data: string) => {
    setScanResult(data);
    setIsScanning(false);
    setMessage(`QR Code Scanned Successfully! Data: ${data}`);
    setMessageType("success");
  }, []);

  const resetScanner = () => {
    setScanResult(null);
    setMessage("");
    setMessageType("info");
  };

  return (
    <Card className="w-full max-w-lg mx-auto transform hover:scale-[1.01] transition-transform duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-600">
          <Camera className="h-6 w-6" />
          QR Code Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* State 1: Ready to Scan */}
        {!isScanning && !scanResult && (
          <div className="text-center space-y-4">
            <div className="w-56 h-56 mx-auto border-4 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-4 bg-gray-50">
              <Scan className="h-16 w-16 text-gray-400 animate-pulse" />
              <p className="text-sm text-gray-500 mt-2">
                Tap below to start the camera.
              </p>
            </div>
            <Button
              onClick={() => setIsScanning(true)}
              className="w-full shadow-lg hover:shadow-xl bg-green-500 hover:bg-green-600 text-lg py-3"
            >
              <Scan className="mr-2 h-5 w-5" /> Activate Scanner
            </Button>
          </div>
        )}

        {/* State 2: Scanning */}
        {isScanning && !scanResult && (
          <div className="text-center space-y-4">
            <RealQRScannerWrapper
              onDecode={handleScanResult}
              onError={(err: unknown) => {
                console.error(err);
                setMessage("Camera Error: Check permissions.");
                setMessageType("error");
                setIsScanning(false);
              }}
            />
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-300 hover:bg-red-50"
              onClick={() => setIsScanning(false)}
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </div>
        )}

        {/* State 3: Completed */}
        {scanResult && (
          <div className="space-y-4">
            {message && (
              <div
                className={`p-4 rounded-xl flex items-center gap-3 shadow-md ${
                  messageType === "success"
                    ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                    : messageType === "error"
                    ? "bg-red-100 text-red-800 border-l-4 border-red-500"
                    : "bg-blue-100 text-blue-800 border-l-4 border-blue-500"
                }`}
              >
                {messageType === "success" && (
                  <CheckCircle className="h-5 w-5" />
                )}
                {messageType !== "success" && (
                  <AlertCircle className="h-5 w-5" />
                )}
                <span className="text-sm font-medium">{message}</span>
              </div>
            )}
            <Button
              onClick={resetScanner}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              <Scan className="mr-2 h-4 w-4" /> Scan Another
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
