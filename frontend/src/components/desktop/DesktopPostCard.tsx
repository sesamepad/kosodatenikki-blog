import calendarIcon from "@/assets/calendar.svg";
import folderIcon from "@/assets/folder.svg"; // ← カテゴリアイコンを追加
import "@/styles/desktop/DesktopPostCard.css";
import type { Post } from "@/types/post";
import { Link } from "react-router-dom";

type Props = {
  post: Post;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DesktopPostCard({ post }: Props) {
  const tags: string[] = String(post.TAGS_NAME || "")
    .split(",")
    .filter(Boolean);

  return (
    <article className="post-card">
      <Link
        to={`/post/${post.CATEGORY_NAME}/${post.ID}`}
        className="post-card-image-link"
      >
        <div className="post-card-wrapper">
          <div className="post-card-image-container">
            <img
              src={`${API_BASE_URL}/images/${post.ID}/cover.jpg`}
              alt={post.TITLE}
              className="post-card-image"
            />
          </div>
          <div className="post-card-content">
            <div className="post-card-meta">
              <span className="category-badge">
                <img src={folderIcon} alt="カテゴリ" className="meta-icon" />
                {post.CATEGORY_NAME}
              </span>
            </div>
            <h2 className="post-title">{post.TITLE}</h2>
            <p className="post-main-text">{post.MAIN_TEXT}</p>

            <div className="post-card-footer">
              <div className="desktop-tag-list">
                {Array.isArray(tags) &&
                  tags.map((tag) => (
                    <span key={tag} className="tag-badge">
                      #{tag}
                    </span>
                  ))}
              </div>

              <div className="post-date-container">
                <img
                  src={calendarIcon}
                  alt="calendar"
                  className="calendar-icon"
                />
                <small className="post-date">{post.CREATE_DATE}</small>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
