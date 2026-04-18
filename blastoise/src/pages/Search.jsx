import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import anime from "animejs";
import { MEDIA } from "../data/mockData";
import "./Search.css";

export default function Search() {
  const inputRef    = useRef(null);
  const resultsRef  = useRef(null);
  const bgTextRef   = useRef(null);

  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [typed,   setTyped]   = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    // Entrance
    gsap.fromTo(".search-title-word",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power3.out" }
    );
    gsap.fromTo(".search-input-wrap",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, delay: 0.4, duration: 0.6, ease: "power3.out" }
    );

    // Floating bg text
    anime({
      targets: ".void-text",
      translateX: ["0%", "2%"],
      direction: "alternate",
      loop: true,
      duration: 8000,
      easing: "easeInOutSine",
    });

    setTimeout(() => inputRef.current?.focus(), 600);
  }, []);

  const doSearch = useCallback((q) => {
    if (!q.trim()) { setResults([]); setTyped(false); return; }
    setTyped(true);
    const lower = q.toLowerCase();
    const found = MEDIA.filter(
      (m) =>
        m.title.toLowerCase().includes(lower) ||
        m.genre.some((g) => g.toLowerCase().includes(lower)) ||
        m.synopsis.toLowerCase().includes(lower)
    );
    setResults(found);

    requestAnimationFrame(() => {
      const cards = resultsRef.current?.querySelectorAll(".search-result-card");
      if (cards && cards.length > 0) {
        anime({
          targets: cards,
          opacity:    [0, 1],
          translateX: [-20, 0],
          delay:      anime.stagger(50),
          duration:   350,
          easing:     "easeOutQuad",
        });
      }
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 200);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const SUGGESTIONS = ["Neon", "Anime", "Sci-Fi", "Orbit", "Void", "Chrome"];

  return (
    <div className="page search-page">
      <div className="noise-overlay" />

      {/* Bg floating text */}
      <div ref={bgTextRef} className="void-text font-display">
        QUERY&nbsp;THE&nbsp;VOID
      </div>

      <div className="container search-wrap">
        {/* Title */}
        <div className="search-title">
          {"Query the Void.".split(" ").map((word, i) => (
            <span key={i} className="search-title-word font-display">{word}</span>
          ))}
        </div>

        {/* Search input */}
        <div className={`search-input-wrap ${focused ? "focused" : ""}`}>
          <div className="search-icon">
            <SearchIcon />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="search-big-input"
            placeholder="Search by name, set, or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {query && (
            <button
              className="search-clear"
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            >
              ×
            </button>
          )}
        </div>

        {/* Suggestions */}
        {!typed && (
          <div className="search-suggestions">
            <span className="font-mono text-muted" style={{ fontSize: 10, letterSpacing: "0.14em" }}>TRY:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="suggestion-chip"
                onClick={() => setQuery(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {typed && (
          <div ref={resultsRef} className="search-results">
            <div className="results-header">
              <span className="font-mono text-muted" style={{ fontSize: 11, letterSpacing: "0.12em" }}>
                {results.length} {results.length === 1 ? "RESULT" : "RESULTS"} FOR "{query.toUpperCase()}"
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--border)", margin: "0 16px" }} />
              <div className="filter-pills" style={{ display: "flex", gap: 4 }}>
                {["all", "movie", "series", "anime"].map((t) => (
                  <button key={t} className="filter-pill active" style={{ padding: "3px 10px" }}>{t}</button>
                ))}
              </div>
            </div>

            {results.length === 0 ? (
              <div className="no-results-msg">
                <span className="font-display" style={{ fontSize: 80, color: "var(--text-muted)" }}>∅</span>
                <p className="font-mono text-muted" style={{ fontSize: 12, letterSpacing: "0.12em", marginTop: 16 }}>
                  VOID RETURNED NOTHING
                </p>
              </div>
            ) : (
              <div className="search-results-grid">
                {results.map((item) => (
                  <SearchResultCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchResultCard({ item }) {
  return (
    <div className="search-result-card glass">
      <div className="src-poster">
        <img src={item.poster} alt={item.title} />
        <div className={`rec-badge font-display score-badge score-badge--${item.score.toLowerCase()}`} style={{
          position: "absolute", top: 6, right: 6, width: 24, height: 24, fontSize: 12, borderRadius: 3,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: item.score === "S" ? "rgba(255,45,107,0.9)" : item.score === "A" ? "rgba(255,123,0,0.9)" : "rgba(255,184,0,0.9)",
          color: item.score === "B" ? "#000" : "#fff",
        }}>
          {item.score}
        </div>
      </div>
      <div className="src-info">
        <div className="src-title">{item.title}</div>
        <div className="src-meta font-mono">
          {item.year} · {item.type.toUpperCase()} · {item.duration}{item.type === "movie" ? "min" : "m/ep"}
        </div>
        <div className="src-genres">
          {item.genre.map((g) => (
            <span key={g} className="tag tag--cyan" style={{ fontSize: 9, padding: "2px 6px" }}>{g}</span>
          ))}
        </div>
        <p className="src-synopsis">{item.synopsis}</p>
      </div>
      <div className="src-actions">
        <div className="src-rating">
          <span className="font-mono" style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
            {item.rating}
          </span>
          <span className="font-mono text-muted" style={{ fontSize: 10 }}>/10</span>
        </div>
        {item.price ? (
          <button className="btn btn--ghost" style={{ fontSize: 10, padding: "6px 14px" }}>
            ${item.price} ADD
          </button>
        ) : (
          <button className="btn btn--primary" style={{ fontSize: 10, padding: "6px 14px" }}>
            + COLLECT
          </button>
        )}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
