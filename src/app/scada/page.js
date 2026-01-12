"use client";

import React, { useState, useEffect } from "react";

// Thành phần hiển thị các con số bên phải (Dashboard stats)
const StatRow = ({ label, value, unit, onEdit }) => {
  const isSetting =
    label.toLowerCase().includes("set") ||
    label.toLowerCase().includes("hys") ||
    label.toLowerCase().includes("time");

  return (
    <div className="flex justify-between items-center mb-1 text-[11px] leading-tight">
      <span className="text-gray-600 font-medium whitespace-nowrap flex items-center gap-1">
        {label}:
        {isSetting && (
          <button
            onClick={() => onEdit(label, value)}
            className="hover:text-blue-600 transition-colors text-[18px] hover:cursor-pointer"
          >
            ⚙️
          </button>
        )}
      </span>
      <div className="bg-black border border-gray-400 px-2 py-0.5 text-[#ffff00] font-mono w-24 text-right shadow-inner">
        {value} <span className="text-[9px] text-gray-400 ml-1">{unit}</span>
      </div>
    </div>
  );
};

export default function ScadaPage() {
  const [isMounted, setIsMounted] = useState(false);

  // 1. Quản lý toàn bộ thông số bằng State
  const [statsData, setStatsData] = useState({
    waterCooling: [
      { label: "Water Temp", value: "22.9", unit: "" },
      { label: "Temp. set pump", value: "23.00", unit: "C" },
      { label: "HYS Temp pump", value: "1.00", unit: "" },
      { label: "Time HYS pump", value: "3.20", unit: "Min" },
      { label: "Temp. set fan", value: "30.00", unit: "" },
      { label: "HYS Temp fan", value: "1.00", unit: "" },
      { label: "Changer Time", value: "51.20", unit: "" },
      { label: "Delay FS Alarm", value: "9.60", unit: "" },
    ],
    iduCooling: [
      { label: "HYS Temp Set", value: "3.20", unit: "" },
      { label: "Time HYS Temp", value: "680.00", unit: "Min" },
      { label: "HYS HUM Set", value: "1.60", unit: "" },
      { label: "Time HYS Hum", value: "130.00", unit: "Min" },
      { label: "Heater Temp", value: "Start 5.00", unit: "" },
      { label: "HT Temp. inc", value: "Max 8.00", unit: "" },
      { label: "Time changer", value: "0.00", unit: "" },
    ],
  });

  const [editModal, setEditModal] = useState({
    isVisible: false,
    label: "",
    value: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOpenEdit = (label, value) => {
    setEditModal({ isVisible: true, label, value });
  };

  const handleCloseEdit = () => {
    setEditModal({ ...editModal, isVisible: false });
  };

  // 2. Hàm cập nhật giá trị mới vào State
  const handleUpdate = () => {
    const newValue = document.getElementById("modal-input").value;

    const updateArray = (arr) =>
      arr.map((item) =>
        item.label === editModal.label ? { ...item, value: newValue } : item
      );

    setStatsData({
      waterCooling: updateArray(statsData.waterCooling),
      iduCooling: updateArray(statsData.iduCooling),
    });

    handleCloseEdit();
  };

  if (!isMounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-[#e0e0e0] p-4 text-black font-sans select-none">
      <div className="max-w-[1400px] mx-auto bg-white border border-gray-400 shadow-2xl p-6 min-h-[800px] relative">
        {editModal.isVisible && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <div className="bg-white border-2 border-gray-800 p-4 shadow-2xl w-64">
              <h3 className="text-[11px] font-bold mb-3 uppercase bg-gray-100 p-1">
                Edit: {editModal.label}
              </h3>
              <input
                id="modal-input"
                type="text"
                defaultValue={editModal.value}
                className="w-full border border-gray-400 p-2 mb-4 font-mono text-center text-lg"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-green-600 text-white text-[10px] font-bold py-2"
                >
                  UPDATE
                </button>
                <button
                  onClick={handleCloseEdit}
                  className="flex-1 bg-gray-200 text-[10px] font-bold py-2"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8 border-b-2 border-gray-100 pb-2">
          <h1 className="text-xl font-black text-gray-700 tracking-tighter uppercase italic">
            SCADA Monitoring Console
          </h1>
          <div className="flex gap-4 text-[10px] font-bold">
            <span className="text-green-600 bg-green-50 px-2 py-1 border border-green-200 rounded">
              ● SYSTEM READY
            </span>
            <span className="text-gray-400 py-1">2026-01-12 21:15:37</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 relative">
          <div className="col-span-9 relative h-[650px] border border-gray-200 bg-[#f8f9fa] rounded-sm overflow-hidden shadow-inner flex items-center justify-center">
            <img
              src="/system-demo.webp"
              alt="System Illustration"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="col-span-3 flex flex-col gap-6">
            <div className="bg-gray-50 border-t-4 border-blue-600 p-4 shadow-lg border border-gray-200">
              <h2 className="text-blue-700 font-black text-xs mb-4 border-b border-blue-100 pb-1 uppercase italic tracking-widest">
                Water Cooling System
              </h2>
              <div className="space-y-1">
                {statsData.waterCooling.map((item, idx) => (
                  <StatRow
                    key={idx}
                    label={item.label}
                    value={item.value}
                    unit={item.unit}
                    onEdit={handleOpenEdit}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border-t-4 border-orange-500 p-4 shadow-lg border border-gray-200">
              <h2 className="text-orange-700 font-black text-xs mb-4 border-b border-orange-100 pb-1 uppercase italic tracking-widest">
                IDU Cooling Stats
              </h2>
              <div className="space-y-1">
                {statsData.iduCooling.map((item, idx) => (
                  <StatRow
                    key={idx}
                    label={item.label}
                    value={item.value}
                    unit={item.unit}
                    onEdit={handleOpenEdit}
                  />
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-red-600 text-white text-[10px] font-bold py-1.5 rounded active:scale-95 transition-transform shadow-md">
                  EMERGENCY STOP
                </button>
                <button className="flex-1 bg-gray-800 text-white text-[10px] font-bold py-1.5 rounded active:scale-95 transition-transform shadow-md">
                  RESET
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
