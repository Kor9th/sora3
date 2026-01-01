import { useMemo, useState } from "react";

function nowLabel() {
  const d = new Date();
  return d.toLocaleString([], {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Generator({ onLogout, user }) {
  const [prompt, setPrompt] = useState("");
  const [resolution, setResolution] = useState("1920x1080");
  const [duration, setDuration] = useState(6);

  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [history, setHistory] = useState([]);

  const charLimit = 1000;

  const canGenerate = useMemo(
    () => prompt.trim().length >= 10 && !loading,
    [prompt, loading]
  );

  function reset() {
    setPrompt("");
    setResolution("1920x1080");
    setDuration(6);
    setLoading(false);
    setVideoUrl(null);
  }

  // TEMP: No placeholder video — just simulates a "run" entry
  function generateFake() {
    setLoading(true);
    setVideoUrl(null);

    setTimeout(() => {
      setLoading(false);

      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          createdAt: nowLabel(),
          prompt: prompt.trim(),
          resolution,
          duration,
          url: null, // <-- no placeholder URL
        },
        ...prev,
      ]);
    }, 800);
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    onLogout();
  }

  return (
    <div className="container">
      {/* TOP BAR */}
      <div className="topbar">
        <div>
          <h1>Marketing Video Generator</h1>
          <p className="muted">Prompt → generate → preview → download</p>
        </div>

        <div className="userBar">
          <span className="muted">{user?.email}</span>
          <button className="btn btnSecondary" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      <div className="shell">
        {/* LEFT PANEL */}
        <div className="card">
          <div className="cardHeader">
            <div>
              <h2>Create video</h2>
              <div className="sub">
                Describe the marketing video you want to generate.
              </div>
            </div>

            {loading && (
              <span className="badge">
                <span className="spinner" /> Generating…
              </span>
            )}
          </div>

          <div className="cardBody">
            {/* PROMPT */}
            <div style={{ marginBottom: 14 }}>
              <div className="label">Marketing prompt</div>

              <textarea
                className="textarea"
                value={prompt}
                maxLength={charLimit}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: A modern skincare ad, clean white background, soft studio lighting, close-up product shots, minimal motion graphics, calm luxury vibe."
              />

              <div className="promptMeta">
                <span className="fieldHint">
                  Tips: product, audience, setting, mood, camera style
                </span>
                <span className="charCount">
                  {prompt.length}/{charLimit}
                </span>
              </div>
            </div>

            {/* OPTIONS */}
            <div className="row">
              <div>
                <div className="label">Resolution</div>
                <select
                  className="select"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                >
                  <option value="1920x1080">1920×1080 (Full HD)</option>
                  <option value="1280x720">1280×720 (HD)</option>
                  <option value="1080x1920">1080×1920 (Vertical / Shorts)</option>
                  <option value="1024x1024">1024×1024 (Square)</option>
                </select>
              </div>

              <div>
                <div className="label">Duration (seconds)</div>
                <select
                  className="select"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="actions">
              <button
                className="btn btnPrimary"
                disabled={!canGenerate}
                onClick={generateFake}
              >
                {loading ? "Generating…" : "Generate video"}
              </button>

              <button className="btn btnSecondary" onClick={reset}>
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* PREVIEW */}
          <div className="card">
            <div className="cardHeader">
              <h2>Preview</h2>
            </div>

            <div className="cardBody">
              {!videoUrl && !loading && <p className="muted">No video yet.</p>}
              {loading && <p className="muted">Working on it…</p>}

              {videoUrl && (
                <>
                  <video className="video" controls src={videoUrl} />
                  <div className="actions" style={{ marginTop: 12 }}>
                    <a className="btn btnPrimary" href={videoUrl} download>
                      Download
                    </a>
                    <button
                      className="btn btnSecondary"
                      onClick={() =>
                        navigator.clipboard.writeText(prompt.trim())
                      }
                    >
                      Copy prompt
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* HISTORY */}
          <div className="card">
            <div className="cardHeader">
              <h2>History</h2>
              <div className="sub">
                {history.length ? "Recent videos" : "No videos yet"}
              </div>
            </div>

            <div className="cardBody">
              {!history.length && (
                <p className="muted">Generated videos will appear here.</p>
              )}

              {!!history.length && (
                <div className="list">
                  {history.slice(0, 5).map((h) => (
                    <div className="item" key={h.id}>
                      <div className="itemTop">
                        <p className="itemTitle">{h.createdAt}</p>

                        {/* No download link if no URL */}
                        {h.url ? (
                          <a className="smallLink" href={h.url} download>
                            Download
                          </a>
                        ) : (
                          <span className="muted">Pending</span>
                        )}
                      </div>

                      <p className="itemMeta">
                        {h.prompt.length > 120
                          ? h.prompt.slice(0, 120) + "…"
                          : h.prompt}
                      </p>

                      <div className="itemMeta">
                        {h.resolution} · {h.duration}s
                      </div>

                      <a
                        className="smallLink"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPrompt(h.prompt);
                          setResolution(h.resolution);
                          setDuration(h.duration);
                        }}
                      >
                        Reuse prompt
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
