const apiKey = '31f6246705fead5778179a71d5408a0a';
var currentPage = 1;
var url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-EN&page=${currentPage}`;
const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-EN`;


function changeBackground() {
  var images = [
    `url("../images/backdrop_avatar.jpg")`,
    `url("../images/backdrop_guardiansOfTheGalaxy.jpg")`,
    `url("../images/backdrop_quantomania.jpeg")`,
    `url("../images/backdrop_shazam.jpg")`,
    `url("../images/backdrop_johnwick.jpg")`
  ];
  var currentImageIndex = 0;
  var body = document.querySelector("body");
  var backgroundElement = document.createElement("div");
  backgroundElement.className = "background__backdrop";
  body.appendChild(backgroundElement);
  
  body.style.backgroundImage = images[4];
  body.style.backgroundSize = "cover";
  body.style.backgroundAttachment = "fixed";

  setInterval(function() {
    backgroundElement.style.opacity = 1;
    setTimeout(function() {
      body.style.backgroundImage = images[currentImageIndex];
      currentImageIndex++;
      if (currentImageIndex === images.length) {
        currentImageIndex = 0;
      }
      setTimeout(function() {
        backgroundElement.style.opacity = 0;
      }, 800); 
    }, 1000); 
  }, 10000); 
}
changeBackground();

function getId () {
  var movieId = localStorage.getItem('movieId');
  console.log(movieId);
  openModal(movieId);
}

getId();  
const modalEl = document.querySelector(".movie");

async function openModal(movieId) {
  console.log(movieId);
  const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}}?api_key=${apiKey}&language=en-EN`;
  const resp = await fetch(detailUrl);
  const detResp = await resp.json();

  console.log(detResp);

  modalEl.classList.add("movie__card");
  document.body.classList.add("stop--scrolling");
  if (detResp.budget ===0)
  {
    var budget = "No information"
  } else{
    var budget = detResp.budget + "$";
  }
  if (detResp.overview === '')
  {
    var overview = "No information";
  } else{
    var overview = detResp.overview;
  }
  modalEl.innerHTML = `<div class="backdrop__styles">
  <img src="${`https://image.tmdb.org/t/p/original/${detResp.backdrop_path}`}" class="movie__backdrop"></img>
  <div class="movie__backdrop--darkened"></div>
</div>
<h1 class="movie__h"><span class="movie__title">${detResp.original_title}</span></h1>
<div class="movie__info">
  <img src="${`https://image.tmdb.org/t/p/original/${detResp.poster_path}`}" alt="" class="movie__poster">
  <div class="movie__info--text">
      <div class="loader"></div>
      <p class="movie__genre"><span class="accent">Genre:</span>${detResp.genres.map((el)=>` <span>${el.name}</span>`)}</p>
      <p class="movie__runtime"><span class="accent">Duration: </span>${detResp.runtime} minutes</p>
      <p class="movie__rating"><span class="accent">Rating: </span>${detResp.vote_average} (${detResp.vote_count} votes)</p>
      <p class="movie__companies"><span class="accent">Company:</span>${detResp.production_companies.map((el)=>` <span>${el.name}</span>`)}</p>
      <p class="movie__budget"><span class="accent">Budget: </span>${budget}</p>
      <p class="movie__overview"><span class="accent">Overview: </span><p>${overview}</p></p>
  </div>
</div>`
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
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
window.addEventListener('scroll', function(event) {
  scrollVisible();
});
