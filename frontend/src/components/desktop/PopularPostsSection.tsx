import "@/styles/desktop/SidebarUnified.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type PopularPost = {
  rank: number;
  id: string;
  title: string;
  category_name: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PopularPostsSection() {
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([]);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/data/popular_posts.json?ts=${Date.now()}`
        );
        setPopularPosts(response.data[period] || []);
      } catch (error) {
        console.error("人気記事の取得に失敗", error);
      }
    };
    fetchPopularPosts();
  }, [period]);

  return (
    <div className="popular-posts sidebar-section">
      <h3>人気記事</h3>
      <div className="tab-buttons">
        {["daily", "weekly", "monthly"].map((p) => (
          <button
            key={p}
            role="tab"
            aria-selected={period === p}
            aria-controls={`tabpanel-${p}`}
            className={`tab-button ${period === p ? "active" : ""}`}
            onClick={() => setPeriod(p as "daily" | "weekly" | "monthly")}
          >
            {p === "daily" ? "今日" : p === "weekly" ? "今週" : "今月"}
          </button>
        ))}
      </div>
      <ul className="popular-posts-list">
        {Array.isArray(popularPosts) &&
          popularPosts.map((post) => (
            <li key={post.id}>
              <Link
                to={`/post/${post.category_name}/${post.id}`}
                className="popular-post-link"
              >
                <span className="rank">{post.rank}.</span>
                <img
                  src={`${API_BASE_URL}/images/${post.id}/cover.jpg`}
                  alt={post.title}
                  className="popular-post-cover"
                />
                <span className="popular-post-title">{post.title}</span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
