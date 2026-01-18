// constants/devices.js

// 1. Cấu hình vị trí và giao diện
export const DEVICES_CONFIG = [
  {
    id: "mvalve1",
    label: "Valve",
    left: "67%",
    top: "21%",
    isStacked: true,
    labelSize: "14px",
  },
  {
    id: "mvalve2",
    label: "Valve",
    left: "95%",
    top: "21%",
    isStacked: true,
    labelSize: "14px",
  },
  {
    id: "fan1",
    label: "FAN-1",
    left: "52.5%",
    top: "4.5%",
    isStacked: false,
    labelSize: "14px",
  },
  {
    id: "fan2",
    label: "FAN-2",
    left: "80.5%",
    top: "5%",
    isStacked: false,
    labelSize: "14px",
  },
  { id: "idu5", label: "Valve", left: "20%", top: "69%" },
  { id: "idu4", label: "Valve", left: "35%", top: "69%" },
  { id: "idu3", label: "Valve", left: "53.5%", top: "69%" },
  { id: "idu2", label: "Valve", left: "72%", top: "69%" },
  { id: "idu1", label: "Valve", left: "88.5%", top: "69%" },
  {
    id: "pump1",
    label: "PUMP 1",
    left: "39%",
    top: "46.5%",
    labelSize: "13px",
  },
  {
    id: "pump2",
    label: "PUMP 2",
    left: "56%",
    top: "46.5%",
    labelSize: "13px",
  },
  {
    id: "pump3",
    label: "PUMP 3",
    left: "72%",
    top: "46.5%",
    labelSize: "13px",
  },
  {
    id: "compressor",
    label: "GAS COMPRESSOR",
    left: "14.5%",
    top: "36%",
    width: "200px",
    isStacked: false,
    labelSize: "14px",
  },
];

// 2. Trạng thái mặc định ban đầu
export const INITIAL_DEVICE_STATUS = {
  mvalve1: { status: "CLOSE", color: "bg-red-600" },
  mvalve2: { status: "CLOSE", color: "bg-red-600" },
  fan1: { status: "RUN", color: "bg-green-800" },
  fan2: { status: "RUN", color: "bg-green-800" },
  idu5: { status: "CLOSE", color: "bg-red-600" },
  idu4: { status: "CLOSE", color: "bg-red-600" },
  idu3: { status: "CLOSE", color: "bg-red-600" },
  idu2: { status: "CLOSE", color: "bg-red-600" },
  idu1: { status: "CLOSE", color: "bg-red-600" },
  pump1: { status: "RUN", color: "bg-green-800" },
  pump2: { status: "RUN", color: "bg-green-800" },
  pump3: { status: "STOP", color: "bg-red-600" },
  compressor: { status: null, color: "" },
};
