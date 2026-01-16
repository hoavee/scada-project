// components/EnvironmentalStats.js
import React from "react";
import { Settings } from "lucide-react"; // Import icon hiện đại

const EnvironmentalStats = ({
  data = {
    temp: "10.80",
    hum: "63.00",
    fanStatus: "RUN",
    heaterStatus: "OFF",
  },
  position = { top: "92%", left: "14.5%" },
  width = "9.5vw",
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
            <td className="bg-gray-100 px-[0.4vw] py-[0.1vw] font-bold border-r-[0.05vw] border-gray-400 w-[35%]">
              TEMP
            </td>
            <td className="px-[0.4vw] py-[0.1vw] font-mono font-bold">
              <div className="flex items-center justify-end flex-nowrap gap-[0.3vw]">
                <span>{data.temp}</span>
                <button
                  onClick={() =>
                    onOpenEdit("Environmental Settings", data.temp, data.hum)
                  }
                  className="hover:text-blue-600 transition-colors"
                >
                  <Settings size="0.8vw" strokeWidth={2.5} />
                </button>
              </div>
            </td>
          </tr>
          {/* HUM Row */}
          <tr className="border-b-[0.05vw] border-gray-400">
            <td className="bg-gray-100 px-[0.4vw] py-[0.1vw] font-bold border-r-[0.05vw] border-gray-400">
              HUM
            </td>
            <td className="px-[0.4vw] py-[0.1vw] font-mono font-bold">
              <div className="flex items-center justify-end flex-nowrap gap-[0.3vw]">
                <span className="whitespace-nowrap">{data.hum} %</span>
                <button
                  onClick={() =>
                    onOpenEdit("Environmental Settings", data.temp, data.hum)
                  }
                  className="hover:text-blue-600 transition-colors"
                >
                  <Settings size="0.8vw" strokeWidth={2.5} />
                </button>
              </div>
            </td>
          </tr>
          {/* FAN Row */}
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
    </div>
  );
};

export default EnvironmentalStats;
