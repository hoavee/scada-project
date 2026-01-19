"use client";

import React, { useState, useEffect, useRef } from "react";
import SystemLabel from "../components/SystemLabel";
import {
  GAS_COMPRESSOR_CONFIG,
  INITIAL_GAS_COMPRESSOR_STATUS,
} from "../constants/gas-compressor";

const StatRow = ({ label, value, unit, onEdit }) => {
  const isSetting = label.toLowerCase().includes("set");
  return (
    <div className="flex justify-between items-center mb-1 text-[11px] leading-tight">
      <span className="text-gray-600 font-medium whitespace-nowrap flex items-center gap-1">
        {label}:
        {isSetting && (
          <button
            onClick={() => onEdit(label, value)}
            className="hover:text-blue-600 transition-colors text-[16px] hover:cursor-pointer"
          >
            ⚙️
          </button>
        )}
      </span>
      <div className="flex items-center min-w-[120px] justify-end gap-2">
        <div className="bg-black border border-gray-400 px-2 py-0.5 text-[#ffff00] font-mono w-24 text-right shadow-inner">
          {value}
        </div>
        <span className="text-[11px] font-bold text-gray-700 w-8 text-left">
          {unit}
        </span>
      </div>
    </div>
  );
};

export default function GasCompressor() {
  const [isMounted, setIsMounted] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imgRef = useRef(null);

  const [apiTimestamp, setApiTimestamp] = useState("");

  // SỬA LỖI TẠI ĐÂY: Khởi tạo gasCompressorStats ngay từ đầu
  const [statsData, setStatsData] = useState({
    gasCompressorStats: [
      { label: "GAS FB Pressure", value: "0.69", unit: "Bar" },
      { label: "Pressure Set", value: "0.35", unit: "Bar" },
      { label: "HYS P. Inc", value: "0.10", unit: "Bar" },
      { label: "Time P .Inc", value: "0.96", unit: "Sec" },
      { label: "HYS P. Dec", value: "0.05", unit: "Bar" },
      { label: "Time P .Inc ", value: "0.16", unit: "Sec" },
      { label: "Changer Time", value: "5.12", unit: "H" },
      { label: "Delay SYS LP", value: "7.68", unit: "S" },
      { label: "Restart enable", value: "8.64", unit: "S" },
      { label: "Delay Oil tank Low", value: "0.96", unit: "S" },
      { label: "Bypass Valve time", value: "0.05", unit: "S" },
      { label: "EVP Valve Max P", value: "0.80", unit: "Bar" },
    ],
    rawSensors: {},
  });

  const [deviceStatus, setDeviceStatus] = useState(
    INITIAL_GAS_COMPRESSOR_STATUS
  );

  useEffect(() => {
    setIsMounted(true);
    if (imgRef.current && imgRef.current.complete) setIsImageLoaded(true);

    let timer;
    const fetchData = async () => {
      try {
        const response = await fetch("/api-proxy/api/test", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("API Offline");
        const data = await response.json();

        // Cập nhật statsData khi có dữ liệu từ API (giữ cấu trúc mới)
        setStatsData((prev) => ({
          ...prev,
          gasCompressorStats: [
            {
              label: "GAS FB Pressure",
              value: data.gas_press || "0.69",
              unit: "Bar",
            },
            { label: "Pressure Set", value: data.p_set || "0.35", unit: "Bar" },
            { label: "HYS P. Inc", value: "0.10", unit: "Bar" },
            { label: "Time P .Inc", value: "0.96", unit: "Sec" },
            { label: "HYS P. Dec", value: "0.05", unit: "Bar" },
            { label: "Time P .Inc ", value: "0.16", unit: "Sec" },
            { label: "Changer Time", value: "5.12", unit: "H" },
            { label: "Delay SYS LP", value: "7.68", unit: "S" },
            { label: "Restart enable", value: "8.64", unit: "S" },
            { label: "Delay Oil tank Low", value: "0.96", unit: "S" },
            { label: "Bypass Valve time", value: "0.05", unit: "S" },
            { label: "EVP Valve Max P", value: "0.80", unit: "Bar" },
          ],
        }));

        setApiTimestamp(data.timestamp);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        timer = setTimeout(fetchData, 600000);
      }
    };
    fetchData();
    return () => clearTimeout(timer);
  }, []);

  const [editModal, setEditModal] = useState({
    isVisible: false,
    label: "",
    value: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOpenEdit = (label, value) =>
    setEditModal({ isVisible: true, label, value });
  const handleCloseEdit = () =>
    setEditModal({ ...editModal, isVisible: false });

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const newValue = document.getElementById("modal-input").value;
      // Gửi API update dựa trên label ở đây (tương tự code cũ của bạn)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Cập nhật thành công!");
      handleCloseEdit();
    } catch (error) {
      alert("Lỗi cập nhật!");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-[#e0e0e0] p-2 md:p-4 text-black font-sans select-none">
      <div className="w-full bg-white border border-gray-400 shadow-2xl p-2 md:p-4 min-h-[calc(100vh-120px)] relative">
        {/* Loading Overlay */}
        {isMounted && !isImageLoaded && (
          <div className="absolute inset-0 z-[150] bg-white flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-bold text-blue-600 uppercase">
              Loading System Map...
            </p>
          </div>
        )}

        {/* Edit Modal */}
        {editModal.isVisible && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <div className="bg-white border-2 border-gray-800 p-4 shadow-2xl w-72">
              <h3 className="text-[11px] font-bold mb-3 uppercase bg-gray-100 p-1">
                Edit: {editModal.label}
              </h3>
              <input
                id="modal-input"
                defaultValue={editModal.value}
                className="w-full border border-gray-400 p-2 mb-4 font-mono text-center text-lg"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-1 bg-green-600 text-white text-[10px] font-bold py-2"
                >
                  {isUpdating ? "UPDATING..." : "UPDATE"}
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

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 pb-20">
          {/* Main Scada Map */}
          <div className="lg:col-span-9 border border-gray-300 bg-[#fdfdfd] relative overflow-auto">
            <div
              className="relative w-full mx-auto min-w-[1180px]"
              style={{ aspectRatio: "770 / 530" }}
            >
              <img
                ref={imgRef}
                src="/gas-compressor.svg"
                alt="System"
                className="absolute inset-0 w-full h-full object-fill"
                onLoad={() => setIsImageLoaded(true)}
              />
              {GAS_COMPRESSOR_CONFIG.map((dev) => (
                <SystemLabel
                  key={dev.id}
                  {...dev}
                  status={deviceStatus[dev.id]?.status}
                  statusColor={deviceStatus[dev.id]?.color}
                  position={{ left: dev.left, top: dev.top }}
                />
              ))}
            </div>
          </div>

          {/* CỘT BÊN PHẢI - ĐÃ GỘP THÀNH 1 BẢNG */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 border-t-4 border-blue-600 p-4 shadow-md border border-gray-200">
              <h2 className="text-blue-700 font-black text-xs mb-4 border-b border-blue-100 pb-1 uppercase italic tracking-widest">
                GAS COMPRESSOR STATS
              </h2>
              <div className="space-y-1">
                {/* Kiểm tra an toàn trước khi map */}
                {statsData.gasCompressorStats &&
                  statsData.gasCompressorStats.map((item, idx) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}
