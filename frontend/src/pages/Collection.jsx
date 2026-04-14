import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Cards from "../components/Cards";
import DB from "../db/db";

const Collection = () => {
  const movies = DB();

  const [activeFolder, setActiveFolder] = useState("collection");
  const [mediaFolders, setMediaFolders] = useState({});
  const [favorites, setfavorites] = useState([]);

  useEffect(() => {
    const storedFolders =
      JSON.parse(localStorage.getItem("mediaFolders")) || {};
    const storedfavorites =
      JSON.parse(localStorage.getItem("favorites")) || [];

    setMediaFolders(storedFolders);
    setfavorites(storedfavorites);
  }, []);

  const folderTabs = [
    { key: "collection", label: "All" },
    { key: "movies", label: "Movies" },
    { key: "tv", label: "TV Series" },
    { key: "anime", label: "Anime" },
    { key: "favorites", label: "Favourites" },
  ];

  const removeFromFolder = (movieId, folder) => {
    const storedFolders =
      JSON.parse(localStorage.getItem("mediaFolders")) || {};

    const currentFolders = storedFolders[String(movieId)] || [];

    const updatedFolders = currentFolders.filter((f) => f !== folder);

    storedFolders[String(movieId)] = updatedFolders;

    localStorage.setItem("mediaFolders", JSON.stringify(storedFolders));
    setMediaFolders(storedFolders);
  };

  const removeFromAllFolders = (movieId) => {
    const storedFolders =
      JSON.parse(localStorage.getItem("mediaFolders")) || {};

    storedFolders[String(movieId)] = [];

    localStorage.setItem("mediaFolders", JSON.stringify(storedFolders));
    setMediaFolders(storedFolders);
  };

  const filteredItems = useMemo(() => {
    if (activeFolder === "favorites") {
      return movies.filter((movie) => favorites.includes(movie.id));
    }

    if (activeFolder === "collection") {
      return movies.filter((movie) => {
        const folders = mediaFolders[String(movie.id)] || [];
        return folders.length > 0;
      });
    }

    return movies.filter((movie) => {
      const folders = mediaFolders[String(movie.id)] || [];
      return folders.includes(activeFolder);
    });
  }, [movies, mediaFolders, favorites, activeFolder]);

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-semibold mb-6">My Collection</h1>

      <div className="flex gap-3 mb-8 flex-wrap">
        {folderTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFolder(tab.key)}
            className={`px-4 py-2 rounded-lg ${
              activeFolder === tab.key
                ? "bg-blue-600"
                : "bg-[#111] border border-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-8">
        <p className="text-gray-400">
          {filteredItems.length} title
          {filteredItems.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredItems.map((movie) => (
            <div key={movie.id} className="relative group">
              {activeFolder !== "favorites" && (
                <button
                  onClick={(e) => {
                    e.preventDefault();

                    if (activeFolder === "collection") {
                      removeFromAllFolders(movie.id);
                    } else {
                      removeFromFolder(movie.id, activeFolder);
                    }
                  }}
                  className="absolute top-2 left-2 z-20 bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition"
                >
                  Remove
                </button>
              )}

              <Link to={`/media/${movie.id}`}>
                <Cards
                  title={movie.title}
                  poster={movie.poster}
                  year={movie.year}
                  rating={movie.rating}
                />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#111] border border-[#2A2A2A] rounded-2xl p-6 text-gray-400">
          No titles added in this folder yet.
        </div>
      )}
    </div>
  );
};

export default Collection;