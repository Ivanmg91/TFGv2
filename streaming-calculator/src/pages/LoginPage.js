import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../App.css";

// Función para detectar el backend según el entorno
function getBackendUrl() {
  const hostname = window.location.hostname;
  if (hostname.includes("localhost")) {
    return "http://localhost:4000";
  }
  if (hostname.includes("netlify.app")) {
    return "https://tfgv2.onrender.com";
  }
  if (hostname.includes("app.github.dev")) {
    return "https://tfgv2.onrender.com";
  }
  return "https://tfgv2.onrender.com";
}
const backendUrl = process.env.REACT_APP_BACKEND_URL || getBackendUrl();

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/see");
    } catch (err) {
      setError("Correo o contraseña incorrectos.");
    }
  };

  const loginWithGoogle = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const firebase_uid = user.uid;
      const nombre = user.displayName || "NO DEFINIDO";
      const email = user.email;

      // Check user in bbdd
      const res = await fetch(`${backendUrl}/api/usuarios/${firebase_uid}`);
      if (res.status === 404) {
        //if user does not exist, create it
        await fetch(`${backendUrl}/api/usuarios`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firebase_uid, nombre, email }),
        });
      }
      // if existing or already created, we continue
      navigate("/see");
    } catch (err) {
      setError("Error al iniciar sesión con Google.");
    }
  };

  return (
    <div className="main-content">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={loginUser}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <button onClick={loginWithGoogle} style={{marginTop: "10px"}}>
        Iniciar sesión con Google
      </button>
      {error && <p style={{color: "red"}}>{error}</p>}
    </div>
  );
}

export default LoginPage;