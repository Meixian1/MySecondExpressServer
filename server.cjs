const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const PORT = 3001;
const app = express();

let counter = 1;

let movies = [
  { id: counter++, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: counter++, title: "Interstellar", director: "Christopher Nolan", year: 2014 },
  { id: counter++, title: "Parasite", director: "Bong Joon-ho", year: 2019 },
  { id: counter++, title: "The Matrix", director: "The Wachowskis", year: 1999 }
];

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Movie API! Use /info for guidance.");
});

app.get("/info", (req, res) => {
  res.send(
    "To fetch all movies, use GET /movies. To add a new movie, use POST /movies. To update or delete a movie, use PUT or DELETE on /movies/:id respectively."
  );
});

app.get("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find((m) => m.id === id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ error: "Movie not found" });
  }
});

app.delete("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = movies.findIndex((m) => m.id === id);
  if (index !== -1) {
    movies.splice(index, 1);
    res.json({ message: "Movie deleted" });
  } else {
    res.status(404).json({ error: "Movie not found" });
  }
});

app.post("/movies", (req, res) => {
  const newMovie = req.body;
  newMovie.id = counter++;
  movies.push(newMovie);
  res.json(newMovie);
});

app.put("/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const movieToUpdate = movies.find((movie) => movie.id === id);
  if (!movieToUpdate) {
    return res.status(404).json({ error: "Movie not found" });
  }
  if (req.body.title) {
    movieToUpdate.title = req.body.title;
  }
  if (req.body.director) {
    movieToUpdate.director = req.body.director;
  }
  if (req.body.year) {
    movieToUpdate.year = req.body.year;
  }
  res.json(movieToUpdate);
});

app.get("/search", (req, res) => {
  const titleQuery = req.query.title;
  if (!titleQuery) {
    return res.status(400).json({ error: "Title query parameter is required" });
  }
  const matchingMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(titleQuery.toLowerCase())
  );
  if (matchingMovies.length === 0) {
    return res.status(404).json({ error: "No movies found with the specified title" });
  }
  res.json(matchingMovies);
});

app.listen(PORT, () => {
  console.log(`Server live on PORT ${PORT}`);
});
