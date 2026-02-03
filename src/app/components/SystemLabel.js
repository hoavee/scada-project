// components/SystemLabel.js
import React from "react";
import { FileText } from "lucide-react"; // Import icon từ lucide-react

const SystemLabel = ({
  label,
  status,
  statusColor,
  position,
  width = "150px", // Đã đổi mặc định thành 150px theo yêu cầu
  labelSize = "14px", // Cỡ chữ của label chính
  statusSize = "12px", // Cỡ chữ của tag status
  isStacked = false, // true: 2 dòng, false: 1 dòng (mặc định)
  onReport,
  showReport = false, // Mặc định là false
}) => {
  return (
    <div
      className="absolute flex flex-col items-center justify-center"
      style={{
        left: position.left,
        top: position.top,
        width: width,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        /* Đã bỏ pointer-events-none để có thể click vào nút report */
      }}
    >
      <div
        className={`flex items-center px-2 py-1 
          ${isStacked ? "flex-col gap-0.5 text-center" : "flex-row gap-1"}`}
      >
        {/* Nút Report đưa lên đầu hàng */}
        {showReport && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onReport) onReport(label);
            }}
            className="text-gray-500 hover:text-blue-600 transition-colors pointer-events-auto flex items-center justify-center shrink-0"
            title="Xem báo cáo"
          >
            <FileText size={14} strokeWidth={2.5} />
          </button>
        )}

        <h2
          className="font-bold leading-tight text-gray-900 break-words"
          style={{ fontSize: labelSize }}
        >
          {label}
        </h2>

        {status && (
          <span
            className={`font-bold px-1.5 py-0.5 text-white rounded-[3px] leading-none shadow-sm shrink-0 ${statusColor}`}
            style={{ fontSize: statusSize }}
          >
            {status}
          </span>
        )}
      </div>
    </div>
  );
};

export default SystemLabel;
