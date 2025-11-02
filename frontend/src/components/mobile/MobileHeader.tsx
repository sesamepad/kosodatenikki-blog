import banner from "@/assets/banner.png";
import "@/styles/mobile/MobileHeader.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type Category = {
  id: number;
  name: string;
  count: number;
};

type Tag = {
  id: number;
  name: string;
  count: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MobileHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [showCategories, setShowCategories] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchCateTag = async () => {
      try {
        const categories = await axios.get(
          `${API_BASE_URL}/data/categories.json?ts=${Date.now()}`
        );
        const tags = await axios.get(
          `${API_BASE_URL}/data/tags.json?ts=${Date.now()}`
        );
        setCategories(categories.data || []);
        setTags(tags.data || []);
      } catch (error) {
        console.error("カテゴリ/タグの取得に失敗", error);
      }
    };

    fetchCateTag();
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <>
      {sidebarOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            ref={sidebarRef}
            className={`mobile-sidebar ${sidebarOpen ? "open" : ""}`}
            onClick={(e) => e.stopPropagation()} // サイドバー内クリックは閉じない
            aria-hidden={!sidebarOpen}
          >
            <button
              className="close-button"
              onClick={() => {
                setSidebarOpen(false);
                hamburgerRef.current?.focus();
              }}
              aria-label="メニューを閉じる"
            >
              ✕
            </button>

            <ul className="menu-list">
              <li>
                <a
                  href="/"
                  onClick={() => {
                    setSidebarOpen(false);
                    hamburgerRef.current?.focus();
                  }}
                >
                  トップページ
                </a>
              </li>

              <li>
                <button
                  className="accordion-btn"
                  onClick={() => setShowCategories((prev) => !prev)}
                  aria-expanded={showCategories}
                >
                  カテゴリ一覧
                </button>
                {showCategories && (
                  <ul className="submenu">
                    {Array.isArray(categories) &&
                      categories.map(({ id, name, count }) => (
                        <li key={id}>
                          <Link
                            to={`/category/${name}`}
                            onClick={() => {
                              setSidebarOpen(false);
                              hamburgerRef.current?.focus();
                            }}
                          >
                            <span>{name}</span>
                            <span className="item-count">{count}</span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                )}
              </li>

              <li>
                <button
                  className="accordion-btn"
                  onClick={() => setShowTags((prev) => !prev)}
                  aria-expanded={showTags}
                >
                  タグ一覧
                </button>
                {showTags && (
                  <ul className="submenu">
                    {Array.isArray(tags) &&
                      tags.map(({ id, name, count }) => (
                        <li key={id}>
                          <Link
                            to={`/tags/${name}`}
                            onClick={() => {
                              setSidebarOpen(false);
                              hamburgerRef.current?.focus();
                            }}
                          >
                            <span>{name}</span>
                            <span className="item-count">{count}</span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                )}
              </li>

              <li>
                <Link
                  to="/contact"
                  onClick={() => {
                    setSidebarOpen(false);
                    hamburgerRef.current?.focus();
                  }}
                >
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      <header className="mobile-header">
        <a href="/">
          <img
            src={banner}
            alt="トップページバナー"
            className="mobile-header-banner"
          />
        </a>

        <button
          ref={hamburgerRef}
          className="hamburger-button"
          onClick={() => {
            setSidebarOpen(true);
            hamburgerRef.current?.focus();
          }}
          aria-label="メニュー開閉"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </header>
    </>
  );
}
