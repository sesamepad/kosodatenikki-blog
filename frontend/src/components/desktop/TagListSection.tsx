import "@/styles/desktop/SidebarUnified.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Tag = {
  id: number;
  name: string;
  count: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TagListSection() {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/data/tags.json?ts=${Date.now()}`
        );
        setTags(response.data || []);
      } catch (error) {
        console.error("タグリストの取得に失敗", error);
      }
    };
    fetchTags();
  }, []);

  return (
    <section className="sidebar-section">
      <h3>タグ一覧</h3>
      <ul className="tag-list">
        {Array.isArray(tags) &&
          tags.map(({ id, name, count }) => (
            <li key={id}>
              <Link
                to={`/tags/${encodeURIComponent(name)}`}
                className="tag-link"
              >
                # {name} ({count})
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
}
