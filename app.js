const path = require("path")
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const colors = require("colors")
const fileupload = require("express-fileupload")
const errorHandler = require("./middleware/error")
const connectDB = require("./config/db")

// Routes
const movieRoutes = require("./routes/movies")
const authRoutes = require("./routes/auth")

// Load env vars
dotenv.config({ path: "./config/config.env" })

// Connect to database
connectDB()

const app = express()

// Allow all origins to access your API (for development purposes)
app.use(cors())

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// File uploading
app.use(fileupload())

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

// Mount routes
app.use("/api/v1/movies", movieRoutes)
app.use("/api/v1/auth", authRoutes)

app.use(errorHandler)

// Start Server
const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)

// Handle unhandled promise rejection
// process.on("unhandledRejection", (err, promise) => {
//   console.log(`Error: ${err.message}`.red)
//   // Close server & exit process
//   app.close(() => process.exit(1))
// })
