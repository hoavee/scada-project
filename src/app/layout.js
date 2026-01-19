"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
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
  Menu,
  X,
  Lock, // Icon cho phần login
  Gauge,
} from "lucide-react";
import "./globals.css";

// --- LOGIC XÁC THỰC CƠ BẢN ---
const AuthContext = createContext();

const ADMIN_CREDENTIALS = {
  username: process.env.NEXT_PUBLIC_ADMIN_USERNAME,
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
};

export default function RootLayout({ children }) {
  const [currentTime, setCurrentTime] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Thông tin đăng nhập demo
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const pathname = usePathname();

  useEffect(() => {
    const authStatus = localStorage.getItem("isLoggedIn");
    if (authStatus === "true") setIsAuthenticated(true);
    setIsLoading(false);

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString("en-GB"));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogin = (e) => {
    e.preventDefault();

    // So sánh với thông tin Admin đã khai báo
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", "admin"); // Lưu thêm vai trò nếu cần
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Sai tài khoản hoặc mật khẩu");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsAuthenticated(false);
  };

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

  // Giao diện Login (Giữ phong cách tối giản của hệ thống)
  if (!isAuthenticated && !isLoading) {
    return (
      <html lang="en">
        <body className="flex min-h-screen bg-[#f0f2f5] items-center justify-center font-sans p-4">
          <div className="w-full max-w-sm bg-white border border-gray-300 shadow-sm p-8">
            <div className="text-center mb-6">
              <h1 className="font-black text-gray-700 uppercase italic text-lg tracking-tighter">
                Central <span className="text-blue-600">Management</span> System
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">
                Login Required
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-2 text-sm border border-gray-300 outline-none focus:border-blue-500 placeholder-gray-700 placeholder:opacity-100 text-gray-700" // Thêm placeholder-gray-500 và opacity-100
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 text-sm border border-gray-300 outline-none focus:border-blue-500 placeholder-gray-700 placeholder:opacity-100 text-gray-700" // Thêm placeholder-gray-500 và opacity-100
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <p className="text-[9px] text-red-500 font-bold uppercase">
                  {error}
                </p>
              )}
              <button className="w-full bg-[#3b5998] text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#2a3f6d]">
                Access System
              </button>
            </form>
          </div>
        </body>
      </html>
    );
  }

  // Giao diện Main (Giữ nguyên 100% cấu trúc HTML/CSS của bạn)
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-[#f0f2f5] font-sans">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

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
            <NavItem href="/gas-compressor" icon={Gauge} label="Gas Comp" />

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

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 h-14 bg-white border-b border-gray-300 flex items-center justify-between px-4 lg:px-6 shadow-sm z-[110]">
            <div className="flex items-center gap-3">
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
                <p className="text-[9px] font-bold text-gray-400 uppercase leading-none tracking-wider">
                  System Status: OK
                </p>
                <p className="text-xs font-mono font-bold text-gray-600">
                  {currentTime}
                </p>
              </div>
              <div
                onClick={handleLogout}
                className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm cursor-pointer hover:bg-red-50 transition-colors"
                title="Click to Logout"
              >
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
