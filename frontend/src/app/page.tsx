import Link from "next/link";

export default function Home() {
  return (
    <main 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: "url('/phong_canh_wallpaper.jpg')",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center space-y-8">
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            Chào mừng
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
            Đây là hệ thống hỗ trợ tìm hiểu tài liệu doanh nghiệp
          </p>
        </div>
        
        <div className="flex justify-center">
          <Link
            href="/login"
            className="px-12 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-full text-lg font-medium transition-all duration-300 hover:bg-white/20 hover:border-white/50"
          >
            Đăng nhập / Đăng ký
          </Link>
        </div>
      </div>
    </main>
  );
}
