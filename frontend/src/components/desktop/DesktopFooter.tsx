import "@/styles/desktop/DesktopFooter.css";
import { Link } from "react-router-dom";

export default function DesktopFooter() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h2>ちゃそママ子育て日記</h2>
        </div>

        <div className="footer-nav-wrapper">
          <nav className="footer-nav">
            <Link to="/about#set-point">当ブログについて</Link>
            <Link to="/contact#set-point">お問い合わせ</Link>
            <Link to="/privacy#set-point">プライバシーポリシー</Link>
          </nav>
        </div>
      </div>

      <small className="footer-copy">
        © 2025 My Blog. All rights reserved.
      </small>
    </footer>
  );
}
