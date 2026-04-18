import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import anime from "animejs";
import { MEDIA, TIER_COLORS } from "../data/mockData";
import "./TierList.css";

const TIERS = ["S", "A", "B", "C", "D"];

const initTiers = () => ({
  S: [MEDIA[0], MEDIA[4], MEDIA[7]],
  A: [MEDIA[1], MEDIA[2], MEDIA[5]],
  B: [MEDIA[3], MEDIA[8], MEDIA[11]],
  C: [MEDIA[9]],
  D: [MEDIA[10]],
  unranked: [MEDIA[6]],
});

export default function TierList() {
  const headerRef = useRef(null);
  const [tiers, setTiers]         = useState(initTiers);
  const [dragging, setDragging]   = useState(null); // { item, fromTier }
  const [hoveredTier, setHoveredTier] = useState(null);

  useEffect(() => {
    anime({
      targets: headerRef.current?.querySelectorAll(".tl-letter"),
      translateY: [50, 0],
      opacity:    [0, 1],
      delay:      anime.stagger(40),
      duration:   700,
      easing:     "easeOutExpo",
    });
    gsap.fromTo(".tier-row",
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, stagger: 0.1, duration: 0.6, delay: 0.3, ease: "power3.out" }
    );
    gsap.fromTo(".unranked-pool",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.9, ease: "power3.out" }
    );
  }, []);

  const onDragStart = (e, item, fromTier) => {
    setDragging({ item, fromTier });
    e.dataTransfer.effectAllowed = "move";
    // Ghost image
    const el = e.currentTarget;
    anime({ targets: el, scale: 0.9, opacity: 0.5, duration: 150 });
  };

  const onDragEnd = (e) => {
    setDragging(null);
    setHoveredTier(null);
    anime({ targets: e.currentTarget, scale: 1, opacity: 1, duration: 200 });
  };

  const onDrop = (e, toTier) => {
    e.preventDefault();
    if (!dragging) return;
    const { item, fromTier } = dragging;
    if (fromTier === toTier) return;

    setTiers((prev) => {
      const next = { ...prev };
      next[fromTier] = next[fromTier].filter((x) => x.id !== item.id);
      next[toTier]   = [...next[toTier], item];
      return next;
    });
    setHoveredTier(null);

    // Flash the row
    setTimeout(() => {
      const row = document.querySelector(`[data-tier="${toTier}"]`);
      if (row) {
        anime({
          targets: row,
          backgroundColor: [`${TIER_COLORS[toTier]?.glow || "rgba(0,229,255,0.1)"}`, "rgba(0,0,0,0)"],
          duration: 600,
          easing: "easeOutQuad",
        });
      }
    }, 50);
  };

  const removeFromTier = (item, fromTier) => {
    setTiers((prev) => {
      const next = { ...prev };
      next[fromTier] = next[fromTier].filter((x) => x.id !== item.id);
      next.unranked  = [...next.unranked, item];
      return next;
    });
  };

  const TITLE = "TIER LIST";

  return (
    <div className="page tier-page">
      <div className="noise-overlay" />

      {/* Header */}
      <div ref={headerRef} className="container tl-header">
        <div className="tl-eyebrow">
          <span className="tag tag--pink">RANKING</span>
          <span className="font-mono text-muted" style={{ fontSize: 11, letterSpacing: "0.14em" }}>DRAG & DROP TO REORDER</span>
        </div>
        <h1 className="tl-title font-display" aria-label={TITLE}>
          {TITLE.split("").map((c, i) => (
            <span key={i} className={`tl-letter ${c === " " ? "tl-space" : ""}`}>
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
        </h1>
      </div>

      {/* Tier rows */}
      <div className="container tl-body">
        <div className="tier-list-grid">
          {TIERS.map((tier) => {
            const color = TIER_COLORS[tier];
            return (
              <div
                key={tier}
                data-tier={tier}
                className={`tier-row ${hoveredTier === tier ? "tier-row--hovered" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setHoveredTier(tier); }}
                onDragLeave={() => setHoveredTier(null)}
                onDrop={(e) => onDrop(e, tier)}
                style={{ "--tier-color": color.bg, "--tier-glow": color.glow }}
              >
                {/* Label */}
                <div className="tier-label" style={{ background: color.bg }}>
                  <span className="font-display">{tier}</span>
                </div>

                {/* Items */}
                <div className="tier-items">
                  {tiers[tier].map((item) => (
                    <TierItem
                      key={item.id}
                      item={item}
                      tier={tier}
                      onDragStart={onDragStart}
                      onDragEnd={onDragEnd}
                      onRemove={removeFromTier}
                    />
                  ))}
                  {tiers[tier].length === 0 && (
                    <div className="tier-empty font-mono">
                      DROP HERE
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Unranked pool */}
        <div
          className={`unranked-pool glass ${hoveredTier === "unranked" ? "unranked-pool--hovered" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setHoveredTier("unranked"); }}
          onDragLeave={() => setHoveredTier(null)}
          onDrop={(e) => onDrop(e, "unranked")}
        >
          <div className="unranked-header">
            <span className="font-mono text-muted" style={{ fontSize: 10, letterSpacing: "0.16em" }}>UNRANKED POOL</span>
            <span className="font-mono text-muted" style={{ fontSize: 10 }}>
              {tiers.unranked.length} ITEMS
            </span>
          </div>
          <div className="unranked-items">
            {tiers.unranked.map((item) => (
              <TierItem
                key={item.id}
                item={item}
                tier="unranked"
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onRemove={() => {}}
                unranked
              />
            ))}
            {tiers.unranked.length === 0 && (
              <div className="tier-empty font-mono">ALL RANKED ✓</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TierItem({ item, tier, onDragStart, onDragEnd, onRemove, unranked }) {
  const ref = useRef(null);

  const handleMouseEnter = () => {
    anime({ targets: ref.current, scale: 1.05, duration: 200, easing: "easeOutQuad" });
  };
  const handleMouseLeave = () => {
    anime({ targets: ref.current, scale: 1, duration: 200, easing: "easeOutQuad" });
  };

  return (
    <div
      ref={ref}
      className="tier-item"
      draggable
      onDragStart={(e) => onDragStart(e, item, tier)}
      onDragEnd={onDragEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={item.title}
    >
      <img src={item.poster} alt={item.title} className="tier-item__img" />
      <div className="tier-item__tooltip">
        <div className="font-ui" style={{ fontWeight: 700, fontSize: 12 }}>{item.title}</div>
        <div className="font-mono" style={{ fontSize: 10, color: "var(--text-muted)" }}>{item.year} · ★ {item.rating}</div>
      </div>
      {!unranked && (
        <button
          className="tier-item__remove"
          onClick={() => onRemove(item, tier)}
          title="Remove"
        >×</button>
      )}
    </div>
  );
}
