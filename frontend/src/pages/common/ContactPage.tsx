import "@/styles/common/ContactPage.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // いずれかが空だとエラー
    if (!name || !email || !message) {
      setError("すべての項目を入力してください。");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/contact`, {
        name,
        email,
        message,
      });

      if (res.status === 200) {
        setSubmitted(true);
        setError(null);
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("送信に失敗しました。");
      }
    }
  };

  return (
    <div className="contact-container" id="set-point">
      <h1>お問い合わせ</h1>
      {submitted ? (
        <p className="success-message">
          お問い合わせありがとうございます。内容を受け付けました。
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          {error && <p className="error-message">{error}</p>}
          <label>
            お名前
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：山田 太郎"
            />
          </label>
          <label>
            メールアドレス
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="例：example@example.com"
            />
          </label>
          <label>
            お問い合わせ内容
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="お問い合わせ内容をご記入ください。"
              rows={6}
            />
          </label>
          <button type="submit">送信</button>
        </form>
      )}
    </div>
  );
}
