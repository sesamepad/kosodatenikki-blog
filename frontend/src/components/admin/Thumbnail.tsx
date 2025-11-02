import "@/styles/admin/Thumbnail.css";
import axios from "axios";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

type Props = {
  postId: string | undefined;
};

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("admin_token");

export const PostCoverImage = ({ postId }: Props) => {
  const [imageExists, setImageExists] = useState<boolean | null>(null);
  const [timestamp, setTimestamp] = useState(Date.now());
  const imageUrl = `${VITE_API_BASE_URL}/images/${String(
    postId
  )}/cover.jpg?${timestamp}`;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setImageExists(true);
    };

    img.onerror = () => {
      setImageExists(false);
    };
  }, [imageUrl]);

  // 画像を消す処理
  const handleRemoveImage = async () => {
    try {
      await axios.delete(`${VITE_API_BASE_URL}/api/admin/thumbnail`, {
        params: { id: postId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimestamp(Date.now());
      setImageExists(false);
    } catch (error) {
      console.error("サムネイル画像削除エラー", error);
    }
  };

  // 画像を追加する処理
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("thumbnail", file);
    formData.append("postId", String(postId));

    try {
      await axios.post(`${VITE_API_BASE_URL}/api/admin/thumbnail`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTimestamp(Date.now());
      setImageExists(true);
    } catch (error) {
      console.error("サムネイル画像アップロードエラー", error);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (imageExists === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {imageExists ? (
        <div className="thumbnail">
          <img src={imageUrl} alt="Post Cover" className="thumbnail-img" />
          <button
            onClick={handleRemoveImage}
            className="thumbnail-delete-button"
            title="画像を削除する"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="thumbnail-not-exists"
        >
          ＋
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
        </div>
      )}
    </>
  );
};
