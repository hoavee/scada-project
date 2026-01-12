"use client";

import React, { useState, useEffect } from "react";

// Thành phần hiển thị từng thẻ Power Meter (phong cách SCADA)
const MeterCard = ({ title, data }) => {
  return (
    <div className="bg-gray-50 border border-gray-300 shadow-md flex flex-col overflow-hidden h-full">
      {/* Header của thẻ - Nới rộng padding ngang */}
      <div className="bg-green-700 text-white text-[11px] font-black py-2 px-2 uppercase tracking-wider text-center border-b border-gray-400">
        {title}
      </div>

      {/* Danh sách thông số - Sử dụng flex-1 để lấp đầy chiều cao */}
      <div className="p-2 space-y-1.5 bg-white flex-1">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center text-[10.5px] gap-2"
          >
            <span className="text-gray-600 font-bold whitespace-nowrap italic uppercase">
              {item.label}:
            </span>
            {/* Nới rộng ô đen lên w-32 để chứa được các số kWh lớn như 2.060.685.715 */}
            <div className="bg-black border border-gray-400 px-1.5 py-1 text-[#ffff00] font-mono w-32 text-right shadow-inner flex justify-between items-baseline">
              <span className="truncate">{item.value}</span>
              <span className="text-[8px] text-gray-500 ml-1 font-sans uppercase shrink-0">
                {item.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chân thẻ */}
      <div className="bg-gray-50 border-t border-gray-100 px-2 py-1 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[8px] font-bold text-gray-400">LIVE</span>
        </div>
        <span className="text-[8px] text-gray-300 font-mono italic">
          COM.OK
        </span>
      </div>
    </div>
  );
};

export default function PowerMeterPage() {
  const [isMounted, setIsMounted] = useState(false);

  // Dữ liệu mô phỏng
  const meters = [
    {
      title: "MUL-CHILLER",
      data: [
        { label: "Voltage 3 Phase", value: "408.71", unit: "V" },
        { label: "Voltage L-N", value: "235.97", unit: "V" },
        { label: "Current", value: "0.27", unit: "A" },
        { label: "Power Consumption", value: "14.217", unit: "kWh" },
      ],
    },
    {
      title: "MUL-DEHUM1",
      data: [
        { label: "Voltage 3 Phase", value: "408.81", unit: "V" },
        { label: "Voltage L-N", value: "236.03", unit: "V" },
        { label: "Current", value: "0.14", unit: "A" },
        { label: "Power Consumption", value: "202.809", unit: "kWh" },
      ],
    },
    {
      title: "MUL-DEHUM2",
      data: [
        { label: "Voltage 3 Phase", value: "407.86", unit: "V" },
        { label: "Voltage L-N", value: "235.48", unit: "V" },
        { label: "Current", value: "53.99", unit: "A" },
        { label: "Power Consumption", value: "26905.992", unit: "kWh" },
      ],
    },
    {
      title: "MUL-VC1",
      data: [
        { label: "Voltage 3 Phase", value: "407.57", unit: "V" },
        { label: "Voltage L-N", value: "235.31", unit: "V" },
        { label: "Current", value: "0.05", unit: "A" },
        { label: "Power Consumption", value: "1204.678", unit: "kWh" },
      ],
    },
    {
      title: "MUL-VC2",
      data: [
        { label: "Voltage 3 Phase", value: "407.75", unit: "V" },
        { label: "Voltage L-N", value: "235.41", unit: "V" },
        { label: "Current", value: "0.00", unit: "A" },
        { label: "Power Consumption", value: "1692.234", unit: "kWh" },
      ],
    },
    {
      title: "MUL-HVAC",
      data: [
        { label: "Voltage 3 Phase", value: "407.58", unit: "V" },
        { label: "Voltage L-N", value: "235.32", unit: "V" },
        { label: "Current", value: "2.85", unit: "A" },
        { label: "Power Consumption", value: "2121.048", unit: "kWh" },
      ],
    },
    {
      title: "MUL-LIGHTING",
      data: [
        { label: "Voltage 3 Phase", value: "407.97", unit: "V" },
        { label: "Voltage L-N", value: "235.54", unit: "V" },
        { label: "Current", value: "0.00", unit: "A" },
        { label: "Power Consumption", value: "317.364", unit: "kWh" },
      ],
    },
    {
      title: "POWER METER 8",
      data: [
        { label: "Voltage 3 Phase", value: "406.98", unit: "V" },
        { label: "Voltage L-N", value: "234.97", unit: "V" },
        { label: "Current", value: "56.70", unit: "A" },
        { label: "Power Consumption", value: "2060685.715", unit: "kWh" },
      ],
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="min-h-screen bg-[#e0e0e0]" />;

  return (
    <div className="min-h-screen bg-[#d1d1d1] p-2 sm:p-6 text-black font-sans select-none">
      {/* Nới rộng container lên tối đa 1600px để các ô không bị chèn ép */}
      <div className="max-w-[1600px] mx-auto bg-white border border-gray-400 shadow-2xl p-4 sm:p-8 min-h-[90vh] flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-6 border-b-4 border-gray-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-green-700 text-white px-2 py-0.5 text-xs font-bold rounded shadow-sm">
                SYSTEM ACTIVE
              </span>
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.2em]">
                EMS Monitoring v2.0
              </span>
            </div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic leading-none">
              Power Metering <span className="text-green-700">Dashboard</span>
            </h1>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold text-gray-400 font-mono mb-1">
              LOCAL TIME SERVER
            </div>
            <div className="text-xl font-mono font-bold bg-gray-100 px-3 py-1 border border-gray-200 rounded">
              2026-01-12 21:40:05
            </div>
          </div>
        </div>

        {/* Grid Area - Nới rộng gap và điều chỉnh cột */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-6 gap-y-6 flex-1">
          {meters.map((meter, index) => (
            <MeterCard key={index} title={meter.title} data={meter.data} />
          ))}
        </div>

        {/* Footer Area */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase">
                Device Status
              </span>
              <span className="text-[11px] font-bold text-green-600">
                8/8 ONLINE
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase">
                Comm. Protocol
              </span>
              <span className="text-[11px] font-bold text-gray-700">
                MODBUS/TCP IP
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase">
                Data Refresh
              </span>
              <span className="text-[11px] font-bold text-gray-700">
                Every 1.0s
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10px] font-bold py-2 px-4 border border-gray-300 transition-all active:translate-y-0.5">
              SYSTEM LOGS
            </button>
            <button className="bg-green-700 hover:bg-green-800 text-white text-[10px] font-bold py-2 px-6 border border-green-900 shadow-md transition-all active:translate-y-0.5">
              GENERATE REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
