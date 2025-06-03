import { useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom"; // <-- Añade esto
import "../App.css";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // <-- Añade esto

  const createUser = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/see"); // <-- Redirige a descubrir
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