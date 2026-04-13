import { useState } from "react";
import DB from "../db/db";

const DEFAULT_TIERS = [
  { label: "S", color: "#FF7F7F" },
  { label: "A", color: "#FFBF7F" },
  { label: "B", color: "#FFFF7F" },
  { label: "C", color: "#7FFF7F" },
  { label: "D", color: "#7FBFFF" },
];

const TierList = () => {
  const movies = DB();

  const [tiers, setTiers] = useState(
    DEFAULT_TIERS.map((t) => ({ ...t, movies: [] }))
  );
  const [unranked, setUnranked] = useState(movies);
  const [dragging, setDragging] = useState(null); // { movie, from: 'unranked' | tierLabel }

  const handleDragStart = (movie, from) => {
    setDragging({ movie, from });
  };

  const handleDropOnTier = (tierLabel) => {
    if (!dragging) return;

    // Remove from source
    let newUnranked = unranked;
    let newTiers = tiers.map((t) => ({
      ...t,
      movies: t.movies.filter((m) => m.id !== dragging.movie.id),
    }));

    if (dragging.from === "unranked") {
      newUnranked = unranked.filter((m) => m.id !== dragging.movie.id);
    }

    // Add to target tier
    newTiers = newTiers.map((t) =>
      t.label === tierLabel
        ? { ...t, movies: [...t.movies, dragging.movie] }
        : t
    );

    setUnranked(newUnranked);
    setTiers(newTiers);
    setDragging(null);
  };

  const handleDropOnUnranked = () => {
    if (!dragging || dragging.from === "unranked") return;

    const newTiers = tiers.map((t) => ({
      ...t,
      movies: t.movies.filter((m) => m.id !== dragging.movie.id),
    }));

    setUnranked([...unranked, dragging.movie]);
    setTiers(newTiers);
    setDragging(null);
  };

  return (
    <div className="text-white w-full">

      {/* Tier Rows */}
      <div className="flex flex-col gap-2 mb-8">
        {tiers.map((tier) => (
          <div
            key={tier.label}
            className="flex items-stretch min-h-[100px] rounded-lg overflow-hidden border border-[#2A2A2A]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDropOnTier(tier.label)}
          >
            {/* Tier Label */}
            <div
              className="w-[70px] min-w-[70px] flex items-center justify-center text-2xl font-bold text-black"
              style={{ backgroundColor: tier.color }}
            >
              {tier.label}
            </div>

            {/* Movies in this tier */}
            <div className="flex flex-wrap gap-2 p-2 flex-1 bg-[#1a1a1a]">
              {tier.movies.length === 0 && (
                <span className="text-[#444] text-sm self-center pl-2">
                  Drop movies here
                </span>
              )}
              {tier.movies.map((movie) => (
                <img
                  key={movie.id}
                  src={movie.poster}
                  alt={movie.title}
                  draggable
                  onDragStart={() => handleDragStart(movie, tier.label)}
                  className="h-[80px] w-[55px] object-cover rounded cursor-grab hover:ring-2 hover:ring-[#1480d9] transition-all"
                  title={movie.title}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Unranked Pool */}
      <div
        className="border border-[#2A2A2A] rounded-lg bg-[#1a1a1a] p-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropOnUnranked}
      >
        <p className="text-[#737373] text-sm mb-3">Unranked — drag movies into tiers above</p>
        <div className="flex flex-wrap gap-3">
          {unranked.map((movie) => (
            <div
              key={movie.id}
              draggable
              onDragStart={() => handleDragStart(movie, "unranked")}
              className="flex flex-col items-center gap-1 cursor-grab group"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="h-[90px] w-[62px] object-cover rounded hover:ring-2 hover:ring-[#1480d9] transition-all"
              />
              <span className="text-[10px] text-[#737373] group-hover:text-gray-300 text-center w-[62px] truncate">
                {movie.title}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default TierList;