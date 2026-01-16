import { useState } from "react";
import "../styles/auth.css";

const Login = ({ goRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const next = { email: "", password: "" };
    const e = email.trim();

    if (!e) next.email = "Email is required";
    else if (!EMAIL_RE.test(e)) next.email = "Enter a valid email";

    if (!password) next.password = "Password is required";

    setErrors(next);
    return !next.email && !next.password;
  };

  const login = () => {
    if (!validate()) return;

    const user = JSON.parse(localStorage.getItem("user"));

    const e = email.trim();

    if (user?.email === e && user?.password === password) {
      localStorage.setItem("loggedIn", "true");
      onLoginSuccess?.();
      return;
    }

    // Wrong credentials
    setErrors({ email: "", password: "Wrong email or password" });
  };

  return (
    <div className="auth-page">
      <div className="auth">
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          className={errors.email ? "error" : ""}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
          }}
        />

        {errors.email && <div className="field-error">{errors.email}</div>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          className={errors.password ? "error" : ""}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password)
              setErrors((prev) => ({ ...prev, password: "" }));
          }}
        />

        {errors.password && (
          <div className="field-error">{errors.password}</div>
        )}

        <button onClick={login}>Login</button>

        <p
          onClick={() => goRegister?.()}
          style={{ marginTop: 12, fontSize: 14, color: "#aaa", cursor: "pointer" }}
        >
          Not registered? Sign up
        </p>
      </div>
    </div>
  );
};

export default Login;
