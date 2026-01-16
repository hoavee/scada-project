import React from "react";

const EnvironmentalStats = ({
  data = {
    temp: "11.30",
    hum: "61.20",
    setTemp: "13.50",
    setHum: "68.00",
    fanStatus: "RUN",
    heaterStatus: "OFF",
  },
  position = { top: "50%", left: "14.5%" },
  width = "9vw",
  onOpenEdit, // Hàm callback từ file gốc
}) => {
  return (
    <div
      className="absolute border-[0.05vw] border-black bg-white text-black font-sans overflow-hidden leading-tight cursor-default"
      style={{
        left: position.left,
        top: position.top,
        width: width,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
    >
      <table className="w-full border-collapse table-fixed text-[0.8vw]">
        <thead>
          <tr className="border-b-[0.05vw] border-black">
            <th className="border-r-[0.05vw] border-black py-[0.1vw] font-bold w-[60%] text-center">
              TEMP HUM
            </th>
            <th className="py-[0.1vw] font-bold text-center">SET</th>
          </tr>
        </thead>
        <tbody>
          {/* Temperature Row */}
          <tr className="border-b-[0.05vw] border-gray-400">
            <td className="border-r-[0.05vw] border-black px-[0.1vw] py-[0.1vw]">
              <div className="flex justify-between items-center">
                <span>{data.tLabel}</span>
                <span className="font-bold">{data.temp}</span>
              </div>
            </td>
            {/* Clickable SET Temp */}
            <td
              className="bg-gray-100 px-[0.1vw] py-[0.1vw] text-right font-bold cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() =>
                onOpenEdit("Environmental Settings", data.temp, data.hum)
              }
            >
              {data.setTemp}
            </td>
          </tr>
          {/* Humidity Row */}
          <tr className="border-b-[0.05vw] border-black">
            <td className="border-r-[0.05vw] border-black px-[0.1vw] py-[0.1vw]">
              <div className="flex justify-between items-center">
                <span>{data.hLabel}</span>
                <span className="font-bold">{data.hum}%</span>
              </div>
            </td>
            {/* Clickable SET Hum */}
            <td
              className="bg-gray-100 px-[0.1vw] py-[0.1vw] text-right font-bold cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() =>
                onOpenEdit("Environmental Settings", data.temp, data.hum)
              }
            >
              {data.setHum}%
            </td>
          </tr>
          {/* Device Headers */}
          <tr className="border-b-[0.05vw] border-gray-400">
            <td className="border-r-[0.05vw] border-black text-center font-bold py-[0.1vw]">
              FAN
            </td>
            <td className="text-center font-bold py-[0.1vw]">HEATER</td>
          </tr>
          {/* Status Indicators */}
          <tr>
            <td
              className={`border-r-[0.05vw] border-black text-center font-black py-[0.1vw] ${
                data.fanStatus === "RUN" ? "text-green-700" : "text-red-600"
              }`}
            >
              {data.fanStatus}
            </td>
            <td
              className={`text-center font-black py-[0.1vw] ${
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
