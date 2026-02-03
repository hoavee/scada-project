import React, { useMemo, useState, useEffect } from "react";
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
  const [timeRange, setTimeRange] = useState(3);
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const ranges = [
    { label: "1H", value: 1 },
    { label: "3H", value: 3 },
    { label: "5H", value: 5 },
    { label: "7H", value: 7 },
    { label: "12H", value: 12 },
    { label: "24H", value: 24 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api-proxy/api/temp&hum"); // Link API chính xác
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = useMemo(() => {
    if (!apiData || apiData.length === 0) return [];

    const recordsToTake = timeRange * 12; // 5 phút/lần

    const formattedData = apiData.slice(0, recordsToTake).map((item) => {
      // XỬ LÝ TIMEZONE: Cắt chuỗi để lấy giờ thực tế từ API, bỏ qua việc tự cộng +7 của hệ thống
      const timeString = item.time.split("T")[1].substring(0, 5);

      return {
        time: timeString, // Kết quả sẽ là "11:45"
        value: parseFloat(item[label]),
      };
    });

    return formattedData.reverse(); // Mới nhất nằm bên phải
  }, [apiData, timeRange, label]);

  const isTemp = label.startsWith("T");
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
              Data Points: 5 Min Intervals
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
            className="text-gray-400 hover:text-red-600 font-black text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="h-[400px] w-full bg-gray-50/30 p-2 border border-gray-100 rounded-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
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
                interval={Math.floor(chartData.length / 8)}
              />
              <YAxis
                fontSize={10}
                tick={{ fill: "#374151", fontWeight: "bold" }}
                axisLine={{ stroke: "#374151", strokeWidth: 1 }}
                tickLine={false}
                unit={unit}
                // Giữ khoảng cách 1 đơn vị so với đỉnh/đáy
                domain={["dataMin - 1", "dataMax + 1"]}
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
                dataKey="value"
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
