// components/EnvironmentalStats.js
import React from "react";

const EnvironmentalStats = ({
  data = {
    temp: "10.80",
    hum: "63.00",
    fanStatus: "RUN",
    heaterStatus: "OFF",
  },
  position = { top: "92%", left: "14.5%" },
  width = "9vw",
  onOpenEdit,
}) => {
  return (
    <div
      className="absolute border-[0.1vw] border-gray-600 bg-white text-black font-sans shadow-lg overflow-hidden flex flex-col"
      style={{
        left: position.left,
        top: position.top,
        width: width,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        minHeight: "fit-content",
      }}
    >
      <table className="w-full border-collapse leading-none">
        <tbody className="text-[0.9vw]">
          {/* TEMP Row */}
          <tr className="border-b-[0.05vw] border-gray-400">
            <td className="bg-gray-100 px-[0.4vw] py-[0.1vw] font-bold border-r-[0.05vw] border-gray-400 w-1/3">
              TEMP
            </td>
            <td className="px-[0.4vw] py-[0.1vw] text-right font-mono font-bold">
              {data.temp}
            </td>
          </tr>
          {/* HUM Row */}
          <tr className="border-b-[0.05vw] border-gray-400">
            <td className="bg-gray-100 px-[0.4vw] py-[0.1vw] font-bold border-r-[0.05vw] border-gray-400">
              HUM
            </td>
            <td className="px-[0.4vw] py-[0.1vw] text-right font-mono font-bold">
              {data.hum} %
            </td>
          </tr>
          {/* FAN Row - Đã thêm lại */}
          <tr className="border-b-[0.05vw] border-gray-400">
            <td className="bg-gray-100 px-[0.4vw] py-[0.1vw] font-bold border-r-[0.05vw] border-gray-400">
              FAN
            </td>
            <td
              className={`px-[0.4vw] py-[0.1vw] text-center font-black ${
                data.fanStatus === "RUN" ? "text-green-600" : "text-red-600"
              }`}
            >
              {data.fanStatus}
            </td>
          </tr>
          {/* HEATER Row */}
          <tr className="border-b-[0.05vw] border-gray-400">
            <td className="bg-gray-100 px-[0.4vw] py-[0.1vw] font-bold border-r-[0.05vw] border-gray-400">
              HEATER
            </td>
            <td
              className={`px-[0.4vw] py-[0.1vw] text-center font-black ${
                data.heaterStatus === "RUN" ? "text-green-600" : "text-red-600"
              }`}
            >
              {data.heaterStatus}
            </td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={() =>
          onOpenEdit("Environmental Settings", data.temp, data.hum)
        }
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-[0.15vw] transition-colors text-[0.65vw] flex items-center justify-center gap-[0.2vw]"
      >
        <span className="text-[0.8vw]">⚙</span> SET
      </button>
    </div>
  );
};

export default EnvironmentalStats;
