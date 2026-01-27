"use client";

import React from "react";

/**
 * @param {number} x - Tọa độ X tuyệt đối trong hệ quy chiếu 770
 * @param {number} y - Tọa độ Y tuyệt đối trong hệ quy chiếu 550
 * @param {number} size - Đường kính của bóng LED
 * @param {string} color - Màu sắc của đèn
 * @param {boolean} isOn - Trạng thái đèn sáng/tắt
 * @param {boolean} isBlinking - Trạng thái nhấp nháy
 */
const LedLight = ({
  x,
  y,
  size = 15,
  color = "#00ff00",
  isOn = true,
  isBlinking = true,
}) => {
  // Chuyển đổi tọa độ dựa trên khung hình 770x550 của trang page.js
  const leftPos = (x / 770) * 100;
  const topPos = (y / 550) * 100;
  const relativeSize = (size / 770) * 100;

  // Class nhấp nháy tùy chỉnh để tránh lỗi Hydration của style-jsx
  const blinkClass = isBlinking
    ? "animate-[pulse_1s_steps(2,start)_infinite]"
    : "";

  return (
    <div
      className="absolute pointer-events-none flex items-center justify-center"
      style={{
        left: `${leftPos}%`,
        top: `${topPos}%`,
        width: `${relativeSize}%`,
        aspectRatio: "1 / 1",
        transform: "translate(-50%, -50%)",
        zIndex: 20,
      }}
    >
      {/* Quầng sáng (Glow effect) */}
      {isOn && (
        <div
          className={`absolute inset-0 rounded-full blur-[2px] ${blinkClass}`}
          style={{
            backgroundColor: color,
            opacity: 0.8,
          }}
        />
      )}

      {/* Thân bóng LED chính */}
      <div
        className={`relative rounded-full border border-gray-800 shadow-inner ${blinkClass}`}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: isOn ? color : "#333333",
          boxShadow: isOn ? `0 0 10px ${color}` : "none",
        }}
      />

      {/* Điểm phản xạ ánh sáng 3D */}
      {isOn && (
        <div
          className={`absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-white rounded-full opacity-50 blur-[0.5px] ${blinkClass}`}
        />
      )}
    </div>
  );
};

export default LedLight;
