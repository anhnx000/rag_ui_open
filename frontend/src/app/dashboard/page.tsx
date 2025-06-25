"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Book,
  MessageSquare,
  ArrowRight,
  Plus,
  Upload,
  Brain,
  Search,
  Sparkles,
} from "lucide-react";
import { api, ApiError } from "@/lib/api";

interface KnowledgeBase {
  id: number;
  name: string;
  description: string;
  documents: any[];
}

interface Chat {
  id: number;
  title: string;
  messages: any[];
}

interface Stats {
  knowledgeBases: number;
  chats: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ knowledgeBases: 0, chats: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [kbData, chatData] = await Promise.all([
          api.get("/api/knowledge-base"),
          api.get("/api/chat"),
        ]);

        setStats({
          knowledgeBases: kbData.length,
          chats: chatData.length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        if (error instanceof ApiError && error.status === 401) {
          return;
        }
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 rounded-2xl bg-gradient-to-r from-red-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8 shadow-sm border border-red-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                Trợ Lý Tri Thức (Knowledge Assistant)
              </h1>
              <p className="text-slate-600 dark:text-slate-300 max-w-xl">
                Hệ thống quản lý tri thức thông minh của VietinBank. Tải lên tài liệu, 
                xây dựng kho tri thức và nhận được câu trả lời tức thì qua trò chuyện 
                tự nhiên với AI.
              </p>
            </div>
            <a
              href="/dashboard/knowledge/new"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-sm font-medium text-white hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tạo Kho Tri thức Mới
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <div className="rounded-2xl border border-red-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-6">
              <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
                <Book className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
                  {stats.knowledgeBases}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Kho tri thức
                </p>
              </div>
            </div>
            <a
              href="/dashboard/knowledge"
              className="mt-6 flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
            >
              Xem tất cả kho tri thức
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="rounded-2xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-6">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-4">
                <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-4xl font-bold text-slate-900 dark:text-white">
                  {stats.chats}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Phiên Trò chuyện
                </p>
              </div>
            </div>
            <a
              href="/dashboard/chat"
              className="mt-6 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              Xem tất cả phiên trò chuyện
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
          Thao tác Nhanh (Quick Actions)
        </h2>
        <div className="grid gap-6 grid-cols-1 mb-12">
          <a
            href="/dashboard/knowledge/new"
            className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-md transition-all hover:border-red-500 dark:hover:border-red-500"
          >
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4 mb-4">
              <Brain className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Tạo Kho Tri thức
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Xây dựng kho tri thức thông minh phục vụ hoạt động ngân hàng
            </p>
          </a>

          <a
            href="/dashboard/knowledge"
            className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-md transition-all hover:border-blue-500 dark:hover:border-blue-500"
          >
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-4 mb-4">
              <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Tải lên Tài liệu
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Thêm tài liệu PDF, DOCX, MD hoặc TXT vào kho tri thức
            </p>
          </a>

          <a
            href="/dashboard/chat/new"
            className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm hover:shadow-md transition-all hover:border-red-500 dark:hover:border-red-500"
          >
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4 mb-4">
              <Sparkles className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Bắt đầu Trò chuyện
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Nhận câu trả lời tức thì từ kho tri thức với AI
            </p>
          </a>
        </div>

        {/* Getting Started Guide */}
        <div className="rounded-2xl border border-red-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
            <Search className="mr-3 h-5 w-5 text-red-600 dark:text-red-400" />
            Cách Thức Hoạt động (How It Works)
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-6 p-6 rounded-xl bg-red-50 dark:bg-slate-700/30">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white font-semibold">
                1
              </div>
              <div>
                <h3 className="font-medium text-lg text-slate-900 dark:text-white mb-2">
                  Tạo Kho Tri thức
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Bắt đầu bằng cách tạo một kho tri thức mới để tổ chức thông tin ngân hàng của bạn. 
                  Đặt tên và mô tả giúp xác định mục đích sử dụng.
                </p>
                <a
                  href="/dashboard/knowledge/new"
                  className="mt-4 inline-flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                >
                  Tạo ngay
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 rounded-xl bg-blue-50 dark:bg-slate-700/30">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                2
              </div>
              <div>
                <h3 className="font-medium text-lg text-slate-900 dark:text-white mb-2">
                  Tải lên Tài liệu
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Tải lên các tài liệu PDF, DOCX, MD hoặc TXT vào kho tri thức. 
                  Hệ thống sẽ xử lý và lập chỉ mục để AI có thể tìm kiếm thông tin.
                </p>
                <a
                  href="/dashboard/knowledge"
                  className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Tải lên tài liệu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 rounded-xl bg-red-50 dark:bg-slate-700/30">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white font-semibold">
                3
              </div>
              <div>
                <h3 className="font-medium text-lg text-slate-900 dark:text-white mb-2">
                  Trò chuyện với Kho Tri thức
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Bắt đầu trò chuyện với kho tri thức của bạn. Đặt câu hỏi bằng ngôn ngữ tự nhiên 
                  và nhận câu trả lời chính xác dựa trên tài liệu của bạn.
                </p>
                <a
                  href="/dashboard/chat/new"
                  className="mt-4 inline-flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                >
                  Bắt đầu trò chuyện
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
