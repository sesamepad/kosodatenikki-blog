import profileImage from "@/assets/profile.jpg";
import "@/styles/mobile/MobileProfileSection.css";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function MobileProfileSection() {
  return (
    <div className="mobile-profile-section">
      <h3>プロフィール</h3>
      <img
        src={profileImage}
        alt="ちゃそママ"
        className="mobile-profile-avatar"
      />
      <h4 className="mobile-profile-name">ちゃそママ</h4>
      <p className="mobile-profile-role">一児のママ / パート主婦</p>
      <p className="mobile-profile-bio">
        子育ての様子、旅行レポなど発信しています！
      </p>

      {/* Instagramリンク */}
      <div className="mobile-profile-links">
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
      <div className="mobile-profile-detail-link">
        <Link to="/about#set-point" className="mobile-profile-detail-button">
          詳細プロフィールを見る
        </Link>
      </div>
    </div>
  );
}
