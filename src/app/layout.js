"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  BarChart3,
  Bell,
  Settings,
  HelpCircle,
  Activity,
  Menu, // Thêm icon Menu cho nút hamburger
  X, // Thêm icon X để đóng sidebar
} from "lucide-react";
import "./globals.css";

export default function RootLayout({ children }) {
  const [currentTime, setCurrentTime] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State quản lý đóng mở sidebar
  const pathname = usePathname();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString("en-GB"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Đóng sidebar tự động khi chuyển trang trên mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const NavItem = ({ href, icon: Icon, label }) => {
    const active = pathname === href;
    return (
      <Link href={href} className="group">
        <div
          className={`flex flex-col items-center justify-center py-4 transition-all ${
            active
              ? "bg-[#2a3f6d] border-l-4 border-blue-400 text-white"
              : "text-blue-100 hover:bg-[#2a3f6d] hover:text-white border-l-4 border-transparent"
          }`}
        >
          <Icon size={22} className="mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-tighter text-center px-1 leading-tight">
            {label}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <html lang="en">
      <body className="flex min-h-screen bg-[#f0f2f5] font-sans">
        {/* LỚP PHỦ (OVERLAY) - Chỉ hiện trên mobile khi sidebar mở */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
          fixed lg:relative inset-y-0 left-0 w-20 bg-[#3b5998] flex flex-col shadow-2xl z-[120] transition-transform duration-300
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        >
          <div className="py-6 flex flex-col items-center border-b border-blue-400/30 bg-[#2a3f6d]">
            <img
              src="https://www.argotech.vn/img/logo.60fa6afb.svg"
              alt="Logo"
              className="w-12 h-auto brightness-0 invert"
            />
          </div>

          <nav className="flex-1 mt-2">
            <NavItem href="/scada" icon={LayoutDashboard} label="SCADA" />
            <NavItem href="/power-meter" icon={Zap} label="Power" />
            <NavItem href="/power-consume" icon={BarChart3} label="Energy" />

            <div className="h-[1px] bg-blue-400/20 my-4 mx-3"></div>

            <div className="flex flex-col gap-4 items-center opacity-60">
              <Bell
                size={20}
                className="text-white cursor-pointer hover:opacity-100"
              />
              <Settings
                size={20}
                className="text-white cursor-pointer hover:opacity-100"
              />
              <HelpCircle
                size={20}
                className="text-white cursor-pointer hover:opacity-100"
              />
            </div>
          </nav>

          <div className="py-4 text-center">
            <Activity
              size={18}
              className="text-green-400 inline-block animate-pulse"
            />
          </div>
        </aside>

        {/* PHẦN NỘI DUNG CHÍNH */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 h-14 bg-white border-b border-gray-300 flex items-center justify-between px-4 lg:px-6 shadow-sm z-[110]">
            <div className="flex items-center gap-3">
              {/* NÚT HAMBURGER - Đã tối ưu màu sắc và độ đậm */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-blue-50 rounded-md transition-all active:scale-95 z-[120]"
              >
                {isSidebarOpen ? (
                  <X size={26} strokeWidth={3} className="text-blue-600" />
                ) : (
                  <Menu size={26} strokeWidth={3} className="text-blue-600" />
                )}
              </button>

              <h1 className="font-black text-gray-700 uppercase italic text-sm tracking-tighter">
                Central <span className="text-blue-600">Management</span> System
              </h1>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div className="hidden sm:block">
                {" "}
                {/* Ẩn text status trên màn hình quá nhỏ */}
                <p className="text-[9px] font-bold text-gray-400 uppercase leading-none tracking-wider">
                  System Status: OK
                </p>
                <p className="text-xs font-mono font-bold text-gray-600">
                  {currentTime}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm">
                👤
              </div>
            </div>
          </header>

          <main className="flex-1 bg-[#f8f9fa]">{children}</main>

          <footer className="h-8 bg-gray-200 border-t border-gray-300 flex items-center px-6 text-[9px] font-bold text-gray-500 uppercase tracking-[0.15em]">
            SCADA Management System © 2026
          </footer>
        </div>
      </body>
    </html>
  );
}
