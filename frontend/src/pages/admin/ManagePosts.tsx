import Pagination from "@/components/common/Pagination";
import "@/styles/admin/ManagePosts.css";
import axios from "axios";
import { useEffect, useState } from "react";

type Post = {
  ID: number;
  CATEGORY: string;
  TITLE: string;
  CREATE_DATE: string;
  UPDATE_DATE: string;
  STATUS: boolean;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminPostList() {
  const token = localStorage.getItem("admin_token");
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // 初回読み込み, ページ切替で記事一覧を取得する
  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/admin/posts?page=${currentPage}`,
          {
            params: {
              page: currentPage,
              limit: 20,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data.posts);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("投稿一覧取得失敗", error);
      }
    };
    getPosts();
  }, [currentPage, token]);

  // 公開⇔非公開の切り替え
  const handleTogglePublish = async (id: number, current: boolean) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/posts/${id}`,
        { isPublished: !current },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts((prev) =>
        prev.map((post) =>
          post.ID === id ? { ...post, STATUS: !current } : post
        )
      );
    } catch (error) {
      console.error("公開状態の切り替え失敗", error);
    }
  };

  return (
    <div>
      <h1>投稿管理</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>カテゴリ</th>
            <th>タイトル</th>
            <th>投稿日</th>
            <th>最終更新日</th>
            <th>公開/非公開</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(posts) &&
            posts.map((post) => (
              <tr key={post.ID}>
                <td>{post.ID}</td>
                <td>{post.CATEGORY}</td>
                <td>{post.TITLE}</td>
                <td>{post.CREATE_DATE}</td>
                <td>{post.UPDATE_DATE}</td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={post.STATUS}
                      onChange={() => handleTogglePublish(post.ID, post.STATUS)}
                    />
                    <span className="toggle-slider" />
                  </label>
                  <span style={{ marginLeft: "0.5rem" }}>
                    {post.STATUS ? "公開" : "非公開"}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* ページ切替 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
