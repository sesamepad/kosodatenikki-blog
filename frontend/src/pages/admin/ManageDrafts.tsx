import "@/styles/admin/ManageCategories.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Draft = {
  ID: string;
  TITLE: string;
  UPDATE_DATE: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ManageDrafts() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/drafts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDrafts(res.data);
      } catch (err) {
        console.error("下書きの取得に失敗しました", err);
      }
    };
    fetchDrafts();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("本当に削除しますか？")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/drafts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrafts(drafts.filter((draft) => draft.ID !== id));
    } catch (err) {
      console.error("削除失敗", err);
      alert("削除に失敗しました");
    }
  };

  return (
    <div className="category-container">
      <h1>下書き一覧</h1>
      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>タイトル</th>
            <th>最終更新日</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(drafts) &&
            drafts.map((draft) => (
              <tr key={draft.ID}>
                <td>{draft.ID}</td>
                <td>{draft.TITLE}</td>
                <td>{draft.UPDATE_DATE}</td>
                <td className="actions">
                  <button
                    className="save-button"
                    onClick={() => navigate(`/admin/edit-post/${draft.ID}`)}
                  >
                    編集
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(draft.ID)}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          {drafts.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                下書きが存在しません。
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
