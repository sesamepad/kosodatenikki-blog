import "@/styles/admin/ManageCategories.css";
import axios from "axios";
import { useEffect, useState } from "react";

type Tags = {
  ID: number;
  NAME: string;
  NAME_EN: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ManageTags() {
  const [tags, setTags] = useState<Tags[]>([]);
  const [newName, setNewName] = useState("");
  const [newNameEn, setNewNameEn] = useState("");

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/tags`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTags(res.data);
      } catch (err) {
        console.error("タグの取得に失敗しました", err);
      }
    };
    fetchTags();
  }, [token]);

  const handleInputChange = (
    id: number,
    field: "NAME" | "NAME_EN",
    value: string
  ) => {
    setTags((prev) =>
      prev.map((tag) => (tag.ID === id ? { ...tag, [field]: value } : tag))
    );
  };

  const handleSave = async (id: number) => {
    const target = tags.find((tag) => tag.ID === id);
    if (!target) return;

    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/tags/${id}`,
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
      console.error("タグ保存エラー", error);
      alert("保存に失敗しました");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("削除してもよろしいですか？")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/tags/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTags((prev) => prev.filter((tag) => tag.ID !== id));
      alert("削除しました");
    } catch (error) {
      console.error("タグ削除エラー", error);
      alert("削除に失敗しました");
    }
  };

  const handleAdd = async () => {
    if (!newName.trim() || !newNameEn.trim()) {
      alert("日本語名と英語名は両方とも必須です");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/admin/tags`,
        {
          name: newName,
          name_en: newNameEn,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("タグを追加しました");
      setNewName("");
      setNewNameEn("");
      const res = await axios.get(`${API_BASE_URL}/api/admin/tags`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTags(res.data);
    } catch (error) {
      console.error("タグ追加エラー", error);
      alert("タグ追加に失敗しました");
    }
  };

  return (
    <div className="category-container">
      <h1>🏷️ タグ管理</h1>

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
              <button className="add-button" onClick={handleAdd}>
                追加
              </button>
            </td>
          </tr>
          {Array.isArray(tags) &&
            tags.map((tag) => (
              <tr key={tag.ID}>
                <td>{tag.ID}</td>
                <td>
                  <input
                    type="text"
                    value={tag.NAME}
                    onChange={(e) =>
                      handleInputChange(tag.ID, "NAME", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={tag.NAME_EN}
                    onChange={(e) =>
                      handleInputChange(tag.ID, "NAME_EN", e.target.value)
                    }
                  />
                </td>
                <td className="actions">
                  <button
                    className="save-button"
                    onClick={() => handleSave(tag.ID)}
                  >
                    保存
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(tag.ID)}
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
