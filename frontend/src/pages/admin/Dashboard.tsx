import "@/styles/admin/Dashboard.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Counts = {
  drafts: number;
  posts: number;
  categories: number;
  tags: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({
    drafts: 0,
    posts: 0,
    categories: 0,
    tags: 0,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/admin/dashboard-counts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCounts(res.data);
      } catch (err) {
        console.error("件数の取得に失敗しました", err);
      }
    };
    fetchCounts();
  }, [token]);

  return (
    <div className="dashboard-container">
      <h1>管理者ダッシュボード</h1>
      <div className="dashboard-grid">
        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/create-post")}
        >
          <h2>📝 新規作成</h2>
        </div>
        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/edit-drafts")}
        >
          <h2>✏️ 下書き一覧</h2>
          <p>{counts.drafts} 件</p>
        </div>
        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/manage-posts")}
        >
          <h2>📮 投稿管理</h2>
          <p>{counts.posts} 件</p>
        </div>
        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/manage-categories")}
        >
          <h2>📁 カテゴリ管理</h2>
          <p>{counts.categories} 件</p>
        </div>
        <div
          className="dashboard-card"
          onClick={() => navigate("/admin/manage-tags")}
        >
          <h2>🏷️ タグ管理</h2>
          <p>{counts.tags} 件</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate("/")}>
          <h2>🏠 TOPページへ</h2>
        </div>
      </div>
    </div>
  );
}
