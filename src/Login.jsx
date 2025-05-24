// Login.jsx
import { useState } from "react";

const users = [
  { id: 1, username: "demoUser", password: "demo123", email: "demo@example.com" },
  { id: 2, username: "admin", password: "admin123", email: "admin@example.com" }
];

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const user = users.find(
      (u) => u.username === formData.username && u.password === formData.password
    );

    if (user) {
      const userData = { id: user.id, username: user.username, email: user.email };
      localStorage.setItem("userData", JSON.stringify(userData));
      onLogin(userData);  // <-- Notify parent component
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: "50px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Login</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
