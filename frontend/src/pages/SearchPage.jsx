import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Cards from "../components/Cards";
import DB from "../db/db";

const SearchPage = () => {
  const movies = DB();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const genres = ["all", ...new Set(movies.map((movie) => movie.genre))];
  const languages = ["all", ...new Set(movies.map((movie) => movie.language))];

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesType =
        selectedType === "all" || movie.type === selectedType;

      const matchesGenre =
        selectedGenre === "all" || movie.genre === selectedGenre;

      const matchesLanguage =
        selectedLanguage === "all" || movie.language === selectedLanguage;

      return (
        matchesSearch &&
        matchesType &&
        matchesGenre &&
        matchesLanguage
      );
    });
  }, [movies, search, selectedType, selectedGenre, selectedLanguage]);

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-semibold mb-6">Search</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <input
          type="text"
          placeholder="Search movies, TV series, anime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-[#111] border border-gray-700 outline-none"
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-3 rounded-lg bg-[#111] border border-gray-700 outline-none"
        >
          <option value="all">Type: All</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Series</option>
          <option value="anime">Anime</option>
        </select>

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-4 py-3 rounded-lg bg-[#111] border border-gray-700 outline-none"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              Genre: {genre === "all" ? "All" : genre}
            </option>
          ))}
        </select>

        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="px-4 py-3 rounded-lg bg-[#111] border border-gray-700 outline-none"
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              Language: {language === "all" ? "All" : language}
            </option>
          ))}
        </select>
      </div>

      <p className="text-gray-400 mb-6">
        {filteredMovies.length} title
        {filteredMovies.length !== 1 ? "s" : ""} found
      </p>

      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredMovies.map((movie) => (
            <Link key={movie.id} to={`/media/${movie.id}`}>
              <Cards
                title={movie.title}
                poster={movie.poster}
                year={movie.year}
                rating={movie.rating}
              />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No matching titles found.</p>
      )}
    </div>
  );
};

export default SearchPage;