import "@/styles/admin/AdminLogin.css";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../../auth/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminLogin() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        username,
        password,
      });
      login(res.data.token);
    } catch (error) {
      console.error(error);
      setError("ユーザー名またはパスワードが正しくありません");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-box" onKeyDown={handleKeyDown} tabIndex={0}>
        <h1 className="login-title">管理者ログイン</h1>

        {error && <div className="login-error">{error}</div>}

        <input
          type="text"
          className="login-input"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="login-input"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleLogin}>
          ログイン
        </button>
      </div>
    </div>
  );
}
