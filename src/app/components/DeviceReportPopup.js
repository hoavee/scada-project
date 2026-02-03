import React, { useState, useMemo, useEffect } from "react";

const DeviceReportPopup = ({ id, label, onClose }) => {
  const [timeRange, setTimeRange] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
  const ITEMS_PER_PAGE = 8;

  const ranges = [1, 3, 5, 7, 12, 24];

  useEffect(() => {
    const fetchReport = async () => {
      let endpoint = "";
      let dataKey = "";

      if (id.startsWith("fan")) {
        endpoint = "/api-proxy/api/statusfanct";
        dataKey = id === "fan1" ? "fan_ct1" : "fan_ct2";
      } else if (id.startsWith("mvalve")) {
        endpoint = "/api-proxy/api/statusvalvect";
        dataKey = id === "mvalve1" ? "valve_ct1" : "valve_ct2";
      } else if (id.startsWith("pump")) {
        endpoint = "/api-proxy/api/statuspump";
        dataKey = id;
      } else if (id.startsWith("iduv")) {
        endpoint = "/api-proxy/api/statusvalveidu";
        dataKey = `valve_idu${id.replace("iduv", "")}`;
      }

      if (endpoint) {
        try {
          setIsLoading(true); // Bắt đầu loading
          const response = await fetch(endpoint);
          const json = await response.json();

          // 1. Lọc theo khoảng thời gian (Time Range)
          const now = new Date();
          const startTime = new Date(
            now.getTime() - timeRange * 60 * 60 * 1000,
          );

          const timeFiltered = json.filter((item) => {
            const itemDate = new Date(item.time);
            return itemDate >= startTime;
          });

          // 2. Lọc bỏ các bản ghi trùng lặp trạng thái liên tiếp
          const stateFiltered = timeFiltered.filter((item, index, array) => {
            if (index === array.length - 1) return true;
            return item[dataKey] !== array[index + 1][dataKey];
          });

          // 3. Format dữ liệu và tính Duration
          const formattedData = stateFiltered.map((item, index, array) => {
            const rawTime = item.time.replace("T", " ").split(".")[0];

            let duration = "---";
            if (index > 0) {
              const currentTime = new Date(item.time);
              const newerTime = new Date(array[index - 1].time);
              const diffMs = Math.abs(newerTime - currentTime);
              duration = Math.floor(diffMs / 60000) + " Min";
            }

            return {
              timestamp: rawTime,
              status: item[dataKey],
              duration: duration,
            };
          });

          setApiData(formattedData);
          setCurrentPage(1);
        } catch (error) {
          console.error(`Error fetching report for ${id}:`, error);
        } finally {
          setIsLoading(false); // Kết thúc loading cho dù thành công hay lỗi
        }
      }
    };

    fetchReport();
  }, [id, timeRange]);

  const historyData = useMemo(() => {
    return apiData;
  }, [apiData]);

  const totalPages = Math.ceil(historyData.length / ITEMS_PER_PAGE) || 1;
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return historyData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, historyData]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] backdrop-blur-sm p-4">
      <div className="bg-white border-2 border-gray-800 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6 border-b-2 pb-4">
          <h3 className="font-black text-base uppercase tracking-widest italic">
            Device Report: {label}
          </h3>
          <div className="flex bg-gray-100 p-1 border">
            {ranges.map((r) => (
              <button
                key={r}
                disabled={isLoading}
                onClick={() => setTimeRange(r)}
                className={`px-2 py-1 text-[10px] font-bold ${
                  timeRange === r ? "bg-gray-800 text-white" : "text-gray-500"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {r}H
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[400px] overflow-auto border border-gray-800">
          <table className="w-full text-[11px] text-left">
            <thead className="bg-gray-800 text-white sticky top-0">
              <tr>
                <th className="p-2 border-r border-gray-600">Timestamp</th>
                <th className="p-2 border-r border-gray-600">Event</th>
                <th className="p-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="p-8 text-center text-gray-500 font-bold animate-pulse italic border-t border-gray-200"
                  >
                    Loading data...
                  </td>
                </tr>
              ) : currentTableData.length > 0 ? (
                currentTableData.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-2 border-t border-r border-gray-200 font-mono">
                      {row.timestamp}
                    </td>
                    <td className="p-2 border-t border-r border-gray-200 font-bold">
                      <span
                        className={
                          row.status === "RUN" || row.status === "OPEN"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="p-2 border-t border-gray-200">
                      {row.duration}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="p-8 text-center text-gray-500 italic border-t border-gray-200"
                  >
                    No status change in the selected time range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4 px-1">
          <span className="text-[10px] font-bold uppercase text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1 || isLoading}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 bg-gray-100 border border-gray-800 text-[10px] font-bold disabled:opacity-30"
            >
              PREV
            </button>
            <button
              disabled={currentPage === totalPages || isLoading}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-100 border border-gray-800 text-[10px] font-bold disabled:opacity-30"
            >
              NEXT
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-gray-800 text-white font-black uppercase text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
        >
          Close Report
        </button>
      </div>
    </div>
  );
};

export default DeviceReportPopup;
