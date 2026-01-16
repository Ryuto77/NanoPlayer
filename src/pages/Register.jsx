import { useState } from "react";
import "../styles/auth.css";

const Register = ({ goLogin, onRegisterSuccess }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const next = { name: "", email: "", password: "" };
    const name = user.name.trim();
    const email = user.email.trim();

    if (!name) next.name = "Name is required";

    if (!email) next.email = "Email is required";
    else if (!EMAIL_RE.test(email)) next.email = "Enter a valid email";

    if (!user.password) next.password = "Password is required";
    else if (user.password.length < 6)
      next.password = "Password must be at least 6 characters";

    setErrors(next);
    return !next.name && !next.email && !next.password;
  };

  const submit = () => {
    if (!validate()) return;

    const existing = JSON.parse(localStorage.getItem("user"));
    const email = user.email.trim();
    if (existing?.email) {
      setErrors((prev) => ({
        ...prev,
        email: "An account already exists on this device. Please login.",
      }));
      return;
    }

    const toSave = {
      ...user,
      name: user.name.trim(),
      email,
    };

    // save user
    localStorage.setItem("user", JSON.stringify(toSave));

    // auto login
    localStorage.setItem("loggedIn", "true");

    onRegisterSuccess?.();
  };

  return (
    <div className="auth-page">
      <div className="auth">
        <h1>Register</h1>

        <input
          placeholder="Name"
          value={user.name}
          className={errors.name ? "error" : ""}
          onChange={(e) => {
            setUser({ ...user, name: e.target.value });
            if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
          }}
        />

        {errors.name && <div className="field-error">{errors.name}</div>}

        <input
          type="email"
          placeholder="Email"
          value={user.email}
          className={errors.email ? "error" : ""}
          onChange={(e) => {
            setUser({ ...user, email: e.target.value });
            if (errors.email)
              setErrors((prev) => ({ ...prev, email: "" }));
          }}
        />

        {errors.email && <div className="field-error">{errors.email}</div>}

        <input
          type="password"
          placeholder="Password"
          value={user.password}
          className={errors.password ? "error" : ""}
          onChange={(e) => {
            setUser({ ...user, password: e.target.value });
            if (errors.password)
              setErrors((prev) => ({ ...prev, password: "" }));
          }}
        />

        {errors.password && (
          <div className="field-error">{errors.password}</div>
        )}

        <button onClick={submit}>Register</button>

        <p
          onClick={() => goLogin?.()}
          style={{ marginTop: 12, fontSize: 14, color: "#aaa", cursor: "pointer" }}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
};

export default Register;
