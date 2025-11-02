import { AuthProvider } from "@/auth/AuthProvider";
import CookieConsent from "@/components/common/CookieConsent";
import AdminRoutes from "@/routes/AdminRoutes";
import PublicRoutes from "@/routes/PublicRoutes";
import { Route, Routes } from "react-router-dom";

export default function AppRouter() {
  return (
    <AuthProvider>
      {/* CMP + AdSense 同意管理 */}
      <CookieConsent />

      <Routes>
        {/* 管理画面ルート */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        {/* 一般ユーザー向けルート */}
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </AuthProvider>
  );
}
