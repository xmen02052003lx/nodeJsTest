const mongoose = require("mongoose")

const MovieSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: [true, "Please add a name"] },
  time: { type: Number, required: [true, "Please add a time"] },
  year: { type: Number, required: [true, "Please add a year"] },
  introduce: { type: String, required: [true, "Please add an introduction"] },
  image: {
    type: String,
    default: "no-photo.jpg"
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
})

module.exports = mongoose.model("Movie", MovieSchema)
