import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import Auth from "./pages/Auth.jsx";
import Generator from "./pages/Generator.jsx";

function App() {
  const [user, setUser] = React.useState(() => {
    const token = localStorage.getItem("access_token");
    return token ? { email: "signed-in" } : null;
  });

  const stamp = new Date().toLocaleString();

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 9999,
          padding: "10px 12px",
          borderBottom: "2px solid black",
          background: "yellow",
          color: "black",
          fontFamily: "monospace",
          fontWeight: 700,
        }}
      >
        FRONTEND IS REBUILDING ✅ {stamp} | PORT: {window.location.port}
      </div>

      {user ? <Generator /> : <Auth onAuthed={(u) => setUser(u)} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
