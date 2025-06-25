"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumb = () => {
  const pathname = usePathname();

  // Mapping tiếng Anh sang tiếng Việt
  const pathTranslations: { [key: string]: string } = {
    dashboard: "Trang chủ",
    knowledge: "Kho tri thức", 
    chat: "Trò chuyện",
    "api-keys": "API Keys",
    new: "Tạo mới",
    upload: "Tải lên",
    "test-retrieval": "Kiểm tra tìm kiếm"
  };

  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = paths.map((path, index) => {
      const href = "/" + paths.slice(0, index + 1).join("/");
      
      // Sử dụng translation mapping hoặc fallback
      let label = pathTranslations[path] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
      
      const isLast = index === paths.length - 1;

      // Handle dynamic routes with [id]
      const displayLabel = path.match(/^\[.*\]$/) ? "Chi tiết" : label;

      return {
        href,
        label: displayLabel,
        isLast,
      };
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (pathname === "/") return null;

  return (
    <nav className="flex items-center space-x-2 text-base text-muted-foreground mb-6">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50" />
          {breadcrumb.isLast ? (
            <span className="text-foreground font-medium">
              {breadcrumb.label}
            </span>
          ) : (
            <Link
              href={breadcrumb.href}
              className="hover:text-foreground transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
