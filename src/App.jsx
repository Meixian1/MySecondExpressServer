import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [editMovieId, setEditMovieId] = useState(null);

  useEffect(() => {
    // Fetch all movies when the component mounts
    axios
      .get("http://localhost:3001/movies")
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleEditTitleChange = (movieId, newValue) => {
    const updatedMovies = movies.map((movie) => {
      if (movie.id === movieId) {
        return { ...movie, title: newValue };
      }
      return movie;
    });

    setMovies(updatedMovies);
  };

  const handleEditDirectorChange = (movieId, newValue) => {
    const updatedMovies = movies.map((movie) => {
      if (movie.id === movieId) {
        return { ...movie, director: newValue };
      }
      return movie;
    });

    setMovies(updatedMovies);
  };

  const handleEditYearChange = (movieId, newValue) => {
    const updatedMovies = movies.map((movie) => {
      if (movie.id === movieId) {
        return { ...movie, year: newValue };
      }
      return movie;
    });

    setMovies(updatedMovies);
  };

  const handleSearch = () => {
    axios
      .get(`http://localhost:3001/search?title=${searchQuery}`)
      .then((response) => {
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.error("Error searching for movies:", error);
      });
  };

  const handleAddMovie = () => {
    const newMovie = {
      title: "New Movie Title",
      director: "Director Name",
      year: 2023,
    };
  
    axios
      .post("http://localhost:3001/movies", newMovie)
      .then((response) => {
        setMovies([...movies, response.data]);
      })
      .catch((error) => {
        console.error("Error adding a movie:", error);
      });
  };

  const handleDeleteMovie = (movieId) => {
    axios
      .delete(`http://localhost:3001/movies/${movieId}`)
      .then(() => {
        setMovies(movies.filter((movie) => movie.id !== movieId));
      })
      .catch((error) => {
        console.error("Error deleting a movie:", error);
      });
  };

  const toggleEditMode = (movieId) => {
    setEditMovieId(editMovieId === movieId ? null : movieId);
  };

  const handleUpdateMovie = (movieId, updatedMovie) => {
    axios
      .put(`http://localhost:3001/movies/${movieId}`, updatedMovie)
      .then((response) => {
        setMovies(movies.map((movie) => (movie.id === movieId ? response.data : movie)));
        setEditMovieId(null);
      })
      .catch((error) => {
        console.error("Error editing a movie:", error);
      });
  };

  const handleCancelEdit = () => {
    setEditMovieId(null);
  };

  return (
    <>
      <h1>My Movies App</h1>
      <div>
        <input
          type="text"
          placeholder="Search by Title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {searchResults.length > 0 ? (
        searchResults.map((movie) => (
          <div key={movie.id}>
            <div>Title: {movie.title}</div>
            <div>Director: {movie.director}</div>
            <div>Year: {movie.year}</div>
          </div>
        ))
      ) : (
        movies.map((movie) => (
          <div key={movie.id}>
            <div>Id: {movie.id}</div>
            {editMovieId === movie.id ? (
              <div>
                <input
                  type="text"
                  value={movie.title}
                  onChange={(e) => handleEditTitleChange(movie.id, e.target.value)}
                />
                <input
                  type="text"
                  value={movie.director}
                  onChange={(e) => handleEditDirectorChange(movie.id, e.target.value)}
                />
                <input
                  type="number"
                  value={movie.year}
                  onChange={(e) => handleEditYearChange(movie.id, e.target.value)}
                />
                <button onClick={() => handleUpdateMovie(movie.id, movie)}>Update</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <div>Title: {movie.title}</div>
                <div>Director: {movie.director}</div>
                <div>Year: {movie.year}</div>
                <button onClick={() => toggleEditMode(movie.id)}>Edit</button>
                <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
              </div>
            )}
          </div>
        ))
      )}
      <button onClick={handleAddMovie}>Add Movie</button>
    </>
  );
}

export default App;
