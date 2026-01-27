"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Zap, Calendar, FileDown } from "lucide-react";
// Import thư viện xuất Excel
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const METER_MAP = {
  PM1: "MUL-VC1",
  PM2: "MUL-VC2",
  PM3: "MUL-CHILLER",
  PM4: "MUL-DEHUM1",
  PM5: "MUL-DEHUM2",
  PM6: "MUL-LIGHTING",
  PM7: "MUL-HVAC",
  PM8: "MAIN POWER METER",
};

const allMeters = Object.values(METER_MAP);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-xl ring-1 ring-black/5 z-50">
      <p className="text-[11px] font-black text-gray-500 uppercase border-b border-gray-100 pb-1 mb-2">
        Time: {label}
      </p>
      <div className="space-y-1">
        {payload.map((category, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#1d4ed8" }}
              />
              <span className="text-[10px] font-bold text-gray-600 uppercase italic">
                {category.dataKey}:
              </span>
            </div>
            <span className="font-mono font-bold text-gray-800 text-[11px]">
              {Math.abs(category.value).toLocaleString()} kWh
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function PowerConsumePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMeters, setSelectedMeters] = useState(["MUL-DEHUM2"]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getSmartToday = () => {
    const now = new Date();
    if (now.getHours() < 6) {
      now.setDate(now.getDate() - 1);
    }
    return formatLocalDate(now);
  };

  useEffect(() => {
    const today = getSmartToday();
    setDateRange({ start: today, end: today });
    setIsMounted(true);
  }, []);

  const fetchData = async () => {
    if (!dateRange.start || !dateRange.end) return;
    setLoading(true);
    try {
      const endDateObj = new Date(dateRange.end);
      endDateObj.setDate(endDateObj.getDate() + 1);
      const extendedEnd = formatLocalDate(endDateObj);

      const response = await fetch(
        `/api-proxy/api/database?from=${dateRange.start}&to=${extendedEnd}`,
      );
      const rawData = await response.json();

      const isSingleDay = dateRange.start === dateRange.end;
      const dailyMap = {};

      Object.keys(rawData).forEach((pmKey) => {
        const meterName = METER_MAP[pmKey];
        rawData[pmKey].forEach((item) => {
          const endHour = parseInt(item.end.split(":")[0]);
          const apiDatePart = item.date.split("T")[0];
          let reportDate = new Date(apiDatePart);

          if (endHour > 0 && endHour <= 6) {
            reportDate.setDate(reportDate.getDate() - 1);
          }

          const workingDayKey = formatLocalDate(reportDate);
          const vnFormat = workingDayKey.split("-").reverse().join("/");

          if (!dailyMap[workingDayKey]) {
            dailyMap[workingDayKey] = {
              date: vnFormat,
              rawDate: workingDayKey,
              hourlyRows: {},
            };
          }

          if (!dailyMap[workingDayKey][meterName])
            dailyMap[workingDayKey][meterName] = 0;
          dailyMap[workingDayKey][meterName] += Math.abs(item.energy || 0);

          const timeLabel = `${item.start.substring(0, 5)} - ${item.end.substring(0, 5)}`;
          if (!dailyMap[workingDayKey].hourlyRows[timeLabel]) {
            dailyMap[workingDayKey].hourlyRows[timeLabel] = {
              date: timeLabel,
              hourVal: endHour === 0 ? 24 : endHour,
            };
          }
          dailyMap[workingDayKey].hourlyRows[timeLabel][meterName] = Math.abs(
            item.energy || 0,
          );
        });
      });

      let processedData = [];
      if (isSingleDay) {
        const targetDay = dailyMap[dateRange.start];
        if (targetDay) {
          processedData = Object.values(targetDay.hourlyRows).sort((a, b) => {
            const sortHour = (h) => (h <= 6 ? h + 24 : h);
            return sortHour(a.hourVal) - sortHour(b.hourVal);
          });
        }
      } else {
        processedData = Object.values(dailyMap)
          .filter(
            (d) => d.rawDate >= dateRange.start && d.rawDate <= dateRange.end,
          )
          .sort((a, b) => a.rawDate.localeCompare(b.rawDate));
      }

      setChartData(processedData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted) fetchData();
  }, [dateRange, isMounted]);

  const peakInfo = useMemo(() => {
    if (chartData.length === 0) return { value: 0, time: "N/A" };
    const meter = selectedMeters[0];
    let maxVal = -1;
    let maxTime = "";

    chartData.forEach((d) => {
      const val = d[meter] || 0;
      if (val > maxVal) {
        maxVal = val;
        maxTime = d.date;
      }
    });
    return { value: maxVal, time: maxTime };
  }, [chartData, selectedMeters]);

  const setQuickRange = (type) => {
    if (type === "today") {
      const smartToday = getSmartToday();
      setDateRange({ start: smartToday, end: smartToday });
    } else if (type === "thisMonth") {
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setDateRange({
        start: formatLocalDate(firstDay),
        end: formatLocalDate(today),
      });
    }
  };

  // Logic Generate Report
  const generateExcel = async () => {
    if (chartData.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Power Consumption");

    const columns = [
      { header: "Time / Date", key: "date", width: 20 },
      ...allMeters.map((meter) => ({
        header: `${meter} (kWh)`,
        key: meter,
        width: 20,
      })),
    ];
    worksheet.columns = columns;

    worksheet.getRow(1).font = { bold: true };

    chartData.forEach((row) => {
      worksheet.addRow(row);
    });

    const fileName =
      dateRange.start === dateRange.end
        ? `Power_Report_${dateRange.start}.xlsx`
        : `Power_Report_${dateRange.start}_to_${dateRange.end}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
  };

  if (!isMounted) return <div className="min-h-screen bg-gray-100" />;

  return (
    <main className="p-4 sm:p-8 bg-[#e5e7eb] min-h-screen font-sans select-none">
      <div className="max-w-8xl mx-auto bg-white border-2 border-gray-300 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4 bg-white border-2 border-gray-800 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 border-r-2 border-gray-100 pr-4">
                <Calendar size={20} className="text-gray-800" />
                <span className="text-[10px] font-black uppercase text-gray-400 hidden sm:inline">
                  Range
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col">
                  <label className="text-[8px] font-black uppercase text-gray-400 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onClick={(e) => e.target.showPicker()}
                    onChange={(e) =>
                      setDateRange((p) => ({ ...p, start: e.target.value }))
                    }
                    className="text-xs font-mono font-bold bg-transparent outline-none cursor-pointer text-gray-800"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[8px] font-black uppercase text-gray-400 mb-1">
                    To
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onClick={(e) => e.target.showPicker()}
                    onChange={(e) =>
                      setDateRange((p) => ({ ...p, end: e.target.value }))
                    }
                    className="text-xs font-mono font-bold bg-transparent outline-none cursor-pointer text-gray-800"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setQuickRange("today")}
                className="flex-1 bg-gray-800 text-white text-[9px] font-black uppercase py-1.5 hover:bg-blue-700 transition-colors border-b-2 border-blue-400"
              >
                Today
              </button>
              <button
                onClick={() => setQuickRange("thisMonth")}
                className="flex-1 bg-gray-800 text-white text-[9px] font-black uppercase py-1.5 hover:bg-blue-700 transition-colors border-b-2 border-blue-400"
              >
                This Month
              </button>
              <button
                onClick={generateExcel}
                className="flex-1 bg-emerald-700 text-white text-[9px] font-black uppercase py-1.5 hover:bg-emerald-800 transition-colors border-b-2 border-emerald-400 flex items-center justify-center gap-2 px-3"
              >
                <FileDown size={18} />
                REPORT
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 border-t-4 border-emerald-500 ring-2 ring-gray-100 shadow-md rounded-sm">
            <p className="text-[11px] font-black uppercase text-gray-500">
              Total Usage
            </p>
            <p className="text-2xl font-black italic text-gray-800">
              {chartData
                .reduce((acc, curr) => acc + (curr[selectedMeters[0]] || 0), 0)
                .toFixed(1)}{" "}
              <span className="text-sm">kWh</span>
            </p>
          </div>
          <div className="bg-white p-6 border-t-4 border-orange-500 ring-2 ring-gray-100 shadow-md rounded-sm">
            <p className="text-[11px] font-black uppercase text-gray-500">
              Peak Consumption
            </p>
            <p className="text-2xl font-black italic text-orange-600">
              {peakInfo.value.toFixed(1)} <span className="text-sm">kWh</span>
            </p>
            <p className="text-[10px] mt-4 font-bold text-gray-400 uppercase italic">
              at {peakInfo.time}
            </p>
          </div>
        </div>

        <div className="ring-2 ring-gray-200 overflow-hidden shadow-xl bg-white rounded-sm">
          <div className="bg-gray-800 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-white text-xs font-black uppercase tracking-[0.15em] flex items-center gap-2">
              <Zap size={16} className="text-[#ffff00]" /> Load Profile
              Analytics {loading && "..."}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {allMeters.map((meter) => (
                <button
                  key={meter}
                  onClick={() => setSelectedMeters([meter])}
                  className={`flex items-center gap-1.5 px-2 py-1 border text-[9px] font-bold uppercase transition-all ${
                    selectedMeters.includes(meter)
                      ? `bg-gray-700 border-blue-500 text-white`
                      : "bg-gray-900 border-gray-700 text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${selectedMeters.includes(meter) ? "bg-blue-500" : "bg-gray-600"}`}
                  />
                  {meter}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 h-[400px] sm:h-[450px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="date"
                    fontSize={9}
                    fontWeight="bold"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#9ca3af" }}
                    minTickGap={10}
                  />
                  <YAxis
                    fontSize={9}
                    fontWeight="bold"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#9ca3af" }}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {selectedMeters.map((meter) => (
                    <Bar
                      key={meter}
                      dataKey={meter}
                      fill="#185acb"
                      radius={[2, 2, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 italic text-sm text-center">
                {loading ? "Loading data..." : `No data available`}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
