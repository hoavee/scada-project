// components/SystemLabel.js
import React from "react";

const SystemLabel = ({
  label,
  status,
  statusColor,
  position,
  width = "120px",
  labelSize = "14px", // Cỡ chữ của label chính
  statusSize = "12px", // Cỡ chữ của tag status
  isStacked = false, // true: 2 dòng, false: 1 dòng (mặc định)
}) => {
  return (
    <div
      className="absolute pointer-events-none flex flex-col items-center justify-center"
      style={{
        left: position.left,
        top: position.top,
        width: width,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
    >
      <div
        className={`flex items-center px-2 py-1 
          ${isStacked ? "flex-col gap-0.5 text-center" : "flex-row gap-1"}`}
      >
        <h2
          className="font-bold leading-tight text-gray-900 break-words pt-[1px]"
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
