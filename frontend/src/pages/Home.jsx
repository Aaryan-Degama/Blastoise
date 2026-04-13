import React from 'react';
import Cards from '../components/Cards'; // Make sure this path is correct
import DB from '../db/db';

const Home = () => {
  const movies = DB();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {movies.map((movie) => (
        <Cards 
          key={movie.id}
          title={movie.title}
          poster={movie.poster}
          year={movie.year}
          rating={movie.rating}
        />
      ))}
    </div>
  );
};

export default Home;