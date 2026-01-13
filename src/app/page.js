"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="min-h-screen bg-[#e0e0e0]" />;

  return (
    <div className="min-h-screen bg-[#d1d1d1] flex items-center justify-center p-6 font-sans select-none">
      {/* Container chính phong cách máy trạm điều khiển */}
      <div className="max-w-6xl w-full bg-white border-2 border-gray-400 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)] p-12 relative overflow-hidden">
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-gray-300"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-gray-300"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-gray-300"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-gray-300"></div>

        {/* Header điều khiển */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-800 tracking-tighter uppercase italic mb-2">
            Control <span className="text-blue-600">Gateway</span>
          </h1>
          <div className="flex justify-center items-center gap-3">
            <span className="h-[2px] w-12 bg-gray-300"></span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
              Select Operation Module
            </span>
            <span className="h-[2px] w-12 bg-gray-300"></span>
          </div>
        </div>

        {/* Khu vực nút bấm - Đã đổi thành 3 cột và giảm kích thước h-56 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Link đến SCADA */}
          <Link href="/scada" className="group">
            <div className="h-56 bg-gray-50 border-2 border-gray-300 p-1 group-hover:border-blue-500 transition-all duration-300 group-hover:shadow-xl group-active:translate-y-1">
              <div className="h-full border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden bg-white">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  🖥️
                </div>
                <h2 className="text-xl font-black text-gray-700 uppercase tracking-tighter italic">
                  System <span className="text-blue-600">SCADA</span>
                </h2>
                <p className="text-[9px] text-gray-400 font-bold mt-2 uppercase tracking-widest text-center">
                  Monitoring & Control
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 group-hover:bg-blue-500 transition-colors"></div>
              </div>
            </div>
          </Link>

          {/* Link đến Power Meter */}
          <Link href="/power-meter" className="group">
            <div className="h-56 bg-gray-50 border-2 border-gray-300 p-1 group-hover:border-green-600 transition-all duration-300 group-hover:shadow-xl group-active:translate-y-1">
              <div className="h-full border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden bg-white">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  ⚡
                </div>
                <h2 className="text-xl font-black text-gray-700 uppercase tracking-tighter italic">
                  Power <span className="text-green-700">Meter</span>
                </h2>
                <p className="text-[9px] text-gray-400 font-bold mt-2 uppercase tracking-widest text-center">
                  Real-time Power
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 group-hover:bg-green-600 transition-colors"></div>
              </div>
            </div>
          </Link>

          {/* Link đến Energy Consumption (Nút mới thêm) */}
          <Link href="/power-consume" className="group">
            <div className="h-56 bg-gray-50 border-2 border-gray-300 p-1 group-hover:border-orange-500 transition-all duration-300 group-hover:shadow-xl group-active:translate-y-1">
              <div className="h-full border border-gray-200 flex flex-col items-center justify-center relative overflow-hidden bg-white">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  📊
                </div>
                <h2 className="text-xl font-black text-gray-700 uppercase tracking-tighter italic">
                  Energy <span className="text-orange-600">Usage</span>
                </h2>
                <p className="text-[9px] text-gray-400 font-bold mt-2 uppercase tracking-widest text-center">
                  Consumption History
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 group-hover:bg-orange-500 transition-colors"></div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer ghi chú hệ thống */}
        <div className="mt-12 flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Server Status: Operational
          </div>
          <div>Authorized Personnel Only</div>
          <div>v2.0.26</div>
        </div>
      </div>
    </div>
  );
}
