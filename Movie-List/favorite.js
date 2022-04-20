const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
const dataPanel = document.querySelector('#data-panel')

function renderMovieList(data) {
  let rawHTML = ""
  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="MoviePosters">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
          </div>
          <div class="card-footer">
            <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
              data-bs-target="#movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
          </div>
        </div>
      </div>
  `
  })
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modaltitle = document.querySelector('#movie-modal-title')
  const modalimg = document.querySelector('#movie-modal-img')
  const modaldate = document.querySelector('#movie-modal-date')
  const modalcontent = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL).then((response) => {
    const content = response.data.results[id - 1]
    modaltitle.innerText = content.title
    modalimg.src = POSTER_URL + content.image
    modaldate.innerText = `release date:` + content.release_date
    modalcontent.innerText = content.description

  })
}

function removefromFavorite(id) {
  if (!movies || !movies.length) return
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removefromFavorite(Number(event.target.dataset.id))
  }
})

renderMovieList(movies)