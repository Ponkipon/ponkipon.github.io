const apiKey = '31f6246705fead5778179a71d5408a0a';
var currentPage = 1;
var url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-EN&page=${currentPage}`;
const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-EN`;
var searchUrl;

async function getMovies(url) {
  try {
    clearMovies();
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (data.results.length > 0) {
      const genresResponse = await fetch(genreUrl);
      const genresData = await genresResponse.json();
      const genres = genresData.genres.reduce((obj, item) => ({
        ...obj,
        [item.id]: item.name
      }), {});

      const moviesContainer = document.querySelector('.movies');

      data.results.forEach(movie => {

      const movieCard = document.createElement('div');
      movieCard.classList.add('movie');

      const movieCoverInner = document.createElement('div');
      movieCoverInner.classList.add('movie__cover-inner');

      const movieCover = document.createElement('img');
      movieCover.classList.add('movie__cover');
      movieCover.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
      movieCover.alt = movie.original_title;

      const movieCoverDarkened = document.createElement('div');
      movieCoverDarkened.classList.add('movie__cover--darkened');

      const movieInfo = document.createElement('div');
      movieInfo.classList.add('movie__info');

      const movieTitle = document.createElement('div');
      movieTitle.classList.add('movie__title');
      movieTitle.textContent = movie.title;

      const movieCategory = document.createElement('div');
      movieCategory.classList.add('movie__category');
      movieCategory.textContent = movie.genre_ids.map(id => genres[id]).join(', ');

      const movieRating = document.createElement('div');
      movieRating.classList.add('movie__rating');
      movieRating.textContent = movie.vote_average.toFixed(1);
      if (movie.vote_average >= 7) {
        movieRating.classList.add('movie__rating--green');
      } else if (movie.vote_average >= 4) {
        movieRating.classList.add('movie__rating--orange');
      } else if (movie.vote_average > 0) {
        movieRating.classList.add('movie__rating--red');
      } else {
        movieRating.classList.add('movie__without--rating');
        movieRating.textContent = '-';
      }

      movieCoverInner.addEventListener("click", () => openModal(movie.id))

      movieCoverInner.appendChild(movieCover);
      movieCoverInner.appendChild(movieCoverDarkened);
      movieInfo.appendChild(movieTitle);
      movieInfo.appendChild(movieCategory);
      movieInfo.appendChild(movieRating);
      movieCard.appendChild(movieCoverInner);
      movieCard.appendChild(movieInfo);

      moviesContainer.appendChild(movieCard);
    });
  } else {
const moviesContainer = document.querySelector('.movies');
const exceptionDiv = document.createElement('div');
exceptionDiv.classList.add('exception');
exceptionDiv.textContent = 'Помилка: не знайдено жодного фільму.';
moviesContainer.appendChild(exceptionDiv);

    console.log("Немає результатів");
  }
} catch (error) {
  console.log(error);
}
}

const modalEl = document.querySelector(".modal");

async function openModal(movieId) {
  console.log(movieId);
  const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}}?api_key=${apiKey}&language=en-EN`;
  const resp = await fetch(detailUrl);
  const detResp = await resp.json();

  console.log(detResp);

  modalEl.classList.add("modal--show");
  document.body.classList.add("stop--scrolling");
  modalEl.innerHTML = `<div class="modal__card">
  <img src="${`https://image.tmdb.org/t/p/w500/${detResp.backdrop_path}`}" alt="" class="modal__movie--backdrop">
  <h2 class="modal__center">
      <span class="modal__movie--title">${detResp.title}</span> 
  </h2>
  <p class="modal__movie--tagline modal__center">
      <span class="modal__movie--tagline">${detResp.tagline}</span>
  </p>
  <ul class="modal__movie--info">
      <div class="loader"></div>
      <li class="modal__movie--genre"><span class="accent">Genre:</span> ${detResp.genres.map((el)=>` <span>${el.name}</span>`)}</li>
      <li class="modal__movie--runtime"><span class="accent">Duration: </span>${detResp.runtime} minutes</li>
      <li class="modal__movie--link"><span class="accent">Rating: </span> ${detResp.vote_average.toFixed(2)} (${detResp.vote_count} votes)</li>
      <li class="modal__movie--overview"><span class="accent">Overview: </span>${detResp.overview}</li>
  </ul>
  <div class="modal__buttons">
    <button type="button" class="modal__button modal__button--close">Close</button>
    <a href="./en/movie.html" target="_blank"><button type="button" class="modal__button modal__button--page">To page</button></a>
  </div>
  </div>`
  const buttonClose = document.querySelector(".modal__button--close");
  buttonClose.addEventListener("click", () => closeModal())
  const buttonPage = document.querySelector(".modal__button--page");
  buttonPage.addEventListener("click", () => logId(movieId))
}

function logId(movieId) {
  localStorage.setItem('movieId', `${movieId}`)
  console.log(movieId)
}

getMovies(url);
const moviesContainer = document.querySelector('.movies');

function clearMovies() {
  var elements = document.getElementsByClassName("movie");
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
const exceptionElements = document.querySelectorAll('.exception');

exceptionElements.forEach(element => {
  element.remove();
});

  
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function closeModal() {
  modalEl.classList.remove("modal--show");
  document.body.classList.remove("stop--scrolling");
}

window.addEventListener("click", (e) => {
  if (e.target === modalEl) {
    closeModal();
  }
})

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    closeModal();
  }
})

function handlePaginationButtonClick(event) {
  if (event.target.classList.contains('pagination__button')) {
    const buttons = document.querySelectorAll('.pagination__button');
    buttons.forEach(button => button.classList.remove('pagination__active'));
    event.target.classList.add('pagination__active');
    clearMovies();
  }
}
const paginationElements = document.querySelector('.pagination__elements');
paginationElements.addEventListener('click', handlePaginationButtonClick);

function handleNextPrevButtonClick(event) {
  if (event.target.classList.contains('pagination__next')) {
    checkMaxPage();
    const elements = document.querySelectorAll('.pagination__elements .pagination__button');
    const activeElement = document.querySelector('.pagination__elements .pagination__button.pagination__active');

    if (activeElement) {
      const nextElement = Array.from(elements).find(element => parseInt(element.innerText) > parseInt(activeElement.innerText));

      if (nextElement) {
        activeElement.classList.remove('pagination__active');
        nextElement.classList.add('pagination__active');
      }
    }
  }
  if (event.target.classList.contains('pagination__prev')) {
    checkMinPage();
    const elements = document.querySelectorAll('.pagination__elements .pagination__button');
    const activeElement = document.querySelector('.pagination__elements .pagination__button.pagination__active');

    if (activeElement) {
      const prevElement = Array.from(elements)
        .reverse()
        .find(element => parseInt(element.innerText) < parseInt(activeElement.innerText));

      if (prevElement) {
        activeElement.classList.remove('pagination__active');
        prevElement.classList.add('pagination__active');
      }
    }
  }
  clearMovies();
  var currentPageElement = document.querySelector(".pagination__active");
  var currentPage = currentPageElement.textContent;
  url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-EN&page=${currentPage}`;
  getMovies(url);
}
paginationElements.addEventListener('click', handleNextPrevButtonClick);

function checkMaxPage() {
  const buttons = document.querySelectorAll('.pagination__button');
  let max = -Infinity;

  buttons.forEach(button => {
    const value = parseInt(button.textContent);
    if (!isNaN(value) && value > max) {
      max = value;
    }
  });

  const activeElement = document.querySelector('.pagination__active');
  const activeValue = parseInt(activeElement.textContent);

  if (activeValue === max) {
    const buttons = document.querySelectorAll('.pagination__button');

    buttons.forEach(button => {
      const value = parseInt(button.textContent);
      if (!isNaN(value)) {
        button.textContent = (value + 1).toString();
      }
    });
  }
}

function checkMinPage() {
  const activeElement = document.querySelector('.pagination__active');
  const buttons = document.querySelectorAll('.pagination__button');

  const activeElementValue = parseInt(activeElement.textContent);
  let smallestButtonValue = Infinity;

  buttons.forEach(button => {
    const buttonValue = parseInt(button.textContent);
    if (!isNaN(buttonValue) && buttonValue < smallestButtonValue) {
      smallestButtonValue = buttonValue;
    }
  });

  if (activeElementValue === smallestButtonValue && smallestButtonValue >= 2) {
    buttons.forEach(button => {
      const value = parseInt(button.textContent);
      if (!isNaN(value)) {
        button.textContent = (value - 1).toString();
      }
    });
  }
}

var scrollButton = document.querySelector('.scroll__button');
scrollButton.addEventListener('click', function () {
  scrollToTop();
});

function scrollVisible() {
  var windowTop = window.pageYOffset || document.documentElement.scrollTop;
  var scrollButton = document.querySelector('.scroll__button');
  if (windowTop === 0) {
    scrollButton.style.display = 'none';
  } else {
    scrollButton.style.display = 'block';
  }
}
window.addEventListener('scroll', function (event) {
  scrollVisible();
});

window.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
    searchMovies(event);
  }
});


async function searchMovies(event) {
  event.preventDefault();
  var queryEl = document.querySelector('.header__search');
  var query = queryEl.value;
  var pagination = document.querySelector('.pagination');
  pagination.style.display = 'none';
  if (query === "") {
    getMovies(url);
    scrollToTop();
    pagination.style.display='block';
  } else {
    searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-EN&query=${query}&page=${currentPage}&include_adult=false`;
    getMovies(searchUrl);
    scrollToTop();
  }
}