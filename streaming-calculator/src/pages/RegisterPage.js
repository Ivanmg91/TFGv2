import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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
    return "https://tfgv2.onrender.com"; // Cambia por tu backend real en producción
  }
  if (hostname.includes("app.github.dev")) {
    return "https://tfgv2.onrender.com";
  }
  // Por defecto, producción
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
      // Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebase_uid = userCredential.user.uid;

      // Insertar usuario en tu base de datos
      await fetch(`${backendUrl}/api/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebase_uid,
          nombre,
          email,
        }),
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
      await signInWithPopup(auth, provider);
      navigate("/see"); // <-- Redirige a descubrir
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="main-content">
      <h2>Registro</h2>
      <form onSubmit={createUser}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
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
        <button type="submit">Registrarse</button>
      </form>
      <button onClick={createUserGoogle} style={{marginTop: "10px"}}>
        Registrarse con Google
      </button>
      {error && <p style={{color: "red"}}>{error}</p>}
    </div>
  );
}

export default RegisterPage;