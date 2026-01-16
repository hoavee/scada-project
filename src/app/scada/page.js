"use client";

import React, { useState, useEffect } from "react";
import RotatingFan from "../components/RotatingFan";
import SystemLabel from "../components/SystemLabel";
import EnvironmentalStats from "../components/EnvironmentalStats";

// Thành phần hiển thị các con số bên phải (Dashboard stats) - GIỮ NGUYÊN
const StatRow = ({ label, value, unit, onEdit }) => {
  const isSetting = label.toLowerCase().includes("set");

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
  const [apiTimestamp, setApiTimestamp] = useState("Loading...");

  // Khởi tạo statsData với cấu trúc cũ nhưng giá trị trống để chờ API
  const [statsData, setStatsData] = useState({
    waterCooling: [],
    iduCooling: [],
    sensors: {
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

  const [deviceStatus, setDeviceStatus] = useState({
    idu5: { status: "CLOSE", color: "bg-red-600" },
    idu4: { status: "CLOSE", color: "bg-red-600" },
    idu3: { status: "CLOSE", color: "bg-red-600" },
    idu2: { status: "CLOSE", color: "bg-red-600" },
    idu1: { status: "CLOSE", color: "bg-red-600" },
    pump1: { status: "STOP", color: "bg-red-600" },
    pump2: { status: "STOP", color: "bg-red-600" },
    pump3: { status: "STOP", color: "bg-red-600" },
    compressor: { status: null, color: "" },
  });

  // PHẦN CẬP NHẬT: GỌI API QUA PROXY
  useEffect(() => {
    setIsMounted(true);
    let timer;

    const fetchData = async () => {
      try {
        // Gọi qua proxy đã cấu hình trong vercel.json
        const response = await fetch("/api-proxy/api/test", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("API Offline");
        const data = await response.json();

        // Cập nhật statsData từ dữ liệu API
        setStatsData({
          waterCooling: [
            { label: "Water Temp", value: data.waterTemp, unit: "" },
            { label: "Temp. set pump", value: data.tempSetPump, unit: "C" },
            { label: "HYS Temp pump", value: data.hysTempPump, unit: "" },
            { label: "Time HYS pump", value: data.timeHysPump, unit: "Min" },
            { label: "Temp. set fan", value: data.tempSetFan, unit: "" },
            { label: "HYS Temp fan", value: data.hysTempFan, unit: "" },
            { label: "Changer Time", value: data.changerTime, unit: "" },
            { label: "Delay FS Alarm", value: data.delayFsAlarm, unit: "" },
          ],
          iduCooling: [
            { label: "HYS Temp Set", value: data.hystemset, unit: "" },
            { label: "Time HYS Temp", value: data.timehystemp, unit: "Min" },
            { label: "HYS HUM Set", value: data.hyshumset, unit: "" },
            { label: "Time HYS Hum", value: data.timehyshum, unit: "Min" },
            {
              label: "Heater Temp",
              value: `Start ${data.heatertempstart}`,
              unit: "",
            },
            {
              label: "HT Temp. inc",
              value: `Max ${data.httempincmax}`,
              unit: "",
            },
            { label: "Time changer", value: data.timechangerht, unit: "" },
          ],
          sensors: {
            t1: data.t1,
            h1: data.h1,
            t2: data.t2,
            h2: data.h2,
            t3: data.t3,
            h3: data.h3,
            t4: data.t4,
            h4: data.h4,
            t5: data.t5,
            h5: data.h5,
          },
        });

        // Cập nhật trạng thái PUMP 3 dựa trên runpump3
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
        timer = setTimeout(fetchData, 1000); // Đệ quy mỗi 1 giây
      }
    };

    fetchData();
    return () => clearTimeout(timer);
  }, []);

  // CÁC HÀM MODAL - GIỮ NGUYÊN
  const [editModal, setEditModal] = useState({
    isVisible: false,
    label: "",
    value: "",
    tempValue: "",
    humValue: "",
    mode: "single",
  });
  const handleOpenEdit = (label, value) =>
    setEditModal({ isVisible: true, label, value, mode: "single" });
  const handleOpenEnvEdit = (label, temp, hum) =>
    setEditModal({
      isVisible: true,
      label,
      tempValue: temp,
      humValue: hum,
      mode: "environmental",
    });
  const handleCloseEdit = () =>
    setEditModal({ ...editModal, isVisible: false });
  const handleUpdate = () => {
    /* Giữ nguyên logic cũ */ handleCloseEdit();
  };

  if (!isMounted) return <div className="min-h-screen bg-white" />;

  const DEVICES_CONFIG = [
    { id: "idu5", label: "Valve", left: "20%", top: "69%" },
    { id: "idu4", label: "Valve", left: "35%", top: "69%" },
    { id: "idu3", label: "Valve", left: "53.5%", top: "69%" },
    { id: "idu2", label: "Valve", left: "72%", top: "69%" },
    { id: "idu1", label: "Valve", left: "88.5%", top: "69%" },
    { id: "pump1", label: "PUMP 1", left: "39%", top: "46.5%" },
    { id: "pump2", label: "PUMP 2", left: "56%", top: "46.5%" },
    { id: "pump3", label: "PUMP 3", left: "72%", top: "46.5%" },
    {
      id: "compressor",
      label: "GAS COMPRESSOR",
      left: "15%",
      top: "36%",
      width: "20%",
    },
  ];

  return (
    <div className="min-h-screen bg-[#e0e0e0] p-4 text-black font-sans select-none">
      <div className="w-full bg-white border border-gray-400 shadow-2xl p-4 min-h-[calc(100vh-120px)] relative">
        {/* Header - Hiển thị timestamp từ API */}
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-2">
          <h1 className="text-xl font-black text-gray-700 tracking-tighter uppercase italic">
            SCADA Monitoring Console
          </h1>
          <div className="flex gap-4 text-[10px] font-bold">
            <span className="text-green-600 bg-green-50 px-2 py-1 border border-green-200 rounded">
              ● SYSTEM ONLINE
            </span>
            <span className="text-gray-400 py-1">{apiTimestamp}</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-9 border border-gray-300 bg-[#fdfdfd] relative overflow-hidden">
            <div
              className="relative w-full mx-auto"
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
                  label={dev.label}
                  position={{ left: dev.left, top: dev.top }}
                  width={dev.width}
                  status={deviceStatus[dev.id]?.status}
                  statusColor={deviceStatus[dev.id]?.color}
                />
              ))}

              {/* Tích hợp dữ liệu sensor t1-t5 vào EnvironmentalStats */}
              <EnvironmentalStats
                position={{ top: "92%", left: "14.5%" }}
                data={{ temp: statsData.sensors.t5, hum: statsData.sensors.h5 }}
                onOpenEdit={handleOpenEnvEdit}
              />
              <EnvironmentalStats
                position={{ top: "92%", left: "30%" }}
                data={{ temp: statsData.sensors.t4, hum: statsData.sensors.h4 }}
                onOpenEdit={handleOpenEnvEdit}
              />
              <EnvironmentalStats
                position={{ top: "92%", left: "48.5%" }}
                data={{ temp: statsData.sensors.t3, hum: statsData.sensors.h3 }}
                onOpenEdit={handleOpenEnvEdit}
              />
              <EnvironmentalStats
                position={{ top: "92%", left: "66.5%" }}
                data={{ temp: statsData.sensors.t2, hum: statsData.sensors.h2 }}
                onOpenEdit={handleOpenEnvEdit}
              />
              <EnvironmentalStats
                position={{ top: "92%", left: "82.5%" }}
                data={{ temp: statsData.sensors.t1, hum: statsData.sensors.h1 }}
                onOpenEdit={handleOpenEnvEdit}
              />

              {/* LỚP OVERLAY QUẠT - GIỮ NGUYÊN */}
              <RotatingFan x={134} y={428} size={35} isRunning={false} />
              <RotatingFan x={251.5} y={428} size={35} isRunning={true} />
              <RotatingFan x={393.5} y={428} size={35} isRunning={true} />
              <RotatingFan x={535} y={428} size={35} isRunning={true} />
              <RotatingFan x={653.5} y={428} size={35} isRunning={true} />
            </div>
          </div>

          {/* CỘT BÊN PHẢI - HIỂN THỊ statsData đã map từ API */}
          <div className="col-span-3 flex flex-col gap-6">
            <div className="bg-gray-50 border-t-4 border-blue-600 p-4 shadow-md border border-gray-200">
              <h2 className="text-blue-700 font-black text-xs mb-4 border-b border-blue-100 pb-1 uppercase italic tracking-widest">
                Water Cooling System
              </h2>
              <div className="space-y-1">
                {statsData.waterCooling.map((item, idx) => (
                  <StatRow key={idx} {...item} onEdit={handleOpenEdit} />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border-t-4 border-orange-500 p-4 shadow-md border border-gray-200">
              <h2 className="text-orange-700 font-black text-xs mb-4 border-b border-orange-100 pb-1 uppercase italic tracking-widest">
                IDU Cooling Stats
              </h2>
              <div className="space-y-1">
                {statsData.iduCooling.map((item, idx) => (
                  <StatRow key={idx} {...item} onEdit={handleOpenEdit} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
