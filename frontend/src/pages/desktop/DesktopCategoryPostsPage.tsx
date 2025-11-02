import banner from "@/assets/banner.png";
import Pagination from "@/components/common/Pagination";
import SEO from "@/components/common/SEO";
import DesktopPostCard from "@/components/desktop/DesktopPostCard";
import "@/styles/desktop/DesktopHomePage.css";
import type { Post } from "@/types/post";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DesktopCategoryPostsPage() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!categoryName) return;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/posts?category=${encodeURIComponent(
            categoryName
          )}&page=${page}`,
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
  }, [categoryName, page]);

  return (
    <>
      <SEO
        title={`${categoryName}の記事一覧`}
        description={`${categoryName}の記事一覧、子育てや趣味や旅行に関する記事をブログにしています。`}
        url={""}
        image={banner}
      />

      <div id="set-point">
        <h2>カテゴリ: {categoryName} の記事一覧</h2>
        {loading && <p>記事を検索しています...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p>記事が見つかりませんでした。</p>
        )}
        {!loading && !error && posts.length > 0 && (
          <div className="posts-container">
            {Array.isArray(posts) &&
              posts.map((post) => (
                <DesktopPostCard key={post.ID} post={post} />
              ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
