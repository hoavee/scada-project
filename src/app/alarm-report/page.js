"use client";

import React from "react";
import { AlertCircle, History, Clock } from "lucide-react";

const AlarmRow = ({ id, time, date, message, type }) => {
  // Xác định màu sắc dựa trên nội dung hoặc type tương tự ảnh mẫu
  const getRowStyle = () => {
    if (id === 1) return "bg-blue-100 text-blue-900"; // Hàng đang chọn
    if (id === 2) return "bg-white text-amber-600"; // Cảnh báo vàng
    return "bg-white text-gray-700"; // Bình thường
  };

  return (
    <tr
      className={`${getRowStyle()} border-b border-gray-300 font-bold text-[11px] sm:text-[13px] uppercase tracking-tight`}
    >
      <td className="py-3 px-4 text-center border-r border-gray-300 w-12">
        {id}
      </td>
      <td className="py-3 px-4 border-r border-gray-300 font-mono italic">
        {time}
      </td>
      <td className="py-3 px-4 border-r border-gray-300 font-mono">{date}</td>
      <td className="py-3 px-4 italic">{message}</td>
    </tr>
  );
};

export default function AlarmReport() {
  const alarmData = [
    { id: 1, time: "08:43:12", date: "20/01/2026", message: "SYS POWER ON" },
    { id: 2, time: "08:43:12", date: "20/01/2026", message: "SYS POWER ON" },
    { id: 3, time: "08:43:12", date: "20/01/2026", message: "SYS POWER ON" },
  ];

  return (
    <div className="bg-gray-50 border-2 border-gray-400 shadow-xl flex flex-col overflow-hidden h-full min-h-[400px]">
      {/* Header - Theo style xanh đậm của PowerMeter */}
      <div className="bg-[#002d72] text-white text-[14px] sm:text-[16px] font-black py-3 px-4 uppercase tracking-widest flex justify-between items-center border-b-2 border-gray-500">
        <div className="flex items-center gap-2">ALARM REPORT</div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto bg-white p-1">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600 text-[10px] font-black uppercase tracking-widest border-b-2 border-gray-400">
              <th className="py-2 px-4 text-center border-r border-gray-300">
                No.
              </th>
              <th className="py-2 px-4 text-left border-r border-gray-300">
                Time
              </th>
              <th className="py-2 px-4 text-left border-r border-gray-300">
                Date
              </th>
              <th className="py-2 px-4 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {alarmData.map((alarm) => (
              <AlarmRow key={alarm.id} {...alarm} />
            ))}
            {/* Tạo các hàng trống để lấp đầy bảng giống HMI chuyên nghiệp */}
            {[...Array(5)].map((_, i) => (
              <tr key={`empty-${i}`} className="border-b border-gray-200 h-10">
                <td className="border-r border-gray-200"></td>
                <td className="border-r border-gray-200"></td>
                <td className="border-r border-gray-200"></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Controls - Theo style của page.js */}
      <div className="bg-gray-100 border-t-2 border-gray-300 p-3 flex justify-between items-center">
        <div className="flex gap-2">
          <button className="bg-gray-800 text-white px-4 py-1 text-[10px] font-bold uppercase hover:bg-blue-700 border-b-2 border-black active:translate-y-[1px]">
            Prev
          </button>
          <button className="bg-gray-800 text-white px-4 py-1 text-[10px] font-bold uppercase hover:bg-blue-700 border-b-2 border-black active:translate-y-[1px]">
            Next
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <History size={14} className="text-gray-400" />
          <span className="text-[9px] font-black text-gray-500 uppercase">
            LOGGING ACTIVE
          </span>
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-900"></div>
        </div>
      </div>
    </div>
  );
}
