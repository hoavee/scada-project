"use client";

import React from "react";

export default function Home() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hàng thẻ trạng thái Elevators, Escalators... */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Elevators", "Escalators", "Moving Sidewalks"].map((title, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <span className="text-xs font-black text-gray-600 uppercase tracking-widest">
                  {title}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between p-2 border border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                      All Good
                    </span>
                  </div>
                  <span className="font-bold text-gray-700">
                    {idx === 2 ? "40/46" : idx === 1 ? "62/62" : "72/78"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 border border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                      Offline
                    </span>
                  </div>
                  <span className="font-bold text-gray-700">
                    {idx === 0 ? "6/78" : "0"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hoạt động gần đây */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-300 p-5 rounded-sm shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:w-2 transition-all"></div>
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
              Open Activities
            </h3>
            <div className="flex items-end gap-6">
              <span className="text-5xl font-black text-gray-800 leading-none tracking-tighter">
                14
              </span>
              <div className="flex-1 text-xs font-bold text-gray-500 space-y-1">
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span>Maintenance</span>
                  <span className="text-blue-600">10</span>
                </div>
                <div className="flex justify-between">
                  <span>Repair</span>
                  <span className="text-orange-600">4</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-300 p-5 rounded-sm shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gray-400 group-hover:w-2 transition-all"></div>
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
              History This Month
            </h3>
            <div className="flex items-end gap-6">
              <span className="text-5xl font-black text-gray-800 leading-none tracking-tighter">
                122
              </span>
              <div className="flex-1 text-xs font-bold text-gray-500 space-y-1">
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span>Maintenance</span>
                  <span className="text-blue-600">110</span>
                </div>
                <div className="flex justify-between">
                  <span>Repair</span>
                  <span className="text-orange-600">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
