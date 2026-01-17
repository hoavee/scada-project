// components/SystemLabel.js
import React from "react";

const SystemLabel = ({
  label,
  status,
  statusColor,
  position,
  width = "100px", // Nhận width px cố định
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
      <div className="flex items-center gap-1.5 bg-white/50 px-1 py-0.5 rounded-sm">
        <h2 className="font-bold text-[14px] whitespace-nowrap leading-none text-gray-800 drop-shadow-sm">
          {label}
        </h2>
        {status && (
          <span
            className={`text-[12px] font-bold px-1.5 py-0.5 text-white rounded-[3px] leading-none shadow-sm ${statusColor}`}
          >
            {status}
          </span>
        )}
      </div>
    </div>
  );
};

export default SystemLabel;
