"use client";

import React, { useEffect } from "react";
import { Camera } from "lucide-react";

export interface RealQRScannerWrapperProps {
  onDecode: (data: string) => void;
  onError: (err: any) => void;
}

export const RealQRScannerWrapper: React.FC<RealQRScannerWrapperProps> = ({
  onDecode,
  onError,
}) => {
  useEffect(() => {
    console.log("Simulating QR scanner initialization...");
  }, [onDecode, onError]);

  return (
    <div className="p-2 border border-indigo-400 bg-gray-50 rounded-xl space-y-3 shadow-inner">
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-800 flex items-center justify-center gap-2">
          <Camera className="h-5 w-5 text-indigo-600" />
          Live Camera View
        </p>
      </div>
      <div
        id="reader"
        className="w-full aspect-square max-h-80 mx-auto bg-gray-900 border-4 border-solid border-indigo-600 rounded-xl flex flex-col items-center justify-center p-4 relative overflow-hidden"
      >
        <Camera className="h-16 w-16 text-white z-10 opacity-70" />
        <p className="text-center text-white mt-2 font-medium z-10">
          AWAITING CAMERA START...
        </p>
      </div>
    </div>
  );
};
