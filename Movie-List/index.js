const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let selectedmovie = []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const MOVIES_PER_PAGE = 12
const paginator = document.querySelector('#paginator')
const cardbutton = document.querySelector('#cardbutton')
const rowbutton = document.querySelector('#rowbutton')

function renderMovieList2(data) {
  let rawHTML = ""
  rawHTML = `<table class="table"><tbody>`
  data.forEach((item) => {
    rawHTML += `
      <tr>
        <th scope="row">
          <h3>${item.title}</h3>
        </th>
        <td></td>
        <td></td>
        <td></td>
        <td><button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
            data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </td>
      </tr>
   `
  })
  rawHTML += `</tbody></table>`
  dataPanel.innerHTML = rawHTML
}

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
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
  `})
  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ""
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML;
}

function getMovieByPage(page) {
  const moviedata = selectedmovie.length ? selectedmovie : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return moviedata.slice(startIndex, page * MOVIES_PER_PAGE)
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('This movie has already been added.')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  if (!keyword.length) {
    return alert('請輸入有效字串!')
  }
  selectedmovie = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  if (selectedmovie.length === 0) {
    return alert('Cannot find movies with your keyword: ' + keyword)
  }
  renderMovieList(getMovieByPage(1))
  renderPaginator(selectedmovie.length)
})

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function (event) {
  if (event.target.tagName !== "A") return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMovieByPage(page))
})

cardbutton.addEventListener('click', function (event) {
  console.log(1)
  renderPaginator(movies.length)
  renderMovieList(getMovieByPage(1))
})

rowbutton.addEventListener('click', function (event) {
  console.log(2)
  renderPaginator(movies.length)
  renderMovieList2(getMovieByPage(1))
})

axios.get(INDEX_URL).then((response) => {
  movies.push(...response.data.results)
  renderPaginator(movies.length)
  renderMovieList(getMovieByPage(1))
})
  .catch((err) => console.log(err))