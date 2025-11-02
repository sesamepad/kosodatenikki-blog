import "@/styles/admin/ManageCategories.css";
import axios from "axios";
import { useEffect, useState } from "react";

type Category = {
  ID: number;
  NAME: string;
  NAME_EN: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [newNameEn, setNewNameEn] = useState("");

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(res.data);
      } catch (err) {
        console.error("カテゴリの取得に失敗しました", err);
      }
    };
    fetchCategories();
  }, [token]);

  const handleInputChange = (
    id: number,
    field: "NAME" | "NAME_EN",
    value: string
  ) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.ID === id ? { ...cat, [field]: value } : cat))
    );
  };

  const handleSave = async (id: number) => {
    const target = categories.find((cat) => cat.ID === id);
    if (!target) return;

    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/categories/${id}`,
        {
          name: target.NAME,
          name_en: target.NAME_EN,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("保存しました");
    } catch (error) {
      console.error("カテゴリ保存失敗", error);
      alert("保存に失敗しました");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("削除してもよろしいですか？")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories((prev) => prev.filter((cat) => cat.ID !== id));
      alert("削除しました");
    } catch (error) {
      console.error("カテゴリ削除失敗", error);
      alert("削除に失敗しました");
    }
  };

  const handleAddCategory = async () => {
    if (!newName.trim() || !newNameEn.trim()) {
      alert("日本語名と英語名は両方とも必須です");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/admin/categories`,
        {
          name: newName,
          name_en: newNameEn,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("カテゴリを追加しました");
      setNewName("");
      setNewNameEn("");
      const res = await axios.get(`${API_BASE_URL}/api/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.error("カテゴリ追加失敗", error);
      alert("カテゴリ追加に失敗しました");
    }
  };

  return (
    <div className="category-container">
      <h1>📁 カテゴリ管理</h1>

      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>日本語名</th>
            <th>英語名</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>新規</td>
            <td>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="日本語名"
              />
            </td>
            <td>
              <input
                type="text"
                value={newNameEn}
                onChange={(e) => setNewNameEn(e.target.value)}
                placeholder="英語名"
              />
            </td>
            <td className="actions">
              <button className="add-button" onClick={handleAddCategory}>
                追加
              </button>
            </td>
          </tr>

          {Array.isArray(categories) &&
            categories.map((cat) => (
              <tr key={cat.ID}>
                <td>{cat.ID}</td>
                <td>
                  <input
                    type="text"
                    value={cat.NAME}
                    onChange={(e) =>
                      handleInputChange(cat.ID, "NAME", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={cat.NAME_EN}
                    onChange={(e) =>
                      handleInputChange(cat.ID, "NAME_EN", e.target.value)
                    }
                  />
                </td>
                <td className="actions">
                  <button
                    className="save-button"
                    onClick={() => handleSave(cat.ID)}
                  >
                    保存
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(cat.ID)}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
