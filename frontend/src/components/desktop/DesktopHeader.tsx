import banner from "@/assets/banner.png";
import cooking from "@/assets/cooking.png";
import diary from "@/assets/diary.png";
import hobby from "@/assets/hobby.png";
import other from "@/assets/other.png";
import travel from "@/assets/travel.png";
import "@/styles/desktop/DesktopHeader.css";
import { Link } from "react-router-dom";

export default function DesktopHeader() {
  return (
    <header className="header no-select">
      <a href="/">
        <img src={banner} alt="トップページバナー" className="header-banner" />
      </a>
      <div className="content-categories">
        <Link to="/category/日記" className="category-card">
          <img src={diary} alt="日記" />
          <p>日記</p>
        </Link>
        <Link to="/category/旅行" className="category-card">
          <img src={travel} alt="旅行" />
          <p>旅行</p>
        </Link>
        <Link to="/category/料理" className="category-card">
          <img src={cooking} alt="料理" />
          <p>料理</p>
        </Link>
        <Link to="/category/趣味" className="category-card">
          <img src={hobby} alt="趣味" />
          <p>趣味</p>
        </Link>
        <Link to="/category/その他" className="category-card">
          <img src={other} alt="その他" />
          <p>その他</p>
        </Link>
      </div>
    </header>
  );
}
