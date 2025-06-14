import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./PagesCss/RegisterPage.css";

function getBackendUrl() {
  const hostname = window.location.hostname;
  if (hostname.includes("localhost")) return "http://localhost:4000";
  return "https://tfgv2.onrender.com";
}
const backendUrl = process.env.REACT_APP_BACKEND_URL || getBackendUrl();

function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const createUser = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebase_uid = userCredential.user.uid;
      await fetch(`${backendUrl}/api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebase_uid, nombre, email }),
      });
      navigate("/see");
    } catch (err) {
      setError(err.message);
    }
  };

  const createUserGoogle = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const firebase_uid = user.uid;
      const nombre = user.displayName || "";
      const email = user.email;
      await fetch(`${backendUrl}/api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebase_uid, nombre, email }),
      });
      navigate("/see");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <img src="/originallogo.png" alt="Logo" className="register-logo" />
      <form className="register-form" onSubmit={createUser}>
        <div className="register-title">Registro</div>
        <input
          className="register-textfield"
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          className="register-textfield"
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="register-textfield"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="register-google-btn" style={{ marginTop: "0.7rem" }}>
          Registrarse
        </button>
        <button type="button" className="register-google-btn" onClick={createUserGoogle}>
          <img src="/google-icon.svg" alt="" style={{ height: "1.2em" }} />
          Entrar con Google
        </button>
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </form>
    </div>
  );
}

export default RegisterPage;