import "@/styles/admin/Images.css";
import axios from "axios";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  postId: string | undefined;
};

type ImageItem = {
  name: string;
  url: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("admin_token");

export const PostImageGallery = ({ postId }: Props) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 画像一覧取得処理
  const fetchImages = useCallback(async () => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/images`, {
        params: { postId }, // 依存に入れる対象
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      const imageList = Array.isArray(res.data) ? res.data : [];
      setImages(imageList);
    } catch (error) {
      console.error("画像一覧取得エラー", error);
      setImages([]);
    }
  }, [postId]);

  // 画像一覧取得
  useEffect(() => {
    if (!token) return;
    fetchImages();
  }, [fetchImages]);

  // 画像追加
  const handleAddImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("postId", String(postId));

    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    try {
      await axios.post(`${API_BASE_URL}/api/admin/images`, formData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // 一覧を再取得
      await fetchImages();
    } catch (error) {
      console.error("画像アップロードエラー", error);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 画像削除
  const handleRemoveImage = async (name: string) => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/images`, {
        params: { postId, name },
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      // 一覧を再取得
      await fetchImages();
    } catch (error) {
      console.error("画像削除エラー", error);
    }
  };

  return (
    <div className="images-group">
      {Array.isArray(images) &&
        images.map((img, idx) => (
          <div key={idx} className="images">
            <img
              src={`${API_BASE_URL}/${img.url}?${Date.now()}`}
              alt={img.name}
              className="image-thumbnail"
            />
            <p className="image-name">{img.name}</p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleRemoveImage(img.name);
              }}
              className="image-delete-button"
              title="削除"
            >
              ×
            </button>
          </div>
        ))}

      {/* +1 画像追加パネル */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="image-add-button"
      >
        ＋
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleAddImage}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};
