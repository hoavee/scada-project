"use client";

import React, { useState, useEffect } from "react";

const MeterCard = ({ title, data }) => {
  return (
    <div className="bg-gray-50 border-2 border-gray-400 shadow-xl flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div className="bg-[#004d00] text-white text-[14px] sm:text-[16px] font-black py-3 px-2 uppercase tracking-widest text-center border-b-2 border-gray-500">
        {title}
      </div>

      {/* Thông số */}
      <div className="p-3 sm:p-4 space-y-3 bg-white flex-1 flex flex-col justify-center">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-row justify-between items-center gap-2"
          >
            <span className="text-gray-700 font-extrabold text-[11px] sm:text-[13px] whitespace-nowrap italic uppercase flex-1 shrink-0">
              {item.label}:
            </span>

            <div className="flex items-center gap-1 sm:gap-2 w-full max-w-[180px] justify-end">
              <div className="bg-black border-2 border-gray-500 px-2 py-1.5 text-[#ffff00] font-mono flex-1 min-w-[80px] sm:min-w-[120px] text-right shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                <span className="text-[15px] sm:text-[18px] font-bold tracking-tighter tabular-nums truncate block">
                  {item.value}
                </span>
              </div>
              <span className="text-[12px] sm:text-[14px] text-blue-900 font-black w-8 sm:w-10 text-left shrink-0">
                {item.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-300 px-3 py-1.5 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-900"></div>
          <span className="text-[9px] font-black text-gray-500 uppercase">
            ONLINE
          </span>
        </div>
      </div>
    </div>
  );
};

export default function PowerMeterPage() {
  const [metersData, setMetersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiTimestamp, setApiTimestamp] = useState("");

  const meterMapping = [
    { key: "PM1", title: "MUL-VC1" },
    { key: "PM2", title: "MUL-VC2" },
    { key: "PM3", title: "MUL-CHILLER" },
    { key: "PM4", title: "MUL-DEHUM1" },
    { key: "PM5", title: "MUL-DEHUM2" },
    { key: "PM6", title: "MUL-LIGHTING" },
    { key: "PM7", title: "MUL-HVAC" },
    { key: "PM8", title: "MAIN POWER METER" },
  ];

  useEffect(() => {
    let timer;

    const fetchData = async () => {
      try {
        // Sử dụng cache: "no-store" giống page.js bạn cung cấp
        const response = await fetch("http://113.164.80.153:8000/api/pw", {
          cache: "no-store",
        });

        if (!response.ok) throw new Error("API Offline");

        const result = await response.json();
        const apiMeters = result.meters;

        const formattedData = meterMapping.map((m) => {
          const d = apiMeters[m.key] || {};
          return {
            title: m.title,
            data: [
              {
                label: "Voltage 3 Phase",
                value: d.voltageLL?.toFixed(2) || "0.00",
                unit: "V",
              },
              {
                label: "Voltage L-N",
                value: d.voltageLN?.toFixed(2) || "0.00",
                unit: "V",
              },
              {
                label: "Current",
                value: d.current?.toFixed(2) || "0.00",
                unit: "A",
              },
              {
                label: "Power Consumption",
                value: d.energy?.toLocaleString() || "0.00",
                unit: "kWh",
              },
            ],
          };
        });

        setMetersData(formattedData);
        // Nếu API có trường timestamp như trang kia, bạn có thể lưu lại
        if (result.timestamp) setApiTimestamp(result.timestamp);

        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        // Đệ quy setTimeout 1000ms (1 giây) giống hệt cơ chế trang SCADA bạn gửi
        timer = setTimeout(fetchData, 60000);
      }
    };

    fetchData();

    // Cleanup khi component unmount
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#c0c0c0] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-bold tracking-widest text-green-800 uppercase">
          Loading Power Data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#c0c0c0] p-2 sm:p-6 text-black font-sans select-none">
      <div className="max-w-[1800px] mx-auto bg-[#f0f0f0] border-2 border-gray-500 shadow-2xl p-3 sm:p-8 min-h-[90vh] flex flex-col">
        {/* Grid Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 flex-1">
          {metersData.map((meter, index) => (
            <MeterCard key={index} title={meter.title} data={meter.data} />
          ))}
        </div>

        {/* Footer Area */}
        <div className="mt-6 pt-4 border-t-2 border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 sm:gap-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-500 uppercase">
                System Status
              </span>
              <span className="text-[12px] font-black text-green-700">
                ● {metersData.length} METERS ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
