import React from "react";
// Sử dụng TrendingUp để thể hiện xu hướng rõ ràng hơn
import { TrendingUp } from "lucide-react";

const EnvironmentalStats = ({
  data = {
    temp: "11.30",
    hum: "61.20",
    setTemp: "13.50",
    setHum: "68.00",
    fanStatus: "RUN",
    heaterStatus: "OFF",
    tLabel: "T1",
    hLabel: "H1",
  },
  position = { top: "50%", left: "14.5%" },
  width = "150px",
  onOpenEdit,
  onOpenTrend,
}) => {
  return (
    <div
      className="absolute border border-black bg-white text-black font-sans overflow-hidden leading-tight cursor-default shadow-sm"
      style={{
        left: position.left,
        top: position.top,
        width: width,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
    >
      <table className="w-full border-collapse table-fixed text-[11px]">
        <thead>
          <tr className="border-b border-black">
            <th className="border-r border-black py-1 font-bold w-[60%] text-center bg-gray-50 uppercase tracking-tighter">
              Temp / Hum
            </th>
            <th className="py-1 font-bold text-center bg-gray-50 uppercase">
              Set
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Temperature Row */}
          <tr className="border-b border-gray-300">
            <td className="border-r border-black px-1 py-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">
                    {data.tLabel}
                  </span>
                  {/* Button Trend cho Nhiệt độ */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTrend(data.tLabel);
                    }}
                    title="View Temperature Trend"
                    className="p-0.5 rounded-sm bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 border border-red-100 shadow-sm"
                  >
                    <TrendingUp size={10} strokeWidth={3} />
                  </button>
                </div>
                <span className="font-mono font-bold text-gray-900">
                  {data.temp}
                </span>
              </div>
            </td>
            <td
              className="bg-yellow-50 px-1 py-1 text-right font-bold cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() =>
                onOpenEdit(
                  `Set Environment ${data.tLabel}`,
                  data.setTemp,
                  data.setHum,
                )
              }
            >
              {data.setTemp}
            </td>
          </tr>

          {/* Humidity Row */}
          <tr className="border-b border-black">
            <td className="border-r border-black px-1 py-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">
                    {data.hLabel}
                  </span>
                  {/* Button Trend cho Độ ẩm */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTrend(data.hLabel);
                    }}
                    title="View Humidity Trend"
                    className="p-0.5 rounded-sm bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 border border-blue-100 shadow-sm"
                  >
                    <TrendingUp size={10} strokeWidth={3} />
                  </button>
                </div>
                <span className="font-mono font-bold text-gray-900">
                  {data.hum}%
                </span>
              </div>
            </td>
            <td
              className="bg-yellow-50 px-1 py-1 text-right font-bold cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() =>
                onOpenEdit(
                  `Set Environment ${data.hLabel}`,
                  data.setTemp,
                  data.setHum,
                )
              }
            >
              {data.setHum}%
            </td>
          </tr>

          <tr className="border-b border-gray-300 bg-gray-50">
            <td className="border-r border-black text-center font-bold py-0.5 text-[9px]">
              FAN
            </td>
            <td className="text-center font-bold py-0.5 text-[9px]">HEATER</td>
          </tr>
          <tr>
            <td
              className={`border-r border-black text-center font-black py-1 text-[10px] ${data.fanStatus === "RUN" ? "text-green-700" : "text-red-600"}`}
            >
              {data.fanStatus}
            </td>
            <td
              className={`text-center font-black py-1 text-[10px] ${data.heaterStatus === "RUN" ? "text-green-700" : "text-red-600"}`}
            >
              {data.heaterStatus}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EnvironmentalStats;
