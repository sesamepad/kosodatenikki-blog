import { PostImageGallery } from "@/components/admin/Images";
import { PostCoverImage } from "@/components/admin/Thumbnail";
import "@/styles/admin/EditPost.css";
import "@/styles/common/MarkdownBody.css";
import type { CodeProps } from "@/types/react-markdown";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import remarkGfm from "remark-gfm";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

type Category = {
  ID: number;
  NAME: string;
};

type Tag = {
  ID: number;
  NAME: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreatePost() {
  const [id, setId] = useState<number | null>(null);
  const navigate = useNavigate();

  // フォーム状態
  const [title, setTitle] = useState("");
  const [categoryID, setCategoryID] = useState<number | null>(null);
  const [tags, setTags] = useState<number[]>([]);
  const [markdown, setMarkdown] = useState("");

  // カテゴリ・タグ一覧
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    // 初回のみIDを確定させるためにAPIを投げる
    const getId = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/admin/create-post`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setId(response.data.id);
      } catch (error) {
        console.error("ID取得エラー", error);
      }
    };

    // カテゴリ・タグ一覧をまとめて取得（API）
    const fetchMeta = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/admin/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/api/admin/tags`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCategories(catRes.data);
        setAllTags(tagRes.data);
      } catch (error) {
        console.error("カテゴリ・タグ取得エラー", error);
      }
    };

    getId();
    fetchMeta();
  }, [token]);

  const tagOptions = (allTags || []).map((tag) => ({
    value: tag.ID,
    label: tag.NAME,
  }));

  const handlePost = async (
    event: React.MouseEvent<HTMLButtonElement>,
    process_type: string,
    id: number | null,
    title: string,
    main_text: string,
    tags: number[],
    category: number | null
  ) => {
    event.preventDefault();
    const process = process_type === "publish" ? "投稿" : "下書き保存";
    if (!window.confirm(`${process}を行いますか？`)) {
      alert("処理を中断しました");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/post`,
        {
          process_type,
          id,
          title,
          main_text,
          category,
          tags,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && response.data?.success) {
        alert(`${process}が完了しました`);
        navigate("/admin/edit-drafts");
      } else {
        alert(`${process}が失敗しました`);
      }
    } catch (error) {
      console.error("記事投稿エラー", error);
      alert("サーバエラーが発生しました");
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm("記事の削除を行いますか？")) {
      alert("処理を中断しました");
      return;
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/admin/post/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 && response.data?.success) {
        alert("削除が完了しました");
        navigate("/admin/edit-drafts");
      } else {
        alert("削除が失敗しました");
      }
    } catch (error) {
      console.error("記事削除エラー", error);
      alert("サーバエラーが発生しました");
    }
  };

  return (
    <div className="editpost-container">
      <h1>新規作成</h1>

      {/* レイアウトをEditPostForm.tsx風に */}
      <form className="editpost-form">
        {/* タイトル */}
        <div className="form-group half-width">
          <label htmlFor="title">タイトル</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タイトルを入力"
          />
        </div>

        {/* カテゴリ */}
        <div className="form-group half-width">
          <label htmlFor="category">カテゴリ</label>
          <select
            id="category"
            value={categoryID ?? ""}
            onChange={(e) => setCategoryID(Number(e.target.value))}
          >
            <option value="">選択してください</option>
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <option key={cat.ID} value={cat.ID}>
                  {cat.NAME}
                </option>
              ))}
          </select>
        </div>

        {/* タグ */}
        <div className="form-group half-width">
          <label htmlFor="tags">タグ</label>
          <Select
            id="tags"
            isMulti
            options={tagOptions || []}
            value={
              tagOptions.filter((option) => tags?.includes(option.value)) || []
            }
            onChange={(selectedOptions) => {
              const selectedIds =
                selectedOptions?.map((option) => option.value) || [];
              setTags(selectedIds);
            }}
            className="tag-select"
            classNamePrefix="react-select"
          />
        </div>

        {/* 本文とプレビューの2カラム */}
        <div className="markdown-area">
          <div className="markdown-input">
            <label htmlFor="markdown">本文 (Markdown)</label>
            <textarea
              id="markdown"
              rows={20}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Markdown本文を入力してください"
            />
          </div>
          <div className="markdown-preview">
            <label>本文 (プレビュー)</label>
            <div className="preview-content markdown-body">
              {id !== null && (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...props }: CodeProps) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          className="code-block"
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    img({ src = "", alt }) {
                      const isImageFile = /^[^/]+\.(jpe?g|png)$/i.test(src);
                      const newSrc = isImageFile
                        ? `${API_BASE_URL}/images/${id}/${src}`
                        : src;
                      return <img src={newSrc} alt={alt} />;
                    },
                  }}
                >
                  {markdown || "ここにプレビューが表示されます"}
                </ReactMarkdown>
              )}
            </div>
          </div>
        </div>

        {id !== null && (
          <div className="form-group">
            <label htmlFor="thumbnail">サムネイル</label>
            <PostCoverImage postId={String(id)} />
          </div>
        )}

        {id !== null && (
          <div className="form-group">
            <label htmlFor="imgs">挿入画像</label>
            <PostImageGallery postId={String(id)} />
          </div>
        )}

        {/* 投稿ボタン、一時保存ボタン、削除ボタン */}
        <div className="post-button-group">
          <button
            className="button-group-post"
            onClick={(e) =>
              handlePost(
                e,
                "publish",
                id,
                title,
                String(markdown),
                tags,
                categoryID
              )
            }
          >
            投稿
          </button>
          <button
            className="button-group-save"
            onClick={(e) =>
              handlePost(
                e,
                "draft",
                id,
                title,
                String(markdown),
                tags,
                categoryID
              )
            }
          >
            一時保存
          </button>
          <button
            className="button-group-delete"
            onClick={(e) => {
              e.preventDefault();
              if (id) deletePost(String(id));
            }}
          >
            削除
          </button>
        </div>
      </form>
    </div>
  );
}
