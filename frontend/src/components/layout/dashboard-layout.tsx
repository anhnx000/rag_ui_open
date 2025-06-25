"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Book, MessageSquare, LogOut, Menu, User, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import Breadcrumb from "@/components/ui/breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    // Lưu trạng thái sidebar vào localStorage
    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedCollapsed !== null) {
      setIsSidebarCollapsed(JSON.parse(savedCollapsed));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
  };

  const navigation = [
    { name: "Kho tri thức", href: "/dashboard/knowledge", icon: Book },
    { name: "Trò chuyện", href: "/dashboard/chat", icon: MessageSquare },
    { name: "API Keys", href: "/dashboard/api-keys", icon: Shield },
  ];

  const sidebarWidth = isSidebarCollapsed ? "w-16" : "w-64";
  const mainMargin = isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 m-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md vietinbank-gradient text-white vietinbank-shadow"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 ${sidebarWidth} transform bg-white border-r-2 border-blue-200 vietinbank-shadow transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-20 items-center justify-between border-b-2 border-red-100 pl-4 pr-2 vietinbank-gradient">
            <Link
              href="/dashboard"
              className={`flex items-center text-lg font-bold text-white hover:text-red-100 transition-colors ${
                isSidebarCollapsed ? "justify-center w-full" : ""
              }`}
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                <img
                  src="/logo_vietinbank.png"
                  alt="VietinBank Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col ml-3">
                  <span className="text-base">VietinBank</span>
                  <span className="text-sm font-normal opacity-90">AI Assistant</span>
                </div>
              )}
            </Link>
            
            {/* Desktop toggle button */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-1 rounded-md bg-white/20 text-white hover:bg-white/30 transition-colors"
              aria-label={isSidebarCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 space-y-2 py-6 ${isSidebarCollapsed ? "px-2" : "px-4"}`}>
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-xl py-3 text-sm font-medium transition-all duration-200 nav-item-hover ${
                    isSidebarCollapsed ? "px-2 justify-center sidebar-item-collapsed" : "px-4"
                  } ${
                    isActive
                      ? "vietinbank-gradient text-white vietinbank-shadow"
                      : "text-blue-700 hover:bg-blue-50 hover:text-blue-800 banking-card"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 transition-transform duration-200 ${
                      isActive
                        ? "text-white scale-110"
                        : "group-hover:scale-110 text-blue-600"
                    } ${isSidebarCollapsed ? "" : "mr-3"}`}
                  />
                  {!isSidebarCollapsed && (
                    <>
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-red-300" />
                      )}
                    </>
                  )}
                  {/* Custom tooltip for collapsed state */}
                  {isSidebarCollapsed && (
                    <div className="tooltip">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Banking info section */}
          {!isSidebarCollapsed && (
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-red-50 mx-4 rounded-xl mb-4">
              <div className="text-xs text-blue-700 font-medium mb-1">🏦 Ngân hàng số</div>
              <div className="text-xs text-gray-600">Trợ lý AI thông minh</div>
            </div>
          )}
          
          {/* User profile and logout */}
          <div className="border-t-2 border-blue-100 p-4 space-y-4">
            <button
              onClick={handleLogout}
              className={`group flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 banking-card-red transition-colors duration-200 nav-item-hover ${
                isSidebarCollapsed ? "px-2 justify-center sidebar-item-collapsed" : "px-3"
              }`}
            >
              <LogOut className={`h-4 w-4 ${isSidebarCollapsed ? "" : "mr-3"}`} />
              {!isSidebarCollapsed && "Đăng xuất"}
              {/* Custom tooltip for collapsed state */}
              {isSidebarCollapsed && (
                <div className="tooltip">
                  Đăng xuất
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`${mainMargin} transition-all duration-300`}>
        <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
}

export const dashboardConfig = {
  mainNav: [],
  sidebarNav: [
    {
      title: "Kho tri thức",
      href: "/dashboard/knowledge",
      icon: "database",
    },
    {
      title: "Trò chuyện",
      href: "/dashboard/chat",
      icon: "messageSquare",
    },
    {
      title: "API Keys",
      href: "/dashboard/api-keys",
      icon: "key",
    },
  ],
};
