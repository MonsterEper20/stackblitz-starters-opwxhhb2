process.chdir(__dirname);

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data
let movies = [];
let reviews = [];
let comments = [];
let users = [];

// ====================== ROUTES ======================

app.get('/', (req, res) => {
  res.send('🎬 Movie API is running! Try /movies');
});

// Get all movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

// Get single movie
app.get('/movies/:id', (req, res) => {
  const movie = movies.find(m => m.id == req.params.id);
  if (movie) {
    res.json(movie);
  } else {
    res.status(404).json({ message: "Movie not found" });
  }
});

// Create movie
app.post('/movies', (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const movie = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description || "",
    whereToWatch: req.body.whereToWatch || []
  };

  movies.push(movie);
  res.status(201).json(movie);
});

// Reviews
app.get('/reviews/:movieId', (req, res) => {
  const movieReviews = reviews.filter(r => r.movieId == req.params.movieId);
  res.json(movieReviews);
});

app.post('/reviews', (req, res) => {
  if (!req.body.movieId || !req.body.rating) {
    return res.status(400).json({ message: "movieId and rating are required" });
  }

  const review = {
    id: Date.now(),
    movieId: req.body.movieId,
    user: req.body.user || "Anonymous",
    rating: Number(req.body.rating),
    text: req.body.text || ""
  };

  reviews.push(review);
  res.status(201).json(review);
});

// Average Rating
app.get('/movies/:id/average-rating', (req, res) => {
  const movieReviews = reviews.filter(r => r.movieId == req.params.id);
  if (movieReviews.length === 0) {
    return res.json({ average: 0, message: "No reviews yet" });
  }
  const avg = movieReviews.reduce((sum, r) => sum + r.rating, 0) / movieReviews.length;
  res.json({ average: Math.round(avg * 10) / 10 });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Movie API Server is running on http://localhost:${PORT}`);
  console.log(`📍 Open this link to test: http://localhost:${PORT}/movies`);
});