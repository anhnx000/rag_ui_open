"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface KnowledgeBase {
  id: number;
  name: string;
  description: string;
  documents: any[];
  created_at: string;
}

export default function NewKnowledgeBasePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;

      const data = await api.post("http://109.237.64.130:8000/api/knowledge-base", {
        name,
        description,
      });

      router.push(`/dashboard/knowledge/${data.id}`);
    } catch (error) {
      console.error("Failed to create knowledge base:", error);
      if (error instanceof ApiError) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setError("Failed to create knowledge base");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
            Tạo Kho Tri thức (Create Knowledge Base)
          </h2>
          <p className="text-muted-foreground">
            Tạo kho tri thức mới để lưu trữ các tài liệu ngân hàng của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tên Kho Tri thức
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Nhập tên kho tri thức (ví dụ: Quy trình Ngân hàng)"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Mô tả mục đích và nội dung của kho tri thức này"
            />
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 h-10 px-4 py-2 shadow-lg shadow-red-600/20"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo Kho Tri thức"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
