// components/SystemLabel.js
const SystemLabel = ({
  label,
  status,
  statusColor,
  position,
  width = "10%",
}) => {
  return (
    <div
      className="absolute pointer-events-none flex flex-col items-center justify-center"
      style={{
        left: position.left,
        top: position.top,
        width: width, // Nhận width linh hoạt từ props
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
    >
      <div className="flex items-center gap-1">
        <h2 className="font-bold text-[0.9vw] whitespace-nowrap leading-none">
          {label}
        </h2>
        {status && (
          <span
            className={`text-[0.7vw] font-medium px-[0.3vw] py-[0.1vw] text-white rounded-[3px] leading-none ${statusColor}`}
          >
            {status}
          </span>
        )}
      </div>
    </div>
  );
};

export default SystemLabel;
