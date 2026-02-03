"use client";

import React, { useState, useEffect, useRef } from "react";
import { Settings } from "lucide-react";
import RotatingFan from "../components/RotatingFan";
import SystemLabel from "../components/SystemLabel";
import EnvironmentalStats from "../components/EnvironmentalStats";
import TrendPopup from "../components/TrendPopup";
import DeviceReportPopup from "../components/DeviceReportPopup";
import { DEVICES_CONFIG, INITIAL_DEVICE_STATUS } from "../constants/devices";

const StatRow = ({ label, value, unit, onEdit, secondaryValue }) => {
  const isSetting = label.toLowerCase() !== "water temp";
  const isTimeChanger = label === "Time changer";

  return (
    <div className="flex justify-between items-center mb-1 text-[11px] leading-tight">
      <span className="text-gray-600 font-medium whitespace-nowrap flex items-center gap-1">
        {label}:
        {isSetting && (
          <button
            onClick={() => onEdit(label, value, secondaryValue)}
            className="hover:text-blue-600 transition-colors hover:cursor-pointer"
          >
            <Settings size={14} />
          </button>
        )}
      </span>

      <div className="flex items-center min-w-[140px] justify-end gap-1">
        {/* Ô giá trị chính */}
        <div
          className={`${isTimeChanger ? "w-16" : "w-24"} bg-black border border-gray-400 px-2 py-0.5 text-[#ffff00] font-mono text-right shadow-inner`}
        >
          {value}
        </div>
        <span className="text-[10px] font-bold text-gray-700 w-7 text-left">
          {unit === "C" ? <span>&deg;C</span> : unit}
        </span>

        {/* Ô giá trị phụ (HT) - Chỉ hiện khi là Time changer */}
        {isTimeChanger && (
          <>
            <div className="w-16 bg-black border border-gray-400 px-2 py-0.5 text-[#ffff00] font-mono text-center shadow-inner">
              {secondaryValue || "5"}
            </div>
            <span className="text-[10px] font-bold text-gray-700 w-5 text-left ml-0.5">
              HT
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default function ScadaPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imgRef = useRef(null);
  const [trendModal, setTrendModal] = useState({ isOpen: false, label: "" });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [reportConfig, setReportConfig] = useState({
    isOpen: false,
    label: "",
    id: "",
  });

  const handleOpenTrend = (label) => {
    setTrendModal({ isOpen: true, label });
  };

  const handleOpenReport = (id, label) => {
    setReportConfig({ isOpen: true, id, label });
  };

  const [apiTimestamp, setApiTimestamp] = useState("2026-01-12 21:15:37");
  const [statsData, setStatsData] = useState({
    waterCooling: [
      { label: "Water Temp", value: "0.0", unit: "C" },
      { label: "Temp. set pump", value: "0.00", unit: "C" },
      { label: "HYS Temp pump", value: "0.00", unit: "C" },
      { label: "Time HYS pump", value: "0.00", unit: "Min" },
      { label: "Temp. set fan", value: "0.00", unit: "C" },
      { label: "HYS Temp fan", value: "0.00", unit: "C" },
      { label: "Time HYS fan", value: "0.00", unit: "Min" },
      { label: "Changer Time", value: "0.00", unit: "H" },
      { label: "Delay FS Alarm", value: "0.00", unit: "S" },
    ],
    iduCooling: [
      { label: "HYS Temp Set", value: "0.00", unit: "C" },
      { label: "Time HYS Temp", value: "0.00", unit: "Min" },
      { label: "HYS HUM Set", value: "0.00", unit: "%" },
      { label: "Time HYS Hum", value: "0.00", unit: "Min" },
      { label: "Heater Temp Start", value: "0.00", unit: "C" },
      { label: "HT Temp. inc Max", value: "0.00", unit: "C" },
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
    if (imgRef.current && imgRef.current.complete) {
      setIsImageLoaded(true);
    }

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
            { label: "Time HYS fan", value: data.timeHysFan, unit: "Min" },
            { label: "Changer Time", value: data.changerTime, unit: "H" },
            { label: "Delay FS Alarm", value: data.delayFsAlarm, unit: "S" },
          ],
          iduCooling: [
            { label: "HYS Temp Set", value: data.hystemset, unit: "C" },
            { label: "Time HYS Temp", value: data.timehystemp, unit: "Min" },
            { label: "HYS HUM Set", value: data.hyshumset, unit: "%" },
            { label: "Time HYS Hum", value: data.timehyshum, unit: "Min" },
            {
              label: "Heater Temp Start",
              value: data.heatertempstart,
              unit: "C",
            },
            {
              label: "HT Temp. inc Max",
              value: data.httempincmax,
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
          secondaryValue: data.min,
        });
        setDeviceStatus({
          waterLow: { status: "LOW", color: "bg-red-700" },
          fsfault: {
            status: data.fsfault?.fsfault?.value === 1 ? "FS-FAULT" : "OPEN",
            color:
              data.fsfault?.fsfault?.value === 1
                ? "bg-yellow-500"
                : "bg-green-800",
          },
          mvalve1: {
            status: data.valvesCT?.valvect1?.state || "CLOSE",
            color:
              data.valvesCT?.valvect1?.open === 1
                ? "bg-green-800"
                : "bg-red-600",
          },
          mvalve2: {
            status: data.valvesCT?.valvect2?.state || "CLOSE",
            color:
              data.valvesCT?.valvect2?.open === 1
                ? "bg-green-800"
                : "bg-red-600",
          },
          fan1: {
            status: data.fanCT?.fanct1?.run === 1 ? "RUN" : "STOP",
            color:
              data.fanCT?.fanct1?.run === 1 ? "bg-green-800" : "bg-red-600",
          },
          fan2: {
            status: data.fanCT?.fanct2?.run === 1 ? "RUN" : "STOP",
            color:
              data.fanCT?.fanct2?.run === 1 ? "bg-green-800" : "bg-red-600",
          },
          pump1: {
            status: data.pumps?.pump1?.state || "STOP",
            color: data.pumps?.pump1?.run === 1 ? "bg-green-800" : "bg-red-600",
          },
          pump2: {
            status: data.pumps?.pump2?.state || "STOP",
            color: data.pumps?.pump2?.run === 1 ? "bg-green-800" : "bg-red-600",
          },
          pump3: {
            status: data.pumps?.pump3?.state || "STOP",
            color: data.pumps?.pump3?.run === 1 ? "bg-green-800" : "bg-red-600",
          },
          watertemp: { status: `${data.waterTemp}°C`, color: "bg-blue-600" },
          iduv1: {
            status: data.valves?.valve1?.state || "CLOSE",
            color:
              data.valves?.valve1?.value === 1 ? "bg-green-800" : "bg-red-600",
          },
          iduv2: {
            status: data.valves?.valve2?.state || "CLOSE",
            color:
              data.valves?.valve2?.value === 1 ? "bg-green-800" : "bg-red-600",
          },
          iduv3: {
            status: data.valves?.valve3?.state || "CLOSE",
            color:
              data.valves?.valve3?.value === 1 ? "bg-green-800" : "bg-red-600",
          },
          iduv4: {
            status: data.valves?.valve4?.state || "CLOSE",
            color:
              data.valves?.valve4?.value === 1 ? "bg-green-800" : "bg-red-600",
          },
          iduv5: {
            status: data.valves?.valve5?.state || "CLOSE",
            color:
              data.valves?.valve5?.value === 1 ? "bg-green-800" : "bg-red-600",
          },
          fanidu1: {
            status: data.fan?.fanidu1?.state || "STOP",
            isRunning: data.fan?.fanidu1?.run === 1,
          },
          fanidu2: {
            status: data.fan?.fanidu2?.state || "STOP",
            isRunning: data.fan?.fanidu2?.run === 1,
          },
          fanidu3: {
            status: data.fan?.fanidu3?.state || "STOP",
            isRunning: data.fan?.fanidu3?.run === 1,
          },
          fanidu4: {
            status: data.fan?.fanidu4?.state || "STOP",
            isRunning: data.fan?.fanidu4?.run === 1,
          },
          fanidu5: {
            status: data.fan?.fanidu5?.state || "STOP",
            isRunning: data.fan?.fanidu5?.run === 1,
          },
        });
        setApiTimestamp(data.timestamp);
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
    tempValue: "",
    humValue: "",
    mode: "single",
  });
  const handleOpenEdit = (label, value, secondaryValue) => {
    setUpdateSuccess(false);
    if (label === "Time changer") {
      setEditModal({
        isVisible: true,
        label,
        value: value, // Giá trị Time changer
        secondaryValue: secondaryValue, // Giá trị HT
        mode: "timeChanger",
      });
    } else {
      setEditModal({ isVisible: true, label, value, mode: "single" });
    }
  };
  const handleOpenEnvEdit = (label, temp, hum) => {
    setUpdateSuccess(false);
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

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);

    const iduNumber = editModal.label.replace(/^\D+/g, "");
    const promises = [];

    if (editModal.mode === "timeChanger") {
      const timeVal = document.getElementById("modal-input").value;
      const minVal = document.getElementById("modal-secondary-input").value;

      promises.push(
        fetch(`/api-proxy/api/post/timechangerht`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ temp: parseFloat(timeVal) }),
        }),
      );
      promises.push(
        fetch(`/api-proxy/api/post/min`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ temp: parseFloat(minVal) }),
        }),
      );
    } else if (editModal.mode === "environmental") {
      const newTemp = document.getElementById("modal-temp").value;
      const newHum = document.getElementById("modal-hum").value;
      if (parseFloat(newTemp) !== parseFloat(editModal.tempValue)) {
        promises.push(
          fetch(`/api-proxy/api/post/T${iduNumber}-IDU${iduNumber}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              temp: Math.round(parseFloat(newTemp) * 100),
            }),
          }),
        );
      }
      if (parseFloat(newHum) !== parseFloat(editModal.humValue)) {
        promises.push(
          fetch(`/api-proxy/api/post/H${iduNumber}-IDU${iduNumber}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              temp: Math.round(parseFloat(newHum) * 100),
            }),
          }),
        );
      }
    } else {
      const newValue = document.getElementById("modal-input").value;
      const cleanValue = parseFloat(
        newValue.toString().replace(/[^\d.-]/g, ""),
      );

      const endpointMap = {
        "Temp. set pump": "setpump",
        "HYS Temp pump": "hystemppump",
        "Time HYS pump": "timehyspump",
        "Temp. set fan": "setfan",
        "HYS Temp fan": "hystempfan",
        "Time HYS fan": "timehysfan",
        "Changer Time": "changertime1",
        "Delay FS Alarm": "delayfsalarm",
        "HYS Temp Set": "tempset",
        "Time HYS Temp": "timehystemp",
        "HYS HUM Set": "humset",
        "Time HYS Hum": "timehyshum",
        "Heater Temp Start": "heatertempstart",
        "HT Temp. inc Max": "httempincmax",
        "Time changer": "timechangerht",
      };

      const endpoint = endpointMap[editModal.label];
      if (endpoint) {
        let factor = 1;
        if (editModal.label.includes("Time HYS fan")) factor = 10;
        if (editModal.label.includes("Delay")) factor = 1;

        promises.push(
          fetch(`/api-proxy/api/post/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ temp: cleanValue * factor }),
          }),
        );
      }
    }

    Promise.all(promises);

    setTimeout(() => {
      setIsUpdating(false);
      setUpdateSuccess(true);
      setTimeout(() => {
        handleCloseEdit();
      }, 1500);
    }, 3000);
  };

  return (
    <div className="bg-[#e0e0e0] p-2 md:p-4 text-black font-sans select-none">
      <div className="w-full bg-white border border-gray-400 shadow-2xl p-2 md:p-4 min-h-[calc(100vh-120px)] relative">
        {isMounted && !isImageLoaded && (
          <div className="absolute inset-0 z-[150] bg-white flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-bold tracking-widest text-blue-600 uppercase">
              Loading System Map...
            </p>
          </div>
        )}

        {editModal.isVisible && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
            <div className="bg-white border-2 border-gray-800 p-4 shadow-2xl w-72">
              <h3 className="text-[11px] font-bold mb-3 uppercase bg-gray-100 p-1">
                Edit: {editModal.label}
              </h3>

              {updateSuccess ? (
                <div className="py-8 text-center">
                  <div className="text-green-600 font-bold text-xs mb-2">
                    ✓ SUCCESS
                  </div>
                  <div className="text-[11px] text-gray-600">
                    Settings updated successfully!
                  </div>
                </div>
              ) : (
                <>
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
                        />
                      </div>
                    </div>
                  ) : editModal.mode === "timeChanger" ? (
                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400">
                          TIME CHANGER (Min)
                        </label>
                        <input
                          id="modal-input"
                          type="text"
                          defaultValue={editModal.value}
                          className="w-full border border-gray-400 p-2 font-mono text-center"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400">
                          HT VALUE
                        </label>
                        <input
                          id="modal-secondary-input"
                          type="text"
                          defaultValue={editModal.secondaryValue}
                          className="w-full border border-gray-400 p-2 font-mono text-center"
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
                      disabled={isUpdating}
                      className={`flex-1 text-white text-[10px] font-bold py-2 transition-all ${isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                    >
                      {isUpdating ? "UPDATING..." : "UPDATE"}
                    </button>
                    <button
                      onClick={handleCloseEdit}
                      disabled={isUpdating}
                      className="flex-1 bg-gray-200 text-[10px] font-bold py-2 hover:bg-gray-300"
                    >
                      CANCEL
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {trendModal.isOpen && (
          <TrendPopup
            label={trendModal.label}
            onClose={() => setTrendModal({ isOpen: false, label: "" })}
          />
        )}

        {/* Render Popup Report */}
        {reportConfig.isOpen && (
          <DeviceReportPopup
            id={reportConfig.id}
            label={reportConfig.label}
            onClose={() =>
              setReportConfig({ isOpen: false, id: "", label: "" })
            }
          />
        )}

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 pb-20">
          <div className="lg:col-span-9 border border-gray-300 bg-[#fdfdfd] relative overflow-auto">
            <div
              className="relative w-full mx-auto min-w-[1180px]"
              style={{ aspectRatio: "770 / 530" }}
            >
              <img
                ref={imgRef}
                src="/system.svg"
                alt="System"
                className="absolute inset-0 w-full h-full object-fill"
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setIsImageLoaded(true)}
              />
              {DEVICES_CONFIG.map((dev) => (
                <SystemLabel
                  key={dev.id}
                  {...dev}
                  status={deviceStatus[dev.id]?.status}
                  statusColor={deviceStatus[dev.id]?.color}
                  position={{ left: dev.left, top: dev.top }}
                  showReport={
                    dev.id.includes("pump") ||
                    dev.id.includes("fan") ||
                    dev.id.includes("valve") ||
                    dev.id.includes("iduv")
                  }
                  onReport={() => handleOpenReport(dev.id, dev.label)}
                />
              ))}
              {[5, 4, 3, 2, 1].map((num, idx) => {
                const leftPositions = [
                  "14.5%",
                  "30.5%",
                  "48.5%",
                  "66.5%",
                  "82.5%",
                ];
                return (
                  <EnvironmentalStats
                    key={num}
                    position={{ top: "93%", left: leftPositions[idx] }}
                    data={{
                      temp: statsData.rawSensors[`t${num}`],
                      hum: statsData.rawSensors[`h${num}`],
                      setTemp: statsData.rawSensors[`sett${num}`],
                      setHum: statsData.rawSensors[`seth${num}`],
                      tLabel: `T${num}`,
                      hLabel: `H${num}`,
                      fanStatus: "RUN",
                      heaterStatus: "OFF",
                    }}
                    onOpenEdit={handleOpenEnvEdit}
                    onOpenTrend={handleOpenTrend}
                  />
                );
              })}
              <RotatingFan
                x={134}
                y={428}
                size={35}
                isRunning={deviceStatus.fanidu5?.isRunning}
              />
              <RotatingFan
                x={251.5}
                y={428}
                size={35}
                isRunning={deviceStatus.fanidu4?.isRunning}
              />
              <RotatingFan
                x={393.5}
                y={428}
                size={35}
                isRunning={deviceStatus.fanidu3?.isRunning}
              />
              <RotatingFan
                x={535}
                y={428}
                size={35}
                isRunning={deviceStatus.fanidu2?.isRunning}
              />
              <RotatingFan
                x={653.5}
                y={428}
                size={35}
                isRunning={deviceStatus.fanidu1?.isRunning}
              />
            </div>
          </div>

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
                ROOM IDU COOLING
              </h2>
              <div className="space-y-1">
                {statsData.iduCooling.map((item, idx) => (
                  <StatRow
                    key={idx}
                    label={item.label}
                    value={item.value}
                    unit={item.unit}
                    onEdit={handleOpenEdit}
                    // Giả sử lấy số lượng HT từ statsData hoặc mặc định là 5 như ảnh
                    secondaryValue={
                      item.label === "Time changer"
                        ? statsData.secondaryValue || "0"
                        : null
                    }
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
