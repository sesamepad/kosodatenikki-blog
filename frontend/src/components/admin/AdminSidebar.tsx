import "@/styles/admin/AdminSidebar.css";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("ログアウトしますか？");
    if (!confirmLogout) return;

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) {
      navigate("/admin/login");
      return;
    }

    try {
      // 現在のトークンをブラックリストに登録
      await axios.post(
        `${API_BASE_URL}/api/admin/logout`,
        {}, // ボディは空
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      // LocalStorageのJWT削除
      localStorage.removeItem("admin_token");

      // Cookieも削除
      document.cookie = "some_cookie=; Max-Age=0; path=/;";
    } catch (error) {
      console.log("ログアウトエラー", error);
      return;
    }

    // ログインページへ遷移
    navigate("/admin/login");
  };

  return (
    <div className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="admin-hamburger" onClick={toggleSidebar}>
        ☰
      </button>

      <nav className="admin-nav">
        {/* 管理主要 */}
        <div className="nav-section">
          <div className="nav-section-title">管理</div>
          <Link to="/admin/dashboard">
            🏠 <span className="admin-label">ダッシュボード</span>
          </Link>
        </div>

        {/* 記事関連 */}
        <div className="nav-section">
          <div className="nav-section-title">記事管理</div>
          <Link to="/admin/create-post">
            📃 <span className="admin-label">新規作成</span>
          </Link>
          <Link to="/admin/edit-drafts">
            ✏️ <span className="admin-label">下書き一覧</span>
          </Link>
          <Link to="/admin/manage-posts">
            📮 <span className="admin-label">投稿管理</span>
          </Link>
        </div>

        {/* 分類管理 */}
        <div className="nav-section">
          <div className="nav-section-title">分類管理</div>
          <Link to="/admin/manage-categories">
            📁 <span className="admin-label">カテゴリ管理</span>
          </Link>
          <Link to="/admin/manage-tags">
            🏷️ <span className="admin-label">タグ管理</span>
          </Link>
        </div>

        {/* 外部リンク */}
        <div className="nav-section">
          <div className="nav-section-title">外部リンク</div>
          <a
            href="https://www.onamae.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            お名前.com
          </a>
          <a
            href="https://www.cloudflare.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cloudflare
          </a>
        </div>
        <div className="nav-section">
          <div className="nav-section-title">システム</div>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault(); // デフォルト遷移を止める
              handleLogout();
            }}
            className="admin-label"
          >
            ログアウト
          </Link>
        </div>
      </nav>
    </div>
  );
}
