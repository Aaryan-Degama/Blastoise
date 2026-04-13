import React, { useEffect, useMemo, useState } from "react";
import Cards from "../components/Cards";
import DB from "../db/db";
import { Link } from "react-router-dom";

const Collection = () => {
  // Get all movies/shows/anime data from the database file
  const movies = DB();

  // Stores the text typed in the search bar
  const [search, setSearch] = useState("");

  // Stores which top filter button is active:
  // "All", "Movies", "TV Shows", "Anime", or "Favorites"
  const [activeFilter, setActiveFilter] = useState("All");

  // Stores selected dropdown filter values
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedRating, setSelectedRating] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");

  // Stores IDs of favorite movies
  const [favorites, setFavorites] = useState([]);

  // Stores IDs of movies in "Continue Watching"
  const [continueWatching, setContinueWatching] = useState([]);

  // Runs once when the component loads
  // It reads saved favorites and continue watching data from localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const storedContinueWatching =
      JSON.parse(localStorage.getItem("continueWatching")) || [];

    setFavorites(storedFavorites);
    setContinueWatching(storedContinueWatching);
  }, []);

  // Adds/removes a movie from favorites
  const toggleFavorite = (movieId) => {
    let updatedFavorites = [];

    // If movie is already in favorites, remove it
    if (favorites.includes(movieId)) {
      updatedFavorites = favorites.filter((id) => id !== movieId);
    } 
    // Otherwise add it to favorites
    else {
      updatedFavorites = [...favorites, movieId];
    }

    // Update state
    setFavorites(updatedFavorites);

    // Save updated favorites to localStorage
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Adds a movie to Continue Watching
  const addToContinueWatching = (movieId) => {
    // Remove movie first if it already exists
    // This avoids duplicates
    let updated = continueWatching.filter((id) => id !== movieId);

    // Add the clicked movie at the start of the list
    // Keep only the latest 6 items
    updated = [movieId, ...updated].slice(0, 6);

    // Update state and localStorage
    setContinueWatching(updated);
    localStorage.setItem("continueWatching", JSON.stringify(updated));
  };

  // Removes a movie from Continue Watching
  const removeFromContinueWatching = (movieId) => {
    const updated = continueWatching.filter((id) => id !== movieId);
    setContinueWatching(updated);
    localStorage.setItem("continueWatching", JSON.stringify(updated));
  };

  // Create a genre list for the genre dropdown
  // "All" is added manually, rest come from movie data
  // new Set removes duplicates
  const genres = [
    "All",
    ...new Set(movies.map((movie) => movie.genre).filter(Boolean)),
  ];

  // Create a language list for the language dropdown
  const languages = [
    "All",
    ...new Set(movies.map((movie) => movie.language).filter(Boolean)),
  ];

  // Filter movies based on:
  // search text
  // active top filter
  // selected genre
  // selected rating
  // selected language
  //
  // useMemo is used so filtering only re-runs when dependencies change,
  // making it more efficient
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      // Check if movie title matches search text
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(search.toLowerCase());

      // Check if movie matches active top filter
      let matchesType = true;

      if (activeFilter === "Movies") matchesType = movie.type === "movie";
      else if (activeFilter === "TV Shows") matchesType = movie.type === "tv";
      else if (activeFilter === "Anime") matchesType = movie.type === "anime";
      else if (activeFilter === "Favorites")
        matchesType = favorites.includes(movie.id);

      // Check genre filter
      const matchesGenre =
        selectedGenre === "All" || movie.genre === selectedGenre;

      // Check rating filter
      // For example if selectedRating = 7, then movie.rating must be >= 7
      const matchesRating =
        selectedRating === "All" || movie.rating >= Number(selectedRating);

      // Check language filter
      const matchesLanguage =
        selectedLanguage === "All" || movie.language === selectedLanguage;

      // Return only movies that satisfy all conditions
      return (
        matchesSearch &&
        matchesType &&
        matchesGenre &&
        matchesRating &&
        matchesLanguage
      );
    });
  }, [
    movies,
    search,
    activeFilter,
    selectedGenre,
    selectedRating,
    selectedLanguage,
    favorites,
  ]);

  // Get full movie objects for Continue Watching section
  // continueWatching contains only IDs, so here we match IDs with movie data
  const continueWatchingMovies = movies.filter((movie) =>
    continueWatching.includes(movie.id)
  );

  // Generate recommendations based on favorite genres
  const recommendations = useMemo(() => {
    // First get all favorite movies
    const favoriteMovies = movies.filter((movie) =>
      favorites.includes(movie.id)
    );

    // If no favorites exist, no recommendations
    if (favoriteMovies.length === 0) return [];

    // Extract unique genres from favorite movies
    const favoriteGenres = [
      ...new Set(favoriteMovies.map((movie) => movie.genre)),
    ];

    // Recommend movies from the same genres
    // but exclude already favorited ones
    return movies
      .filter(
        (movie) =>
          favoriteGenres.includes(movie.genre) &&
          !favorites.includes(movie.id)
      )
      .slice(0, 6); // only show first 6 recommendations
  }, [movies, favorites]);

  // Reset all filters back to default
  const resetFilters = () => {
    setSearch("");
    setActiveFilter("All");
    setSelectedGenre("All");
    setSelectedRating("All");
    setSelectedLanguage("All");
  };

  // Reusable function to render one movie card
  // isContinue=true means this card is being shown inside Continue Watching
  const renderMovieCard = (movie, isContinue = false) => (
    <div key={movie.id} className="relative group">
      {/* Favorite button in top-right corner */}
      <button
        onClick={(e) => {
          e.preventDefault(); // Prevent link navigation when clicking heart button
          toggleFavorite(movie.id);
        }}
        className="absolute top-3 right-3 z-20 text-xl bg-black/60 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition"
      >
        {/* Show filled heart if favorited, else empty heart */}
        {favorites.includes(movie.id) ? "❤️" : "🤍"}
      </button>

      {/* Show remove button only for Continue Watching cards */}
      {isContinue && (
        <button
          onClick={(e) => {
            e.preventDefault(); // Prevent opening details page
            removeFromContinueWatching(movie.id);
          }}
          className="absolute top-3 left-3 z-20 text-sm bg-red-600 px-2 py-1 rounded-md hover:bg-red-700 transition"
        >
          Remove
        </button>
      )}

      {/* Clicking the card opens the detail page */}
      <Link
        to={`/media/${movie.id}`}
        onClick={() => addToContinueWatching(movie.id)}
      >
        <Cards
          title={movie.title}
          poster={movie.poster}
          year={movie.year}
          rating={movie.rating}
        />
      </Link>
    </div>
  );

  return (
    <div className="text-white p-6">
      {/* Page heading */}
      <h1 className="text-3xl font-semibold mb-6">My Collection</h1>

      {/* Search bar + dropdown filters */}
      <div className="mb-8 grid gap-4 lg:grid-cols-4">
        {/* Search input */}
        <div className="relative w-full lg:col-span-1">
          <input
            type="text"
            placeholder="Search movies, TV shows, anime..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 pr-12 rounded-lg bg-[#111] border border-gray-700 outline-none"
          />

          {/* Clear search button shown only when something is typed */}
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-lg"
            >
              ✕
            </button>
          )}
        </div>

        {/* Genre dropdown */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-4 py-3 rounded-lg bg-[#111] border border-gray-700 outline-none"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              Genre: {genre}
            </option>
          ))}
        </select>

        {/* Rating dropdown */}
        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          className="px-4 py-3 rounded-lg bg-[#111] border border-gray-700 outline-none"
        >
          <option value="All">Rating: All</option>
          <option value="5">5+</option>
          <option value="6">6+</option>
          <option value="7">7+</option>
          <option value="8">8+</option>
          <option value="9">9+</option>
        </select>

        {/* Language dropdown */}
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-4 py-3 rounded-lg bg-[#111] border border-gray-700 outline-none"
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              Language: {language}
            </option>
          ))}
        </select>
      </div>

      {/* Top filter buttons */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {["All", "Movies", "TV Shows", "Anime", "Favorites"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg ${
              activeFilter === filter
                ? "bg-blue-600"
                : "bg-[#111] border border-gray-700"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Result count + reset button */}
      <div className="flex items-center justify-between mb-10">
        <p className="text-gray-400">
          {filteredMovies.length} title
          {filteredMovies.length !== 1 ? "s" : ""} found
        </p>

        <button
          onClick={resetFilters}
          className="px-4 py-2 rounded-lg bg-[#111] border border-gray-700 hover:border-blue-500 transition"
        >
          Reset Filters
        </button>
      </div>

      {/* Show Continue Watching only when "All" filter is active */}
      {activeFilter === "All" && continueWatchingMovies.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Continue Watching</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {continueWatchingMovies.map((movie) =>
              renderMovieCard(movie, true)
            )}
          </div>
        </div>
      )}

      {/* Show Recommendations only when "All" filter is active */}
      {activeFilter === "All" && recommendations.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Recommended For You</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {recommendations.map((movie) => renderMovieCard(movie))}
          </div>
        </div>
      )}

      {/* Main collection section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Browse Collection</h2>

        {/* If there are filtered movies, show cards */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredMovies.map((movie) => renderMovieCard(movie))}
          </div>
        ) : (
          // Show this message when nothing matches filters
          <p className="text-gray-400">No matching titles found.</p>
        )}
      </div>
    </div>
  );
};

export default Collection;