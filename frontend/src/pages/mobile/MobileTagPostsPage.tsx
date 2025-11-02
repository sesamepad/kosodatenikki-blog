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
import { useParams } from "react-router-dom";

export default function MobileTagPostsPage() {
  const { tagName } = useParams<{ tagName: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!tagName) return;

    const fetchPosts = async () => {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });

        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/posts?tag=${encodeURIComponent(tagName)}&page=${page}`,
          {
            headers: { "Cache-Control": "no-cache" },
          }
        );

        if (!response.ok) {
          throw new Error("投稿取得失敗");
        }

        const data = await response.json();
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("予期せぬエラーが発生しました");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    const targetElement = document.getElementById("set-point");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  }, [tagName, page]);

  return (
    <>
      <SEO
        title={`${tagName}の記事一覧`}
        description={`${tagName}の記事一覧、子育てや趣味や旅行に関する記事をブログにしています。`}
        url={""}
        image={banner}
      />

      <div className="mobile-main-page" id="set-point">
        <h3>タグ: {tagName} の記事一覧</h3>
        {loading && <p>記事を検索しています...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p>記事が見つかりませんでした。</p>
        )}
        {!loading && !error && posts.length > 0 && (
          <div>
            {Array.isArray(posts) &&
              posts.map((post) => <MobilePostCard key={post.ID} post={post} />)}
          </div>
        )}

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
