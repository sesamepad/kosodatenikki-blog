import { useIsMobile } from "@/hooks/useIsMobile";
import DesktopLayout from "@/layouts/DesktopLayout";
import MobileLayout from "@/layouts/MobileLayout";
import AboutPage from "@/pages/common/AboutPage";
import ContactPage from "@/pages/common/ContactPage";
import NotFoundPage from "@/pages/common/NotFoundPage";
import PostDetailPage from "@/pages/common/PostDetailPage";
import PrivacyPage from "@/pages/common/PrivacyPage";
import DesktopCategoryPostsPage from "@/pages/desktop/DesktopCategoryPostsPage";
import DesktopHomePage from "@/pages/desktop/DesktopHomePage";
import DesktopTagPostsPage from "@/pages/desktop/DesktopTagPostsPage";
import MobileCategoryPostsPage from "@/pages/mobile/MobileCategoryPostsPage";
import MobileHomePage from "@/pages/mobile/MobileHomePage";
import MobileTagPostsPage from "@/pages/mobile/MobileTagPostsPage";
import { Route, Routes } from "react-router-dom";

export default function PublicRoutes() {
  const isMobile = useIsMobile();

  const Layout = isMobile ? MobileLayout : DesktopLayout;

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={isMobile ? <MobileHomePage /> : <DesktopHomePage />}
        />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/post/:category_name/:id" element={<PostDetailPage />} />
        <Route
          path="/tags/:tagName"
          element={isMobile ? <MobileTagPostsPage /> : <DesktopTagPostsPage />}
        />
        <Route
          path="/category/:categoryName"
          element={
            isMobile ? (
              <MobileCategoryPostsPage />
            ) : (
              <DesktopCategoryPostsPage />
            )
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
