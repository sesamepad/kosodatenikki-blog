import calendarIcon from "@/assets/calendar.svg";
import folderIcon from "@/assets/folder.svg";
import "@/styles/mobile/MobilePostCard.css";
import type { Post } from "@/types/post";
import { Link } from "react-router-dom";

type Props = {
  post: Post;
};

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MobilePostCard({ post }: Props) {
  const tags: string[] = String(post.TAGS_NAME || "")
    .split(",")
    .filter(Boolean);

  return (
    <article className="mobile-article-card">
      <Link
        to={`/post/${post.CATEGORY_NAME}/${post.ID}`}
        className="mobile-article-card-link"
      >
        <div className="mobile-article-card-image-container">
          <img
            src={`${VITE_API_BASE_URL}/images/${post.ID}/cover.jpg`}
            alt={post.TITLE}
            className="mobile-article-card-image"
          />
        </div>
        <div className="mobile-article-card-content">
          <div className="mobile-article-card-meta">
            <span className="mobile-category-badge">
              <img
                src={folderIcon}
                alt="カテゴリ"
                className="mobile-meta-icon"
              />
              {post.CATEGORY_NAME}
            </span>
            <small className="mobile-post-date">
              <img
                src={calendarIcon}
                alt="calendar"
                className="mobile-meta-icon"
              />
              {post.CREATE_DATE}
            </small>
          </div>
          <h2 className="mobile-post-title">{post.TITLE}</h2>
          <p className="mobile-post-summary">{post.MAIN_TEXT}</p>
          <div className="mobile-tag-list">
            {Array.isArray(tags) &&
              tags.map((tag) => (
                <span key={tag} className="mobile-tag-badge">
                  #{tag}
                </span>
              ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
