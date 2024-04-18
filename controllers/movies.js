const path = require("path")
const ErrorResponse = require("../util/errorResponse")
const asyncHandler = require("../middleware/async")
const Movie = require("../models/movie")

// @desc    Get all movies
// @route   GET /api/v1/movies
// @access  Public
const getAllMovies = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Get a single movie
// @route   GET /api/v1/movie/:id
// @access  Public
const getMovie = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id)

  if (!movie) {
    // make sure to "return" because only 1 res is allowed
    return next(
      new ErrorResponse(`Movie not found with id of ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ success: true, data: movie })
})

// @desc    Search for movie's name based on keyword
// @route   GET /api/v1/movies/search?keyword={keyword}
// @access  Public
const searchMovie = asyncHandler(async (req, res, next) => {
  const keyword = req.query.keyword
  const movies = await Movie.find({ name: { $regex: keyword, $options: "i" } })
  res.status(200).json({ success: true, data: movies })
})

// @desc    Create new movie
// @route   POST /api/v1/movies
// @access  Private
const createMovie = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id

  const movie = await Movie.create(req.body)
  res.status(201).json({ success: true, data: movie })
})
// @desc    Update movie
// @route   PUT /api/v1/movies/:id
// @access  Private
const updateMovie = asyncHandler(async (req, res, next) => {
  let movie = await Movie.findById(req.params.id)

  if (!movie) {
    return next(
      new ErrorResponse(`Movie not found with id of ${req.params.id}`, 404)
    )
  }

  // Make sure user is movie owner
  if (movie.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this movie `,
        401
      )
    )
  }

  movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({ success: true, data: movie })
})

// @desc    Delete a single movie
// @route   DELETE /api/v1/movies/:id
// @access  Private
const deleteMovie = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id)

  if (!movie) {
    return next(
      new ErrorResponse(`Movie not found with id of ${req.params.id}`, 404)
    )
  }

  // Make sure user is movie owner
  if (movie.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this movie `,
        401
      )
    )
  }

  await movie.deleteOne()

  res.status(200).json({ success: true, data: {} })
})

// @desc    Upload photo for movie
// @route   PUT /api/v1/movies/:id/photo
// @access  Private
const moviePhotoUpload = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id)

  if (!movie) {
    return next(
      new ErrorResponse(`Movie not found with id of ${req.params.id}`, 404)
    )
  }

  // Make sure user is movie owner
  if (movie.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this movie `,
        401
      )
    )
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400))
  }
  const file = req.files.file

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400))
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    )
  }

  // Create custom filename
  file.name = `photo_${movie._id}${path.parse(file.name).ext}`

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.err(err)
      return next(new ErrorResponse(`Problem with file upload`, 500))
    }

    await Movie.findByIdAndUpdate(req.params.id, { image: file.name })

    res.status(200).json({
      success: true,
      data: file.name
    })
  })
})

module.exports = {
  getAllMovies,
  getMovie,
  searchMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  moviePhotoUpload
}
