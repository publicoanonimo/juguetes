import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { Box, LockKeyhole, ArrowRight, LoaderCircle } from "lucide-react";
import { auth } from "./firebase.js";
import App from "./App.jsx";

export default function FirebaseGate() {
  const [user, setUser] = useState(null),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(
    () =>
      onAuthStateChanged(
        auth,
        (user) => {
          setUser(user);
          setReady(true);
        },
        () => {
          setError("No se pudo comprobar tu sesión. Recarga la página.");
          setReady(true);
        },
      ),
    [],
  );
  async function login(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const fields = new FormData(e.currentTarget);
    try {
      await signInWithEmailAndPassword(
        auth,
        String(fields.get("email")).trim(),
        String(fields.get("password")),
      );
    } catch (err) {
      const messages = {
        "auth/invalid-credential":
          "El correo o la contraseña no son correctos.",
        "auth/user-disabled": "Esta cuenta está deshabilitada.",
        "auth/too-many-requests": "Demasiados intentos. Espera unos minutos.",
        "auth/network-request-failed":
          "Revisa tu conexión e inténtalo de nuevo.",
        "auth/operation-not-allowed":
          "El acceso con correo y contraseña aún no está habilitado en Firebase.",
        "auth/invalid-api-key": "La configuración de Firebase no es válida.",
        "auth/configuration-not-found":
          "Configura Authentication en el proyecto de Firebase.",
      };
      setError(
        messages[err.code] ||
          "No se pudo iniciar sesión. Revisa tu cuenta en Firebase.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (user) return <App key={user.uid} user={user} />;
  return (
    <div className="access-page">
      <section className="access-card">
        <div className="access-brand">
          <span className="brand-icon">
            <Box size={27} />
          </span>
          Juguetes<span className="brand-dot">.</span>
        </div>
        {!ready ? (
          <div className="connection-loading" role="status">
            <LoaderCircle className="spin" size={25} />
            Comprobando tu sesión…
          </div>
        ) : (
          <>
            <span className="access-lock">
              <LockKeyhole size={25} />
            </span>
            <h1>Tu tienda, en un solo lugar</h1>
            <p>Ingresa para gestionar tu inventario y tus ventas.</p>
            <form onSubmit={login}>
              <label>
                Correo electrónico
                <input
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  disabled={busy}
                />
              </label>
              <label>
                Contraseña
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={busy}
                />
              </label>
              {error && (
                <p className="access-error" role="alert">
                  {error}
                </p>
              )}
              <button className="button primary full" disabled={busy}>
                {busy ? (
                  <LoaderCircle size={17} className="spin" />
                ) : (
                  <ArrowRight size={17} />
                )}{" "}
                {busy ? "Ingresando…" : "Ingresar"}
              </button>
            </form>
            <small>Usa la cuenta que te proporcionó el administrador.</small>
          </>
        )}
      </section>
    </div>
  );
}
