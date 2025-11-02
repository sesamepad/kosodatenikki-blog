import banner from "@/assets/banner.png";
import Pagination from "@/components/common/Pagination";
import SEO from "@/components/common/SEO";
import MobileCategoriesSection from "@/components/mobile/MobileCategoriesSection";
import MobilePostCard from "@/components/mobile/MobilePostCard";
import MobileProfileSection from "@/components/mobile/MobileProfileSection";
import MobileTagsSection from "@/components/mobile/MobileTagsSection";
import "@/styles/mobile/MobileHomePage.css";
import type { Post } from "@/types/post";
import { useEffect, useState } from "react";

export default function MobileHomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetch(`/api/posts?page=${page}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("データの取得に失敗しました");
        }
        return res.json();
      })
      .then((data) => {
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => {
        console.error(err);
        setError("記事の読み込み中にエラーが発生しました。");
      });
  }, [page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <>
      <SEO
        title={"記事一覧"}
        description={"子育てや趣味や旅行に関する記事をブログにしています。"}
        url={""}
        image={banner}
      />
      <div className="mobile-main-page">
        <h3>記事一覧</h3>
        {error && <p className="error">{error}</p>}
        {posts.length === 0 && !error && <p>読み込み中...</p>}
        {Array.isArray(posts) &&
          posts.map((post) => <MobilePostCard key={post.ID} post={post} />)}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        <MobileProfileSection />
        <MobileCategoriesSection />
        <MobileTagsSection />
      </div>
    </>
  );
}
