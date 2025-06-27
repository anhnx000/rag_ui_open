"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationErrors((prev) => ({
        ...prev,
        email: "Vui lòng nhập địa chỉ email hợp lệ",
      }));
      return false;
    }
    setValidationErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setValidationErrors((prev) => ({
        ...prev,
        password: "Mật khẩu phải có ít nhất 8 ký tự",
      }));
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setValidationErrors((prev) => ({
        ...prev,
        password: "Mật khẩu phải chứa ít nhất một chữ hoa",
      }));
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setValidationErrors((prev) => ({
        ...prev,
        password: "Mật khẩu phải chứa ít nhất một chữ thường",
      }));
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setValidationErrors((prev) => ({
        ...prev,
        password: "Mật khẩu phải chứa ít nhất một chữ số",
      }));
      return false;
    }
    setValidationErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setValidationErrors({ email: "", password: "", confirmPassword: "" });

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate email and password
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (password !== confirmPassword) {
      setValidationErrors((prev) => ({
        ...prev,
        confirmPassword: "Mật khẩu xác nhận không khớp",
      }));
      return;
    }

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      await api.post("/api/auth/register", {
        username,
        email,
        password,
      });

      router.push("/login");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Đăng ký thất bại");
      }
    }
  };

  return (
    <main 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('/phong_canh_wallpaper.jpg')",
      }}
    >
      {/* Overlay for better form readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 space-y-6 border border-white/20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Đăng ký tài khoản
            </h1>
            <p className="text-sm text-gray-600">
              Hệ thống hỗ trợ tìm hiểu tài liệu doanh nghiệp
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tên đăng nhập
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-200"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Địa chỉ email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`block w-full px-4 py-3 rounded-lg border ${
                    validationErrors.email
                      ? "border-red-300 bg-red-50/90"
                      : "border-gray-300 bg-white/90"
                  } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200`}
                  placeholder="Nhập địa chỉ email"
                  onChange={(e) => validateEmail(e.target.value)}
                />
                {validationErrors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`block w-full px-4 py-3 rounded-lg border ${
                    validationErrors.password
                      ? "border-red-300 bg-red-50/90"
                      : "border-gray-300 bg-white/90"
                  } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200`}
                  placeholder="Tạo mật khẩu"
                  onChange={(e) => validatePassword(e.target.value)}
                />
                {validationErrors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className={`block w-full px-4 py-3 rounded-lg border ${
                    validationErrors.confirmPassword
                      ? "border-red-300 bg-red-50/90"
                      : "border-gray-300 bg-white/90"
                  } shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm transition-all duration-200`}
                  placeholder="Nhập lại mật khẩu"
                />
                {validationErrors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Tạo tài khoản
            </button>
          </form>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Đã có tài khoản? Đăng nhập ngay
            </Link>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              ← Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
