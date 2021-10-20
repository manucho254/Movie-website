// Always hide your api key
// const  APIKEY = '04c35731a5ee918f014970082a0088b1';
const APIMOVIEURL =  'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=';
const APITVSERIESURL = 'https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=';
const IMGPATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHMOVIEAPI = 'https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=';
const SEARCHSERIESAPI = 'https://api.themoviedb.org/3/search/tv?&api_key=04c35731a5ee918f014970082a0088b1&query='

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tvSeries = document.getElementById("tvSeries");
const movies = document.getElementById("movies");
const nextPage = document.getElementById("next");
const prevPage = document.getElementById("prev");
const myMovies = document.getElementById("../movieId")
console.log(myMovies)
let image = "empty.jpg";


// initially get movies 

getTvSeries(APITVSERIESURL);
getMovies(APIMOVIEURL);

tvSeries.addEventListener("click",  () => {
    main.innerHTML = ''
    getTvSeries(APITVSERIESURL)
    main.classList.add("series")
    main.classList.remove("movies")
})

movies.addEventListener("click",  () => {
    main.innerHTML = ''
    getMovies(APIMOVIEURL)
    main.classList.add("movies")
    main.classList.remove("series")
})


async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    showMovies(respData.results)
}

async function getTvSeries(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    showTvSeries(respData.results)

}

// get all Movies

function showMovies(movies) {

    main.innerHTML = '';

    movies.forEach((movie) => {

        const {poster_path,title,vote_average,overview, release_date, id} = movie
        const movieEl = document.createElement("div");
        movieEl.classList.add('movie');

        if (poster_path != null) {
            movieEl.innerHTML = 
            `<span class="year">${release_date}</span>
             <img src="${IMGPATH + poster_path}" alt="${title}">
            <div class="movie-info">
               <h3>${title}</h3>
               <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
            <button class="trailer" id="allTrailers">Trailer : &#9654;</button>
              <h3>Overview: </h3>
                ${overview}
            </div>`
        }else {
            movieEl.innerHTML = 
            `<img src="${image.jpg}" alt="${title}">
            <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
              <h3>Overview: </h3>
                ${overview}
            </div>`
        }
        main.appendChild(movieEl)
    });
}

// get all Tv series

function showTvSeries(movies) {

    main.innerHTML = '';

    movies.forEach((movie) => {

        const {poster_path,name,vote_average, overview, first_air_date} = movie;
        const movieEl = document.createElement("div");
        movieEl.classList.add('movie');

        if (poster_path != null) {
            movieEl.innerHTML = 
            `<span class="year">${first_air_date}</span>
            <img src="${IMGPATH + poster_path}" alt="${name}">
            <div class="movie-info">
            <h3>${name}</h3>
            <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
               <h3>Overview: </h3>
                 ${overview}
            </div>`

        }else {
            movieEl.innerHTML = 
            `<img src="${image}" alt="${name}">
            <div class="movie-info">
            <h3>${name}</h3>
            <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
              <h3>Overview: </h3>
                ${overview}
            </div>`
        }
        main.appendChild(movieEl)
    });
}

function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    }else if (vote >= 5) {
        return 'orange';
    }else {
        return 'red';
    }
}

// search
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm){
        getTvSeries(SEARCHSERIESAPI + searchTerm);
        getMovies(SEARCHMOVIEAPI + searchTerm);
        search.value = '';
        
    }else if(searchTerm === ""){
        const notFound = document.createElement("h3");
        notFound.classList.add("notfound");
        notFound.innerHTML =  `${searchTerm } search cannot be empty`;
        main.appendChild(notFound)
    }
});

// pagination 


let index = 1;

nextPage.addEventListener("click", () => {
    index++;
    if (main.classList == "series") {
        getTvSeries(APITVSERIESURL + index);
    }else{
        getMovies(APIMOVIEURL + index);
    }
});

prevPage.addEventListener("click", () => {
    if (index > 1 ){
        index--;
        if (main.classList == "series") {
            getTvSeries(APITVSERIESURL + index);
        }else {
            getMovies(APIMOVIEURL + index);
        };

    }else{
        if (main.classList == "series") {
            getTvSeries(APITVSERIESURL + index);
        }else{
            getMovies(APIMOVIEURL + index);}
    };

});



