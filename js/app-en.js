const apiKey = 'cb6472f0c3296329fdf02d0278e6e13b';
const yapiKey = 'AIzaSyCM8-kCU4VrJrUPLsjCz8FetLV7JesETCw';
var currentPage = 1;
var url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-EN&page=${currentPage}`;
const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-EN`;

async function getMovies(url) {
  try {
    clearMovies();
    const response = await fetch(url);
    const data = await response.json();
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
        movieCoverInner.classList.add('film__cover-inner');

        const movieCover = document.createElement('img');
        movieCover.classList.add('film__cover');
        movieCover.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
        movieCover.alt = movie.original_title;

        const movieCoverDarkened = document.createElement('div');
        movieCoverDarkened.classList.add('film__cover--darkened');

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('film__info');

        const movieTitle = document.createElement('div');
        movieTitle.classList.add('film__title');
        movieTitle.textContent = movie.title;

        const movieCategory = document.createElement('div');
        movieCategory.classList.add('film__category');
        movieCategory.textContent = movie.genre_ids.map(id => genres[id]).join(', ');

        const movieRating = document.createElement('div');
        movieRating.classList.add('film__rating');
        movieRating.textContent = movie.vote_average.toFixed(1);
        if (movie.vote_average >= 7) {
          movieRating.classList.add('film__rating--green');
        } else if (movie.vote_average >= 4) {
          movieRating.classList.add('film__rating--orange');
        } else if (movie.vote_average > 0) {
          movieRating.classList.add('film__rating--red');
        } else {
          movieRating.classList.add('film__without--rating');
          movieRating.textContent = '-';
        }

        movieCoverInner.addEventListener("click", () => openpopup(movie.id))

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
      exceptionDiv.textContent = 'Error: No movies found.';
      moviesContainer.appendChild(exceptionDiv);

      console.log("No results found");
    }
  } catch (error) {
    console.log(error);
  }
}

const newwinow = document.querySelector(".popup");

async function openpopup(movieId) {
  const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-EN`;
  const resp = await fetch(detailUrl);
  const detResp = await resp.json();
  const videoName = detResp.title + " Movie Trailer";
  let videoId = "";

  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    videoName
  )}&key=${yapiKey}`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const items = data.items;
    videoId = items[0].id.videoId;

    newwinow.classList.add("popup--show");
    document.body.classList.add("stop--scrolling");
    newwinow.innerHTML = `<div class="popup__card">    
        <iframe height="350" src="https://www.youtube-nocookie.com/embed/${videoId}?controls=0&autoplay=1" title="YouTube video player" allow="autoplay" frameborder="0"></iframe>
            <h2 class="popup__center">
            <span class="popup__movie--title">${detResp.title}</span> 
        </h2>
        <p class="popup__movie--tagline popup__center">
            <span class="popup__movie--tagline">${detResp.tagline}</span>
        </p>
        <ul class="popup__movie--info">
            <div class="loader"></div>
            <li class="popup__movie--genre"><span class="accent">Genre:</span> ${detResp.genres.map(
      (el) => ` <span>${el.name}</span>`
    )}</li>
            <li class="popup__movie--runtime"><span class="accent">Duration: </span>${detResp.runtime} minutes</li>
            <li class="popup__movie--link"><span class="accent">Rating: </span> ${detResp.vote_average} (${detResp.vote_count} votes)</li>
            <li class="popup__movie--overview"><span class="accent">Overview: </span>${detResp.overview}</li>
        </ul>
        <div class="popup__buttons">
          <button type="button" class="popup__button popup__button--close">Close</button>
        </div>
      </div>`;

    const buttonClose = document.querySelector(".popup__button--close");
    buttonClose.addEventListener("click", () => closepopup());
    const buttonPage = document.querySelector(".popup__button--page");
  } catch (error) {
    console.error("bad fetch: ", error);
  }
}

function closepopup() {
  newwinow.classList.remove("popup--show");
  newwinow.innerHTML = '';
  document.body.classList.remove("stop--scrolling");
}

window.addEventListener("click", (e) => {
  if (e.target === newwinow) {
    closepopup();
  }
})

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    closepopup();
  }
})

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

function handlenumberButtonClick(event) {
  if (event.target.classList.contains('number__button')) {
    const buttons = document.querySelectorAll('.number__button');
    buttons.forEach(button => button.classList.remove('number__active'));
    event.target.classList.add('number__active');
    clearMovies();
  }
}
const numberElements = document.querySelector('.number__elements');
numberElements.addEventListener('click', handlenumberButtonClick);

function handleNextPrevButtonClick(event) {
  if (event.target.classList.contains('number__next')) {
    checkMaxPage();
    const elements = document.querySelectorAll('.number__elements .number__button');
    const activeElement = document.querySelector('.number__elements .number__button.number__active');

    if (activeElement) {
      const nextElement = Array.from(elements).find(element => parseInt(element.innerText) > parseInt(activeElement.innerText));

      if (nextElement) {
        activeElement.classList.remove('number__active');
        nextElement.classList.add('number__active');
      }
    }
  }
  if (event.target.classList.contains('number__prev')) {
    checkMinPage();
    const elements = document.querySelectorAll('.number__elements .number__button');
    const activeElement = document.querySelector('.number__elements .number__button.number__active');

    if (activeElement) {
      const prevElement = Array.from(elements)
        .reverse()
        .find(element => parseInt(element.innerText) < parseInt(activeElement.innerText));

      if (prevElement) {
        activeElement.classList.remove('number__active');
        prevElement.classList.add('number__active');
      }
    }
  }
  clearMovies();
  var currentPageElement = document.querySelector(".number__active");
  var currentPage = currentPageElement.textContent;
  url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-EN&page=${currentPage}`;
  getMovies(url);
}
numberElements.addEventListener('click', handleNextPrevButtonClick);

function checkMaxPage() {
  const buttons = document.querySelectorAll('.number__button');
  let max = -Infinity;

  buttons.forEach(button => {
    const value = parseInt(button.textContent);
    if (!isNaN(value) && value > max) {
      max = value;
    }
  });

  const activeElement = document.querySelector('.number__active');
  const activeValue = parseInt(activeElement.textContent);

  if (activeValue === max) {
    const buttons = document.querySelectorAll('.number__button');

    buttons.forEach(button => {
      const value = parseInt(button.textContent);
      if (!isNaN(value)) {
        button.textContent = (value + 1).toString();
      }
    });
  }
}

function checkMinPage() {
  const activeElement = document.querySelector('.number__active');
  const buttons = document.querySelectorAll('.number__button');

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

var scrollButton = document.querySelector('.scroll');
scrollButton.addEventListener('click', function () {
  scrollToTop();
});

function scrollVisible() {
  var windowTop = window.pageYOffset || document.documentElement.scrollTop;
  var scrollButton = document.querySelector('.scroll');
  if (windowTop === 0 || window.innerWidth < 1450) {
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

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

async function searchMovies(event) {
  event.preventDefault();
  var queryEl = document.querySelector('.header__search');
  var query = queryEl.value;
  var number = document.querySelector('.number');
  number.style.display = 'none';
  if (query === "") {
    getMovies(url);
    scrollToTop();
    number.style.display = 'block';
  } else {
    searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-EN&query=${query}&page=${currentPage}&include_adult=false`;
    getMovies(searchUrl);
    scrollToTop();
  }
}
