const express = require("express")
const router = express.Router()
const {
  getAllMovies,
  getMovie,
  searchMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  moviePhotoUpload
} = require("../controllers/movies")
const Movie = require("../models/movie")
const advancedResults = require("../middleware/advancedResults")
const { protect } = require("../middleware/auth")

// Routes for movies
router.route("/search").get(searchMovie)
router
  .route("/")
  .get(advancedResults(Movie), getAllMovies)
  .post(protect, createMovie)
router.route("/:id/photo").put(protect, moviePhotoUpload)
router
  .route("/:id")
  .get(getMovie)
  .put(protect, updateMovie)
  .delete(protect, deleteMovie)

module.exports = router
