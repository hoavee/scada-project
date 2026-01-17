import React from "react";

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
  width = "110px", // Sử dụng px cố định thay cho vw
  onOpenEdit,
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
            <th className="border-r border-black py-1 font-bold w-[60%] text-center bg-gray-50">
              TEMP HUM
            </th>
            <th className="py-1 font-bold text-center bg-gray-50">SET</th>
          </tr>
        </thead>
        <tbody>
          {/* Temperature Row */}
          <tr className="border-b border-gray-300">
            <td className="border-r border-black px-1 py-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500">{data.tLabel}</span>
                <span className="font-bold">{data.temp}</span>
              </div>
            </td>
            <td
              className="bg-yellow-50 px-1 py-1 text-right font-bold cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() =>
                onOpenEdit(
                  `Set Temperature ${data.tLabel}`,
                  data.temp,
                  data.hum
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
                <span className="text-[10px] text-gray-500">{data.hLabel}</span>
                <span className="font-bold">{data.hum}%</span>
              </div>
            </td>
            <td
              className="bg-yellow-50 px-1 py-1 text-right font-bold cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() =>
                onOpenEdit(`Set Humidity ${data.hLabel}`, data.temp, data.hum)
              }
            >
              {data.setHum}%
            </td>
          </tr>
          {/* Device Headers */}
          <tr className="border-b border-gray-300 bg-gray-50">
            <td className="border-r border-black text-center font-bold py-0.5 text-[9px]">
              FAN
            </td>
            <td className="text-center font-bold py-0.5 text-[9px]">HEATER</td>
          </tr>
          {/* Status Indicators */}
          <tr>
            <td
              className={`border-r border-black text-center font-black py-1 text-[10px] ${
                data.fanStatus === "RUN" ? "text-green-700" : "text-red-600"
              }`}
            >
              {data.fanStatus}
            </td>
            <td
              className={`text-center font-black py-1 text-[10px] ${
                data.heaterStatus === "RUN" ? "text-green-700" : "text-red-600"
              }`}
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
