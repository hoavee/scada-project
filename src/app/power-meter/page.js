"use client";

import React, { useState, useEffect } from "react";

const MeterCard = ({ title, data }) => {
  return (
    <div className="bg-gray-50 border-2 border-gray-400 shadow-xl flex flex-col overflow-hidden h-full">
      {/* Header - Hạ xuống 14px, giảm padding py-2 */}
      <div className="bg-[#004d00] text-white text-[14px] font-black py-2 px-2 uppercase tracking-widest text-center border-b-2 border-gray-500">
        {title}
      </div>

      {/* Thông số - p-2.5 và space-y-2 giúp card rất gọn */}
      <div className="p-2.5 space-y-2 bg-white flex-1 flex flex-col justify-center">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-row justify-between items-center gap-2"
          >
            {/* Label - Hạ xuống 11px */}
            <span className="text-gray-700 font-extrabold text-[11px] whitespace-nowrap italic uppercase flex-1 shrink-0">
              {item.label}:
            </span>

            <div className="flex items-center gap-1.5 w-full max-w-[160px] justify-end">
              {/* Box đen - Min-width 100px, chữ hạ xuống 15px */}
              <div className="bg-black border-2 border-gray-400 px-1.5 py-1 text-[#ffff00] font-mono flex-1 min-w-[100px] text-right shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                <span className="text-[15px] font-bold tracking-tighter tabular-nums truncate block">
                  {item.value}
                </span>
              </div>
              {/* Unit - Hạ xuống 12px, độ rộng w-8 */}
              <span className="text-[12px] text-blue-900 font-black w-8 text-left shrink-0">
                {item.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-300 px-2.5 py-1 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[8px] font-black text-gray-400 uppercase">
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
        const response = await fetch("/api-proxy/api/pw", {
          cache: "no-store",
        });

        if (!response.ok) throw new Error("API Offline");

        const result = await response.json();
        const apiMeters = result.meters;

        const formatVal = (val, fractionDigits = 3) => {
          if (val === undefined || val === null)
            return (0).toFixed(fractionDigits);
          return Number(val).toLocaleString("en-US", {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
          });
        };

        const formattedData = meterMapping.map((m) => {
          const d = apiMeters[m.key] || {};

          let energyValue = d.energy;
          let energyDecimals = 3;
          let energyUnit = "kWh";

          if (m.key === "PM8") {
            // PM8: Chia 1000, hiển thị 4 số thập phân, đơn vị GWh
            energyValue = (Number(d.energy) || 0) / 1000;
            energyDecimals = 4;
            energyUnit = "GWh";
          } else {
            // PM1 -> PM7: Nhân 1000, hiển thị 3 số thập phân, đơn vị kWh
            energyValue = (Number(d.energy) || 0) * 1000;
          }

          return {
            title: m.title,
            data: [
              {
                label: "Voltage 3 Phase",
                value: formatVal(d.voltageLL),
                unit: "V",
              },
              {
                label: "Voltage L-N",
                value: formatVal(d.voltageLN),
                unit: "V",
              },
              {
                label: "Current",
                value: formatVal(d.current),
                unit: "A",
              },
              {
                label: "Power Consumption",
                value: formatVal(energyValue, energyDecimals),
                unit: energyUnit,
              },
            ],
          };
        });

        setMetersData(formattedData);
        if (result.timestamp) setApiTimestamp(result.timestamp);

        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      } finally {
        timer = setTimeout(fetchData, 1000);
      }
    };

    fetchData();

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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 flex-1">
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
            {apiTimestamp && (
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-500 uppercase">
                  Last Update
                </span>
                <span className="text-[12px] font-black text-blue-900">
                  {apiTimestamp}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
