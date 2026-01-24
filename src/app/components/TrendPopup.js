import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TrendPopup = ({ label, onClose }) => {
  const [timeRange, setTimeRange] = useState(12);

  const ranges = [
    { label: "1H", value: 1 },
    { label: "3H", value: 3 },
    { label: "5H", value: 5 },
    { label: "7H", value: 7 },
    { label: "12H", value: 12 },
    { label: "24H", value: 24 },
  ];

  const dummyData = useMemo(() => {
    const data = [];
    const now = new Date();

    // Logic làm tròn về mốc 5 phút gần nhất
    // Ví dụ: 15:07 -> 15:05, 15:04 -> 15:00
    const minutes = now.getMinutes();
    const roundedMinutes = Math.floor(minutes / 5) * 5;
    const startTime = new Date(now);
    startTime.setMinutes(roundedMinutes, 0, 0);

    const totalPoints = (timeRange * 60) / 5;

    for (let i = totalPoints; i >= 0; i--) {
      // Tính lùi lại từ mốc thời gian đã làm tròn
      const pointTime = new Date(startTime.getTime() - i * 5 * 60000);
      data.push({
        time: pointTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Sử dụng định dạng 24h để chuyên nghiệp hơn
        }),
        temp: parseFloat((12 + Math.random() * 2).toFixed(2)),
        hum: parseFloat((50 + Math.random() * 10).toFixed(2)),
      });
    }
    return data;
  }, [timeRange]);

  const isTemp = label.startsWith("T");
  const dataKey = isTemp ? "temp" : "hum";
  const strokeColor = isTemp ? "#ef4444" : "#3b82f6";
  const unit = isTemp ? "°C" : "%";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm p-4">
      <div className="bg-white border-2 border-gray-800 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-5xl p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b-2 border-gray-100 pb-4 gap-4">
          <div>
            <h3 className="font-black text-base uppercase tracking-widest text-gray-800 italic">
              {isTemp ? "Temperature" : "Humidity"} Trend: {label}
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
              Data Points: Every 5 Minutes
            </p>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-sm border border-gray-200 shadow-inner">
            {ranges.map((r) => (
              <button
                key={r.value}
                onClick={() => setTimeRange(r.value)}
                className={`px-3 py-1 text-[10px] font-black transition-all ${
                  timeRange === r.value
                    ? "bg-gray-800 text-white shadow-md scale-105"
                    : "text-gray-500 hover:text-black hover:bg-gray-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-600 font-black text-2xl transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="h-[400px] w-full bg-gray-50/30 p-2 border border-gray-100 rounded-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dummyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="time"
                fontSize={10}
                tick={{ fill: "#374151", fontWeight: "bold" }}
                axisLine={{ stroke: "#374151", strokeWidth: 1 }}
                tickLine={false}
                interval={timeRange <= 3 ? 5 : timeRange <= 7 ? 11 : 23}
              />
              <YAxis
                fontSize={10}
                tick={{ fill: "#374151", fontWeight: "bold" }}
                axisLine={{ stroke: "#374151", strokeWidth: 1 }}
                tickLine={false}
                unit={unit}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  border: "2px solid #000",
                  borderRadius: "0px",
                  boxShadow: "4px 4px 0px rgba(0,0,0,1)",
                }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={strokeColor}
                strokeWidth={3}
                name={isTemp ? "Temperature" : "Humidity"}
                dot={false}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "#fff",
                  fill: strokeColor,
                }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-gray-800 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendPopup;
