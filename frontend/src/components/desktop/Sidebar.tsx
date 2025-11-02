import PopularPostsSection from "@/components/desktop/PopularPostsSection";
import ProfileSection from "@/components/desktop/ProfileSection";
import TagListSection from "@/components/desktop/TagListSection";
import "@/styles/desktop/SidebarUnified.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <PopularPostsSection />
      <TagListSection />
      <ProfileSection />
    </aside>
  );
}
