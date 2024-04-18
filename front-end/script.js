let currentPage = 1
const moviesPerPage = 4 // Number of movies per page

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await renderMovies(currentPage)
  } catch (error) {
    console.error("Error fetching movies:", error)
  }

  // Event listener for next button
  document.getElementById("nextBtn").addEventListener("click", () => {
    currentPage++
    renderMovies(currentPage)
  })

  // Event listener for previous button
  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--
      renderMovies(currentPage)
    }
  })
})

async function renderMovies(page) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/movies?page=${page}&limit=${moviesPerPage}`
    )
    const { data, pagination } = await response.json()
    console.log("this is pagination: ")
    console.log(pagination)
    displayMovies(data)

    // Enable/disable pagination buttons based on current page
    const prevBtn = document.getElementById("prevBtn")
    const nextBtn = document.getElementById("nextBtn")

    if (!pagination.prev) prevBtn.disabled = true
    else prevBtn.disabled = false
    if (!pagination.next) nextBtn.disabled = true
    else nextBtn.disabled = false
  } catch (error) {
    console.error("Error fetching movies:", error)
  }
}

function displayMovies(movies) {
  const movieGrid = document.getElementById("movieGrid")
  movieGrid.innerHTML = "" // Clear previous content

  movies.forEach(movie => {
    if (movie.image.startsWith("photo_"))
      movie.image = "../public/uploads/" + movie.image
    const moviePoster = document.createElement("img")
    moviePoster.src = movie.image
    moviePoster.alt = movie.name
    moviePoster.className = "movie-poster img-fluid"
    moviePoster.addEventListener("click", () => displayMovieDetails(movie))
    const info = document.createElement("div")
    const info2 = document.createElement("div")
    info.innerHTML = movie.name
    info2.innerHTML = `${movie.time} min, ${movie.year}`
    // Apply styles to info (movie name)
    info.style.fontSize = "1.4em" // Larger font size
    info.style.fontWeight = "400" // Bold text

    // Apply styles to info2 (movie time and year)
    info2.style.opacity = "0.8" // Semi-transparent (0.8 opacity)

    const col = document.createElement("div")
    col.className = "col-md-3 mb-4"
    col.appendChild(moviePoster)
    col.appendChild(info)
    col.appendChild(info2)

    movieGrid.appendChild(col)
  })
}

function displayMovieDetails(movie) {
  const modalBody = document.getElementById("modalBody")
  modalBody.innerHTML = `
  <div class='container'>
    <div class='row'>
     <div class='col-md-6'>
        <img src="${movie.image}" alt="${movie.name}" class="img-fluid mb-3">
      </div>
      <div class='col-md-6'>
        <p><strong>Name:</strong> ${movie.name}</p>
        <p><strong>Year:</strong> ${movie.year}</p>
        <p><strong>Time:</strong> ${movie.time} minutes</p>
        <p><strong>Introduce:</strong> ${movie.introduce}</p>
        <button class='btn-danger'>PLAY BUTTON</button>
       </div>
    </div>
   </div>
    `

  //$("#movieModal").modal("show") // Show the modal
  // Event listener to prevent modal backdrop click from closing the modal
  $("#movieModal").modal({
    backdrop: "static",
    keyboard: false
  })
}
