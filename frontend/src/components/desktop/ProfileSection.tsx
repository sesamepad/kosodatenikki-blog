import profileImage from "@/assets/profile.jpg";
import "@/styles/desktop/SidebarUnified.css";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ProfileSection() {
  return (
    <section className="sidebar-section profile-section">
      <div className="profile-container">
        <img src={profileImage} alt="ちゃそママ" className="profile-avatar" />
        <h4 className="profile-name">ちゃそママ</h4>
        <p className="profile-role">一児のママ / パート主婦</p>
        <p className="profile-bio">
          子育ての様子、旅行レポなど発信しています！
        </p>

        {/* Instagramリンク */}
        <div className="profile-links">
          <a
            href="https://www.instagram.com/chasomama_blog/" // ← Instagramアカウントに変更
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
        </div>

        {/* 詳細プロフィールへのリンク */}
        <div className="profile-detail-link">
          <Link to="/about#set-point" className="profile-detail-button">
            詳細プロフィールを見る
          </Link>
        </div>
      </div>
    </section>
  );
}
