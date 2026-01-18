"use client";

import React, { useState, useEffect } from "react";
import RotatingFan from "../components/RotatingFan";
import SystemLabel from "../components/SystemLabel";
import EnvironmentalStats from "../components/EnvironmentalStats";

// IMPORT cấu hình từ file vừa tạo
import { DEVICES_CONFIG, INITIAL_DEVICE_STATUS } from "../constants/devices";

// Thành phần hiển thị các con số bên phải (Dashboard stats)
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
          {unit === "C" ? <span>&deg;C</span> : unit}
        </span>
      </div>
    </div>
  );
};

export default function ScadaPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [apiTimestamp, setApiTimestamp] = useState("2026-01-12 21:15:37");

  const [statsData, setStatsData] = useState({
    waterCooling: [
      { label: "Water Temp", value: "0.0", unit: "C" },
      { label: "Temp. set pump", value: "0.00", unit: "C" },
      { label: "HYS Temp pump", value: "0.00", unit: "C" },
      { label: "Time HYS pump", value: "0.00", unit: "Min" },
      { label: "Temp. set fan", value: "0.00", unit: "C" },
      { label: "HYS Temp fan", value: "0.00", unit: "C" },
      { label: "Changer Time", value: "0.00", unit: "H" },
      { label: "Delay FS Alarm", value: "0.00", unit: "S" },
    ],
    iduCooling: [
      { label: "HYS Temp Set", value: "0.00", unit: "C" },
      { label: "Time HYS Temp", value: "0.00", unit: "Min" },
      { label: "HYS HUM Set", value: "0.00", unit: "%" },
      { label: "Time HYS Hum", value: "0.00", unit: "Min" },
      { label: "Heater Temp", value: "Start 0.00", unit: "C" },
      { label: "HT Temp. inc", value: "Max 0.00", unit: "C" },
      { label: "Time changer", value: "0.00", unit: "Min" },
    ],
    rawSensors: {
      t1: "0",
      h1: "0",
      t2: "0",
      h2: "0",
      t3: "0",
      h3: "0",
      t4: "0",
      h4: "0",
      t5: "0",
      h5: "0",
    },
  });

  const [deviceStatus, setDeviceStatus] = useState(INITIAL_DEVICE_STATUS);

  useEffect(() => {
    setIsMounted(true);
    let timer;
    const fetchData = async () => {
      try {
        const response = await fetch("/api-proxy/api/test", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("API Offline");
        const data = await response.json();
        setStatsData({
          waterCooling: [
            { label: "Water Temp", value: data.waterTemp, unit: "C" },
            { label: "Temp. set pump", value: data.tempSetPump, unit: "C" },
            { label: "HYS Temp pump", value: data.hysTempPump, unit: "C" },
            { label: "Time HYS pump", value: data.timeHysPump, unit: "Min" },
            { label: "Temp. set fan", value: data.tempSetFan, unit: "C" },
            { label: "HYS Temp fan", value: data.hysTempFan, unit: "C" },
            { label: "Changer Time", value: data.changerTime, unit: "H" },
            { label: "Delay FS Alarm", value: data.delayFsAlarm, unit: "S" },
          ],
          iduCooling: [
            { label: "HYS Temp Set", value: data.hystemset, unit: "C" },
            { label: "Time HYS Temp", value: data.timehystemp, unit: "Min" },
            { label: "HYS HUM Set", value: data.hyshumset, unit: "%" },
            { label: "Time HYS Hum", value: data.timehyshum, unit: "Min" },
            {
              label: "Heater Temp",
              value: `Start ${data.heatertempstart}`,
              unit: "C",
            },
            {
              label: "HT Temp. inc",
              value: `Max ${data.httempincmax}`,
              unit: "C",
            },
            { label: "Time changer", value: data.timechangerht, unit: "Min" },
          ],
          rawSensors: {
            t1: data.T1,
            h1: data.H1,
            t2: data.T2,
            h2: data.H2,
            t3: data.T3,
            h3: data.H3,
            t4: data.T4,
            h4: data.H4,
            t5: data.T5,
            h5: data.H5,
            sett1: data.setT1,
            seth1: data.setH1,
            sett2: data.setT2,
            seth2: data.setH2,
            sett3: data.setT3,
            seth3: data.setH3,
            sett4: data.setT4,
            seth4: data.setH4,
            sett5: data.setT5,
            seth5: data.setH5,
          },
        });
        setDeviceStatus((prev) => ({
          ...prev,
          pump3: {
            status: data.runpump3 === 1 ? "RUN" : "STOP",
            color: data.runpump3 === 1 ? "bg-blue-500" : "bg-red-600",
          },
        }));
        setApiTimestamp(data.timestamp);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        timer = setTimeout(fetchData, 300000);
      }
    };
    fetchData();
    return () => clearTimeout(timer);
  }, []);

  const [editModal, setEditModal] = useState({
    isVisible: false,
    label: "",
    value: "",
    tempValue: "",
    humValue: "",
    mode: "single",
  });

  const handleOpenEdit = (label, value) => {
    setEditModal({ isVisible: true, label, value, mode: "single" });
  };

  const handleOpenEnvEdit = (label, temp, hum) => {
    setEditModal({
      isVisible: true,
      label,
      tempValue: temp,
      humValue: hum,
      mode: "environmental",
    });
  };

  const handleCloseEdit = () =>
    setEditModal({ ...editModal, isVisible: false });

  const handleUpdate = () => {
    const inputElement = document.getElementById("modal-input");
    if (!inputElement) return;
    const newValue = inputElement.value;
    const updateArray = (arr) =>
      arr.map((item) =>
        item.label === editModal.label ? { ...item, value: newValue } : item
      );
    setStatsData((prev) => ({
      ...prev,
      waterCooling: updateArray(prev.waterCooling),
      iduCooling: updateArray(prev.iduCooling),
    }));
    handleCloseEdit();
  };

  return (
    <div className="bg-[#e0e0e0] p-2 md:p-4 text-black font-sans select-none">
      <div className="w-full bg-white border border-gray-400 shadow-2xl p-2 md:p-4 min-h-[calc(100vh-120px)] relative">
        {/* MODAL POPUP - GIỮ NGUYÊN */}
        {editModal.isVisible && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <div className="bg-white border-2 border-gray-800 p-4 shadow-2xl w-72">
              <h3 className="text-[11px] font-bold mb-3 uppercase bg-gray-100 p-1">
                Edit: {editModal.label}
              </h3>
              {editModal.mode === "environmental" ? (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400">
                      TEMPERATURE
                    </label>
                    <input
                      id="modal-temp"
                      type="text"
                      defaultValue={editModal.tempValue}
                      className="w-full border border-gray-400 p-2 font-mono text-center"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400">
                      HUMIDITY (%)
                    </label>
                    <input
                      id="modal-hum"
                      type="text"
                      defaultValue={editModal.humValue}
                      className="w-full border border-gray-400 p-2 font-mono text-center"
                      autoFocus
                    />
                  </div>
                </div>
              ) : (
                <input
                  id="modal-input"
                  defaultValue={editModal.value}
                  className="w-full border border-gray-400 p-2 mb-4 font-mono text-center text-lg"
                  autoFocus
                />
              )}
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

        {/* Main Grid: Thay đổi grid sang flex-col trên mobile */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 pb-20">
          {/* Cột trái: Chứa sơ đồ, thêm overflow-auto để kéo trên mobile */}
          <div className="lg:col-span-9 border border-gray-300 bg-[#fdfdfd] relative overflow-auto">
            {/* Đặt min-width để sơ đồ không bị bóp méo, giữ nguyên tỷ lệ */}
            <div
              className="relative w-full mx-auto min-w-[1180px]"
              style={{ aspectRatio: "770 / 530" }}
            >
              <img
                src="/system.svg"
                alt="System"
                className="absolute inset-0 w-full h-full object-fill"
              />
              {DEVICES_CONFIG.map((dev) => (
                <SystemLabel
                  key={dev.id}
                  {...dev} // Sử dụng spread operator để truyền nhanh các props (label, left, top, width,...)
                  status={deviceStatus[dev.id]?.status}
                  statusColor={deviceStatus[dev.id]?.color}
                  position={{ left: dev.left, top: dev.top }}
                />
              ))}

              {/* EnvironmentalStats - Dữ liệu API */}
              <EnvironmentalStats
                position={{ top: "93%", left: "14.5%" }}
                data={{
                  temp: statsData.rawSensors.t5,
                  hum: statsData.rawSensors.h5,
                  setTemp: statsData.rawSensors.sett5,
                  setHum: statsData.rawSensors.seth5,
                  tLabel: "T5",
                  hLabel: "H5",
                  fanStatus: "RUN",
                  heaterStatus: "OFF",
                }}
                onOpenEdit={handleOpenEnvEdit}
              />
              <EnvironmentalStats
                position={{ top: "93%", left: "30.5%" }}
                data={{
                  temp: statsData.rawSensors.t4,
                  hum: statsData.rawSensors.h4,
                  setTemp: statsData.rawSensors.sett4,
                  setHum: statsData.rawSensors.seth4,
                  tLabel: "T4",
                  hLabel: "H4",
                  fanStatus: "RUN",
                  heaterStatus: "OFF",
                }}
                onOpenEdit={handleOpenEnvEdit}
              />
              <EnvironmentalStats
                position={{ top: "93%", left: "48.5%" }}
                data={{
                  temp: statsData.rawSensors.t3,
                  hum: statsData.rawSensors.h3,
                  setTemp: statsData.rawSensors.sett3,
                  setHum: statsData.rawSensors.seth3,
                  tLabel: "T3",
                  hLabel: "H3",
                  fanStatus: "RUN",
                  heaterStatus: "OFF",
                }}
                onOpenEdit={handleOpenEnvEdit}
              />
              <EnvironmentalStats
                position={{ top: "93%", left: "66.5%" }}
                data={{
                  temp: statsData.rawSensors.t2,
                  hum: statsData.rawSensors.h2,
                  setTemp: statsData.rawSensors.sett2,
                  setHum: statsData.rawSensors.seth2,
                  tLabel: "T2",
                  hLabel: "H2",
                  fanStatus: "RUN",
                  heaterStatus: "OFF",
                }}
                onOpenEdit={handleOpenEnvEdit}
              />
              <EnvironmentalStats
                position={{ top: "93%", left: "82.5%" }}
                data={{
                  temp: statsData.rawSensors.t1,
                  hum: statsData.rawSensors.h1,
                  setTemp: statsData.rawSensors.sett1,
                  setHum: statsData.rawSensors.seth1,
                  tLabel: "T1",
                  hLabel: "H1",
                  fanStatus: "RUN",
                  heaterStatus: "OFF",
                }}
                onOpenEdit={handleOpenEnvEdit}
              />

              <RotatingFan x={134} y={428} size={35} isRunning={false} />
              <RotatingFan x={251.5} y={428} size={35} isRunning={true} />
              <RotatingFan x={393.5} y={428} size={35} isRunning={true} />
              <RotatingFan x={535} y={428} size={35} isRunning={true} />
              <RotatingFan x={653.5} y={428} size={35} isRunning={true} />
            </div>
          </div>

          {/* Cột phải: Xuống dưới trên mobile */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-gray-50 border-t-4 border-blue-600 p-4 shadow-md border border-gray-200">
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

            <div className="bg-gray-50 border-t-4 border-orange-500 p-4 shadow-md border border-gray-200">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
