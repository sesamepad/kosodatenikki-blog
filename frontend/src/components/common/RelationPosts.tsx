import { useIsMobile } from "@/hooks/useIsMobile";
import "@/styles/common/RelationPosts.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type RelationPost = {
  id: string;
  title: string;
  main_text: string;
  category_name: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RelationPosts({ id }: { id: string }) {
  const [relationPosts, setRelationPosts] = useState<RelationPost[]>([]);
  const isMobile = useIsMobile();
  const className = isMobile ? "mobile-relation" : "desktop-relation";

  useEffect(() => {
    const fetchRelationPosts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/relation-posts?id=${id}`
        );
        setRelationPosts(response.data);
      } catch (error) {
        console.error("関連記事の取得に失敗しました:", error);
      }
    };

    if (id) fetchRelationPosts();
  }, [id]);

  return (
    <div className="relation-group">
      <h3>関連記事</h3>
      <div className={`relation-wrapper ${className}`}>
        {Array.isArray(relationPosts) &&
          relationPosts.map(({ id, title, main_text, category_name }) => (
            <article key={id} className="relation-article">
              <Link to={`/post/${category_name}/${id}`}>
                <img
                  src={`${API_BASE_URL}/images/${id}/cover.jpg`}
                  alt={title}
                />
                <h4>{title}</h4>
                <p>{main_text}</p>
              </Link>
            </article>
          ))}
      </div>
    </div>
  );
}
