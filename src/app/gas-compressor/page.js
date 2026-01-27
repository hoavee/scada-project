"use client";

import React, { useState, useEffect, useRef } from "react";
import SystemLabel from "../components/SystemLabel";
import LedLight from "../components/LedLight"; // Import component LedLight
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

  const [statsData, setStatsData] = useState({
    gasCompressorStats: [
      { label: "GAS FB Pressure", value: "0.00", unit: "Bar" },
      { label: "Pressure Set", value: "0.00", unit: "Bar" },
      { label: "HYS P. Inc", value: "0.00", unit: "Bar" },
      { label: "Time P .Inc", value: "0.00", unit: "Sec" },
      { label: "HYS P. Dec", value: "0.00", unit: "Bar" },
      { label: "Time P .Inc ", value: "0.00", unit: "Sec" },
      { label: "Changer Time", value: "0.00", unit: "H" },
      { label: "Delay SYS LP", value: "0.00", unit: "S" },
      { label: "Restart enable", value: "0.00", unit: "S" },
      { label: "Delay Oil tank Low", value: "0.00", unit: "S" },
      { label: "Bypass Valve time", value: "0.00", unit: "S" },
      { label: "EVP Valve Max P", value: "0.00", unit: "Bar" },
    ],
    rawSensors: {},
  });

  const [deviceStatus, setDeviceStatus] = useState(
    INITIAL_GAS_COMPRESSOR_STATUS,
  );

  const [ledStatus, setLedStatus] = useState({
    ledcomp1: { led1: 0, led2: 0 },
    ledcomp2: { led1: 0, led2: 0 },
    ledcomp3: { led1: 0, led2: 0 },
  });

  useEffect(() => {
    setIsMounted(true);
    if (imgRef.current && imgRef.current.complete) setIsImageLoaded(true);

    let timer;
    const fetchData = async () => {
      try {
        // Cập nhật URL API mới
        const response = await fetch("/api-proxy/api/test", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("API Offline");
        const data = await response.json();

        // Ánh xạ chính xác các key từ API vào statsData
        setStatsData((prev) => ({
          ...prev,
          gasCompressorStats: [
            {
              label: "GAS FB Pressure",
              value: data.gasfbpressure ?? "0.00",
              unit: "Bar",
            },
            {
              label: "Pressure Set",
              value: data.pressureset ?? "0.00",
              unit: "Bar",
            },
            { label: "HYS P. Inc", value: data.hyspinc ?? "0.00", unit: "Bar" },
            {
              label: "Time P .Inc",
              value: data.timepinc ?? "0.00",
              unit: "Sec",
            },
            { label: "HYS P. Dec", value: data.hyspdec ?? "0.00", unit: "Bar" },
            {
              label: "Time P .Inc ",
              value: data.timepdec ?? "0.00",
              unit: "Sec",
            },
            {
              label: "Changer Time",
              value: data.changertime ?? "0.00",
              unit: "H",
            },
            {
              label: "Delay SYS LP",
              value: data.delaysyslp ?? "0.00",
              unit: "S",
            },
            {
              label: "Restart enable",
              value: data.restartenable ?? "0.00",
              unit: "S",
            },
            {
              label: "Delay Oil tank Low",
              value: data.delayoiltanklow ?? "0.00",
              unit: "S",
            },
            {
              label: "Bypass Valve time",
              value: data.bypassvalvetime ?? "0.00",
              unit: "S",
            },
            {
              label: "EVP Valve Max P",
              value: data.evpvalvemaxp ?? "0.00",
              unit: "Bar",
            },
          ],
        }));

        // 2. CẬP NHẬT TRẠNG THÁI GAS RL TỪ API
        if (data.gasrl) {
          setDeviceStatus((prevStatus) => {
            const updatedStatus = { ...prevStatus };

            // Duyệt qua các key gasrl1, gasrl2, gasrl3 từ API
            Object.keys(data.gasrl).forEach((key) => {
              const deviceApiData = data.gasrl[key]; // Dữ liệu từ API
              const stateValue = deviceApiData.state; // Lấy chuỗi "READY", "LP", hoặc "HP"

              let color = "bg-gray-500"; // Màu mặc định nếu không khớp

              // Giữ nguyên logic màu sắc từ INITIAL_GAS_COMPRESSOR_STATUS
              if (stateValue === "READY") {
                color = "bg-blue-600";
              } else if (stateValue === "LP") {
                color = "bg-red-600";
              } else if (stateValue === "HP") {
                color = "bg-yellow-500";
              }

              updatedStatus[key] = {
                status: stateValue,
                color: color,
              };
            });

            return updatedStatus;
          });
        }

        // 3. CẬP NHẬT TRẠNG THÁI OIL VALVES (oilv)
        if (data.oilv) {
          setDeviceStatus((prevStatus) => {
            const updatedStatus = { ...prevStatus };
            Object.keys(data.oilv).forEach((key) => {
              const stateValue = data.oilv[key].state;
              updatedStatus[key] = {
                status: stateValue,
                color: stateValue === "OPEN" ? "bg-green-800" : "bg-red-600",
              };
            });
            return updatedStatus;
          });
        }

        // 4. CẬP NHẬT TRẠNG THÁI OIL FLOW SWITCH (oilfs)
        if (data.oilfs) {
          setDeviceStatus((prevStatus) => {
            const updatedStatus = { ...prevStatus };
            Object.keys(data.oilfs).forEach((key) => {
              const stateValue = data.oilfs[key].state;
              let color = "bg-gray-500";

              if (stateValue === "RUN") color = "bg-green-800";
              else if (stateValue === "FAULT") color = "bg-red-600";
              else if (stateValue === "STOP") color = "bg-red-600";

              updatedStatus[key] = {
                status: stateValue,
                color: color,
              };
            });
            return updatedStatus;
          });
        }

        // 5. CẬP NHẬT TRẠNG THÁI LED (ledcomp)
        if (data.ledcomp) {
          setLedStatus({
            ledcomp1: data.ledcomp.ledcomp1 || { led1: 0, led2: 0 },
            ledcomp2: data.ledcomp.ledcomp2 || { led1: 0, led2: 0 },
            ledcomp3: data.ledcomp.ledcomp3 || { led1: 0, led2: 0 },
          });
        }

        // 6. CẬP NHẬT TRẠNG THÁI COMPLOAD (comp1, comp2, comp3)
        if (data.compload) {
          setDeviceStatus((prevStatus) => {
            const updatedStatus = { ...prevStatus };

            Object.keys(data.compload).forEach((key) => {
              const loadData = data.compload[key]; // Dữ liệu từ API
              const deviceId = key.replace("compload", "comp"); // Map key sang comp1, comp2, comp3

              let displayStatus = "";
              let color = "";

              // Logic kiểm tra trạng thái ưu tiên
              if (loadData.fault === 1) {
                displayStatus = "FAULT";
                color = "bg-yellow-500";
              } else if (loadData.run === 1) {
                // Chỉ thêm (%) khi đang RUN
                displayStatus = `RUN (${loadData.state || "0%"})`;
                color = "bg-green-800";
              } else if (loadData.stop === 1) {
                displayStatus = "STOP";
                color = "bg-red-600";
              } else {
                // Nếu tất cả là 0 (hoặc UNKNOWN), hiển thị STOP với màu xám/cam tùy chọn
                displayStatus = "STOP";
                color = "bg-red-600";
              }

              updatedStatus[deviceId] = {
                status: displayStatus,
                color: color,
              };
            });

            return updatedStatus;
          });
        }

        if (data.timestamp) setApiTimestamp(data.timestamp);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        timer = setTimeout(fetchData, 1000);
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
          <div className="lg:col-span-8 border border-gray-300 bg-[#fdfdfd] relative overflow-auto">
            <div
              className="relative w-full mx-auto min-w-[600px]"
              style={{ aspectRatio: "770 / 550" }}
            >
              <img
                ref={imgRef}
                src="/gas-compressor.svg"
                alt="System"
                className="absolute inset-0 w-full h-full object-fill"
                onLoad={() => setIsImageLoaded(true)}
              />

              {/* Tích hợp LedLight vào hệ tọa độ 770x550 */}
              {isMounted && (
                <>
                  {/* Ledcomp 1 */}
                  <LedLight
                    x={273.5}
                    y={243}
                    color="#228B22"
                    isOn={ledStatus.ledcomp1.led1 === 1}
                    isBlinking={ledStatus.ledcomp1.led1 === 1}
                    size={15}
                  />
                  <LedLight
                    x={322}
                    y={242}
                    color="#228B22"
                    isOn={ledStatus.ledcomp1.led2 === 1}
                    isBlinking={ledStatus.ledcomp1.led2 === 1}
                    size={15}
                  />

                  {/* Ledcomp 2 */}
                  <LedLight
                    x={441}
                    y={240.5}
                    color="#228B22"
                    isOn={ledStatus.ledcomp2.led1 === 1}
                    isBlinking={ledStatus.ledcomp2.led1 === 1}
                    size={15}
                  />
                  <LedLight
                    x={492.5}
                    y={242}
                    color="#228B22"
                    isOn={ledStatus.ledcomp2.led2 === 1}
                    isBlinking={ledStatus.ledcomp2.led2 === 1}
                    size={15}
                  />

                  {/* Ledcomp 3 */}
                  <LedLight
                    x={609}
                    y={245.5}
                    color="#228B22"
                    isOn={ledStatus.ledcomp3.led1 === 1}
                    isBlinking={ledStatus.ledcomp3.led1 === 1}
                    size={15}
                  />
                  <LedLight
                    x={661}
                    y={244.5}
                    color="#228B22"
                    isOn={ledStatus.ledcomp3.led2 === 1}
                    isBlinking={ledStatus.ledcomp3.led2 === 1}
                    size={15}
                  />
                </>
              )}

              {/* Các component Labels và Fans hiện có */}
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

          {/* CỘT BÊN PHẢI */}
          <div className="lg:col-span-4">
            <div className="bg-gray-50 border-t-4 border-blue-600 p-4 shadow-md border border-gray-200">
              <h2 className="text-blue-700 font-black text-xs mb-4 border-b border-blue-100 pb-1 uppercase italic tracking-widest">
                GAS COMPRESSOR STATS
              </h2>
              <div className="space-y-1">
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
