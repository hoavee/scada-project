export default function FanComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      {/* Container chính: Giữ tỉ lệ để không bị lệch khi zoom */}
      <div className="relative w-full max-w-2xl aspect-video overflow-hidden shadow-2xl">
        {/* 1. Ảnh Background */}
        <img
          src="https://i5.walmartimages.com/asr/b2c37199-e460-424a-af76-61b49b519558.79aef705be7dfa09261b5162a8686a59.jpeg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 2. Cánh quạt */}
        <div
          className="absolute"
          style={{
            top: "43%", // Tọa độ Y (đã căn chỉnh cho ảnh nền của bạn)
            left: "50%", // Tọa độ X
            width: "25%", // Kích thước quạt
            transform: "translate(-50%, -50%)", // QUAN TRỌNG: Giữ tâm cố định khi zoom
            zIndex: 10,
          }}
        >
          <img
            // SỬ DỤNG ẢNH PNG TRONG SUỐT ĐỂ THẤY HIỆU ỨNG QUAY
            src="https://static.vecteezy.com/system/resources/thumbnails/041/858/076/small/ai-generated-five-blade-marine-propeller-isolated-on-transparent-background-free-png.png"
            alt="Fan"
            className="w-full h-auto fan-running"
          />
        </div>
      </div>
    </div>
  );
}
