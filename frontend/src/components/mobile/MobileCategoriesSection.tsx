import "@/styles/mobile/MobileCategoriesSection.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Category = {
  id: number;
  name: string;
  count: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MobileCategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await axios.get(
          `${API_BASE_URL}/data/categories.json?ts=${Date.now()}`
        );
        setCategories(categories.data || []);
      } catch (error) {
        console.error("カテゴリリストの取得に失敗", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="mobile-categories-section">
      <h3 className="mobile-categories-title">カテゴリ一覧</h3>
      <ul className="mobile-categories-list">
        {Array.isArray(categories) &&
          categories.map(({ id, name, count }) => (
            <li key={id} className="mobile-category-item">
              <Link to={`/category/${name}`}>
                <span className="mobile-category-name">{name}</span>
                <span className="mobile-category-count">{count}</span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
