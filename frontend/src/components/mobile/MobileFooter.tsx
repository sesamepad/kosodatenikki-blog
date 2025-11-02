import "@/styles/mobile/MobileFooter.css";
import { Link } from "react-router-dom";

export default function MobileFooter() {
  return (
    <footer className="mobile-footer">
      <div className="mobile-footer-logo">
        <h3>ちゃそママ子育て日記</h3>
      </div>

      <nav className="mobile-footer-nav">
        <Link to="/about">当ブログ</Link>
        <Link to="/contact">お問い合わせ</Link>
        <Link to="/privacy">プライバシー</Link>
      </nav>

      <small className="mobile-footer-copy">© 2025 My Blog</small>
    </footer>
  );
}
