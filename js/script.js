// Always hide your api key
// This a dev community api so no need to hide it APIKEY = '04c35731a5ee918f014970082a0088b1';
// we will take care of the api soon
const APIMOVIEURL =  'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=';
const APITVSERIESURL = 'https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=';
const SEARCHMOVIEAPI = 'https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=';
const SEARCHSERIESAPI = 'https://api.themoviedb.org/3/search/tv?&api_key=04c35731a5ee918f014970082a0088b1&query='
const iframeMovieLink = "https://autoembed.xyz/movie/tmdb/";
const iframeSeriesLink = "https://autoembed.xyz/tv/tmdb/";
const TvSeriesurl = "https://api.themoviedb.org/3/tv/"
const IMGPATH = 'https://image.tmdb.org/t/p/w1280';
const apiKey = "?api_key=04c35731a5ee918f014970082a0088b1&language=en-US";

// getting some of my elements

const selectSeriesEpesisode = document.createElement("select");
const playOverview = document.getElementById("play-overview");
const paginated = document.getElementById("pagination");
const selectSeason = document.createElement("select");
const playContentData = document.createElement("div");
const tvSeries = document.getElementById("tvSeries");
const search = document.getElementById("search");
const movies = document.getElementById("movies");
const nextPage = document.getElementById("next");
const prevPage = document.getElementById("prev");
const movieTitle = document.createElement("div");
const main = document.getElementById("main");
const form = document.getElementById("form");
const iframe = document.createElement("div");

selectSeriesEpesisode.classList.add("select-dropdown");
selectSeason.classList.add('select-dropdown');
iframe.classList.add("iframeSizing");
movieTitle.classList.add("iframes");

let image = "empty.jpg"; // this is for movies that dont have images


getTvSeries(APITVSERIESURL);
getMovies(APIMOVIEURL);

// get only Tv series returned
tvSeries.addEventListener("click",  () => {
    main.innerHTML = ''
    getTvSeries(APITVSERIESURL)
    main.classList.add("series")
    main.classList.remove("movies")
    playOverview.innerHTML = "";
    main.appendChild(paginated);
})


// get only movies returned
movies.addEventListener("click",  () => {
    main.innerHTML = ''
    getMovies(APIMOVIEURL)
    main.classList.add("movies")
    main.classList.remove("series")
    playOverview.innerHTML = "";
    main.appendChild(paginated);
})

// fetch the url and get the movies info objects
async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    showMovies(respData.results)
}

// fetch the url and get the Tv info series objects
async function getTvSeries(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    showTvSeries(respData.results)
}

// get all Movies

function showMovies(movies) {

    main.innerHTML = '';
    // mapping all the objects to geta single object can also forEach
    movies.map((movie) => {

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
            <button class="trailer" id="allTrailers">Play : &#9654;</button>
              <h3>Overview: </h3>
                ${overview}
            </div>`
        }else {
            movieEl.innerHTML = 
            `<img src="${image}" alt="${title}">
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
        movieEl.addEventListener("click", () => {
            paginated.remove();
            movieTitle.innerText = `${title}`;
            playContentData.innerHTML = `
            <div class="play-images">
              <img src="${IMGPATH + poster_path}" alt="${title}">
            </div>
            <span>${title}</span><br><br><span>Release Date: ${ release_date }</span>
            <br><br><span class="${getClassByRate(vote_average)}">Rating : ${vote_average}
            </span><br><span>Overview: <p>${overview}</p></span>`
            iframe.innerHTML = 
                `<iframe src="${iframeMovieLink + id}" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen">`
                 
            main.innerHTML = '';
            main.appendChild(movieTitle);
            main.appendChild(iframe);
            playOverview.appendChild(playContentData);
        })
    });
    
}

// get all Tv series and episodes

function showTvSeries(movies) {

    main.innerHTML = '';

    // looping through all the tv shows data using map can also use forEach
    movies.map((movie) => {

        const {poster_path,name,vote_average, overview, first_air_date, id} = movie;
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
              <button class="trailer" id="allTrailers">Play : &#9654;</button>
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

        let season = 1;
        let episode  = 1;
        main.appendChild(movieEl)
    
        movieEl.addEventListener("click", () => { 
            //getting the episodes for every season
            selectSeason.innerHTML = '';
            main.innerHTML = '';
            const tvSeriesSeason = `${TvSeriesurl + id + apiKey}`       
            movieTitle.innerText = `${name}`;
            playContentData.innerHTML = `
            <div class="play-images">
             <img src="${IMGPATH + poster_path}" alt="${name}">
            </div>
             <span>${name}</span><br><br><span>Release Date: ${ first_air_date }</span>
             <br><br><span class="${getClassByRate(vote_average)}">Rating : ${vote_average}</span>
             <br><br><span>Overview: <p>${overview}</p></span>`;
            
            async function getSeason() {
                paginated.remove();
                iframe.innerHTML = `
                 <iframe src="${iframeSeriesLink + id + "-" + season + "-" + episode}" 
                  frameborder="0" scrolling="no" allowfullscreen="allowfullscreen">`
                const resp = await fetch(tvSeriesSeason);
                const respData = await resp.json();
        
                for (index = 1 ; index <= respData.number_of_seasons; index++){
                    const option = document.createElement("option");
                    selectSeason.classList.add("active");
                    option.value = `${index}`;
                    option.innerText = `Season ${index}`;
                    selectSeason.appendChild(option);
                    main.appendChild(selectSeason);

                    option.addEventListener("click", () => {
                        season = option.value;
                        iframe.innerHTML = `
                          <iframe src="${iframeSeriesLink + id + "-" + season + "-" + episode}" 
                          frameborder="0" scrolling="no" allowfullscreen="allowfullscreen"`;

                        async function getSeasonEpisodes() {
                            const tvSeriesEpisodes = `${TvSeriesurl + id}/season/${season + apiKey}`;
                            const resp = await fetch(tvSeriesEpisodes);
                            const respData = await resp.json();
                            // iterating through the Episodes and creating a button
                            
                            for (index = 1 ; index <= respData.episodes.length; index++){
                                const option = document.createElement("option");
                                option.innerText = `Episode ${index}`;
                                option.value = `${index}`;
                                selectSeriesEpesisode.appendChild(option);
                                console.log(selectSeriesEpesisode)
                                main.appendChild(selectSeriesEpesisode);
                                option.addEventListener("click", () => { 
                                    episode = option.value;
                                    iframe.innerHTML = `
                                     <iframe src="${iframeSeriesLink + id + "-" + season + "-" + episode}" 
                                     frameborder="0" scrolling="no" allowfullscreen="allowfullscreen" >` 
                                }); 
                            }
                        };
                        getSeasonEpisodes()
                        selectSeriesEpesisode.innerHTML = "";
                        main.removeChild(selectSeriesEpesisode);
                        main.appendChild(selectSeriesEpesisode);
                    }); 
                };
            };
            getSeason();
            main.appendChild(movieTitle);
            main.appendChild(iframe);
            playOverview.appendChild(playContentData);
        })
    });
}

// change rating color if the conditions are meant you can also use switch statements
function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    }else if (vote >= 5) {
        return 'orange';
    }else {
        return 'red';
    }
}

let searchData = [];
// Search fuctionality but not the best, but as of now we will let it be
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;

    if (searchTerm){
        if (main.classList == "series") {
            getTvSeries(SEARCHSERIESAPI + searchTerm);
        }
        else if (main.classList == "movies") {
            getMovies(SEARCHMOVIEAPI + searchTerm);

        }else {
            getTvSeries(SEARCHSERIESAPI + searchTerm);
            getMovies(SEARCHMOVIEAPI + searchTerm);
        }
        search.value = '';
    }
});

// pagination using button but planning to do an infinate scroll


let index = 1;

nextPage.addEventListener("click", () => {
    index++;
    if (main.classList == "series") {
        getTvSeries(APITVSERIESURL + index);
    }else if (main.classList == "movies" || main.classList == "") {
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
})