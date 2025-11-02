import "@/styles/mobile/MobileTagsSection.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Tag = {
  id: number;
  name: string;
  count: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MobileTagsSection() {
  const [tags, setTags] = useState<Tag[]>([]);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await axios.get(
          `${API_BASE_URL}/data/tags.json?ts=${Date.now()}`
        );
        setTags(tags.data || []);
      } catch (error) {
        console.error("カテゴリリストの取得に失敗", error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="mobile-tags-section">
      <h3 className="mobile-tags-title">タグ一覧</h3>
      <ul className="mobile-tags-list">
        {Array.isArray(tags) &&
          tags.map(({ id, name, count }) => (
            <li key={id} className="mobile-tags-item">
              <Link to={`/tags/${name}`}>
                <span className="mobile-tags-name">
                  # {name}({count})
                </span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
