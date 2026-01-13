"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Title,
  AreaChart,
  Metric,
  Text,
  Grid,
  Flex,
  BadgeDelta,
} from "@tremor/react";
import { ArrowLeft, Zap, Activity, ShieldCheck, Calendar } from "lucide-react";
import Link from "next/link";

// --- HELPER: TẠO DUMMY DATA ---
const generateDummyData = () => {
  const data = [];
  const today = new Date();

  // Tạo dữ liệu cho 40 ngày gần nhất để đảm bảo bao phủ được option "30 ngày"
  for (let i = 40; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    data.push({
      date: dateStr,
      "MUL-CHILLER": Math.floor(Math.random() * (3500 - 2500) + 2500),
      "MUL-DEHUM1": Math.floor(Math.random() * (1500 - 1000) + 1000),
      "MUL-DEHUM2": Math.floor(Math.random() * (5500 - 4000) + 4000),
      "MUL-VC1": Math.floor(Math.random() * (1000 - 700) + 700),
      "MUL-VC2": Math.floor(Math.random() * (1200 - 800) + 800),
      "MUL-HVAC": Math.floor(Math.random() * (3200 - 2000) + 2000),
      "MUL-LIGHTING": Math.floor(Math.random() * (900 - 700) + 700),
      "POWER METER 8": Math.floor(Math.random() * (5500 - 4800) + 4800),
    });
  }
  return data;
};

const allMeters = [
  "MUL-CHILLER",
  "MUL-DEHUM1",
  "MUL-DEHUM2",
  "MUL-VC1",
  "MUL-VC2",
  "MUL-HVAC",
  "MUL-LIGHTING",
  "POWER METER 8",
];

const customTooltip = ({ payload, active, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-xl ring-1 ring-black/5 z-50">
      <p className="text-[11px] font-black text-gray-500 uppercase border-b border-gray-100 pb-1 mb-2">
        Date: {label}
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
              {category.value.toLocaleString()} kWh
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

  // Tạo dữ liệu một lần duy nhất khi component mount
  const chartData = useMemo(() => generateDummyData(), []);

  // Mặc định hiển thị 7 ngày gần nhất
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    setDateRange({
      start: sevenDaysAgo.toISOString().split("T")[0],
      end: today,
    });
    setIsMounted(true);
  }, []);

  const setQuickRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    setDateRange({
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    });
  };

  const filteredData = chartData.filter((item) => {
    return item.date >= dateRange.start && item.date <= dateRange.end;
  });

  const toggleMeter = (meter) => {
    setSelectedMeters([meter]);
  };

  if (!isMounted) return <div className="min-h-screen bg-gray-100" />;

  return (
    <main className="p-4 sm:p-8 bg-[#e5e7eb] min-h-screen font-sans select-none">
      <div className="max-w-7xl mx-auto bg-white border-2 border-gray-300 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] p-6">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 border-b-4 border-gray-800 pb-6 gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 bg-gray-100 border-2 border-gray-400 hover:bg-gray-200 shadow-sm transition-all active:scale-95"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </Link>
            <div>
              <h1 className="text-3xl font-black uppercase italic text-gray-800 tracking-tighter leading-none">
                Energy <span className="text-green-700">Consumption</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Activity size={12} className="text-green-600 animate-pulse" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Real-time Power Analytics
                </span>
              </div>
            </div>
          </div>

          {/* DATE PICKER & QUICK SELECT */}
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
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
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
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="text-xs font-mono font-bold bg-transparent outline-none cursor-pointer text-gray-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setQuickRange(7)}
                className="flex-1 bg-gray-800 text-white text-[9px] font-black uppercase py-1.5 hover:bg-blue-700 transition-colors border-b-2 border-blue-400"
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setQuickRange(30)}
                className="flex-1 bg-gray-800 text-white text-[9px] font-black uppercase py-1.5 hover:bg-blue-700 transition-colors border-b-2 border-blue-400"
              >
                Last 30 Days
              </button>
            </div>
          </div>

          <div className="bg-gray-900 px-4 py-2 border-r-4 border-green-500 shadow-lg">
            <Text className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              Est. Monthly Cost
            </Text>
            <Metric className="text-xl font-mono text-[#ffff00] leading-none">
              $14,502.20
            </Metric>
          </div>
        </div>

        {/* CÁC THÀNH PHẦN CÒN LẠI (GIỮ NGUYÊN HTML/CSS) */}
        <Grid numItemsSm={2} numItemsLg={3} className="gap-6 mb-8">
          <Card
            className="ring-2 ring-gray-100 shadow-md"
            decoration="top"
            decorationColor="emerald"
          >
            <Flex justifyContent="between" alignItems="start">
              <div>
                <Text className="text-[11px] font-black uppercase text-gray-500">
                  Total Month Usage
                </Text>
                <Metric className="font-black italic text-gray-800">
                  12,450 <span className="text-sm">kWh</span>
                </Metric>
              </div>
              <BadgeDelta deltaType="moderateIncrease">+12.5%</BadgeDelta>
            </Flex>
            <div className="w-full bg-gray-200 h-1.5 mt-6 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[83%] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </div>
          </Card>
          <Card
            className="ring-2 ring-gray-100 shadow-md"
            decoration="top"
            decorationColor="blue"
          >
            <Text className="text-[11px] font-black uppercase text-gray-500">
              Efficiency Index
            </Text>
            <Metric className="font-black italic text-blue-700">
              94.2 <span className="text-sm">%</span>
            </Metric>
            <Flex className="mt-4 border-t border-gray-50 pt-2">
              <ShieldCheck size={14} className="text-blue-500" />
              <Text className="text-[10px] font-bold text-blue-500 uppercase ml-2">
                System Optimized
              </Text>
            </Flex>
          </Card>
          <Card
            className="ring-2 ring-gray-100 shadow-md"
            decoration="top"
            decorationColor="orange"
          >
            <Text className="text-[11px] font-black uppercase text-gray-500">
              Peak Power Demand
            </Text>
            <Metric className="font-black italic text-orange-600">
              84.5 <span className="text-sm">kW</span>
            </Metric>
            <Text className="text-[10px] mt-4 font-bold text-gray-400 uppercase italic">
              Last Peak: Today, 14:05 PM
            </Text>
          </Card>
        </Grid>

        <Card className="ring-2 ring-gray-200 p-0 overflow-hidden shadow-xl bg-white border-none">
          <div className="bg-gray-800 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <Title className="text-white text-xs font-black uppercase tracking-[0.15em] flex items-center gap-2">
              <Zap size={16} className="text-[#ffff00]" /> Load Profile
              Analytics
            </Title>

            <div className="flex flex-wrap justify-center gap-2">
              {allMeters.map((meter) => (
                <button
                  key={meter}
                  onClick={() => toggleMeter(meter)}
                  className={`flex items-center gap-1.5 px-2 py-1 border text-[9px] font-bold uppercase transition-all ${
                    selectedMeters.includes(meter)
                      ? `bg-gray-700 border-blue-500 text-white shadow-inner`
                      : "bg-gray-900 border-gray-700 text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      selectedMeters.includes(meter)
                        ? "bg-blue-500"
                        : "bg-gray-600"
                    }`}
                  />
                  {meter}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {filteredData.length > 0 ? (
              <AreaChart
                data={filteredData}
                index="date"
                categories={selectedMeters}
                colors={["blue-700"]}
                valueFormatter={(number) => `${number.toLocaleString()} kWh`}
                yAxisWidth={65}
                showAnimation={true}
                showLegend={false}
                showGridLines={true}
                curveType="monotone"
                customTooltip={customTooltip}
                className="h-96 mt-4 z-10"
              />
            ) : (
              <div className="h-96 mt-4 flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 italic text-sm text-center">
                No data available for the period:
                <br />
                {dateRange.start} to {dateRange.end}
              </div>
            )}
          </div>

          <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-between items-center italic">
            <div className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
              Data Source: Power_Meter_Gateway_v4 // Sync: 100%
            </div>
            <button className="text-[10px] font-black text-green-700 hover:underline uppercase tracking-widest">
              Generate Report
            </button>
          </div>
        </Card>
      </div>
    </main>
  );
}
