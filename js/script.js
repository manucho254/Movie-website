// Always hide your api key
// This a dev community api so no need to hide it APIKEY = '04c35731a5ee918f014970082a0088b1';
const APIMOVIEURL =  'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=';
const APITVSERIESURL = 'https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=';
const IMGPATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHMOVIEAPI = 'https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=';
const SEARCHSERIESAPI = 'https://api.themoviedb.org/3/search/tv?&api_key=04c35731a5ee918f014970082a0088b1&query='
const iframeMovieLink = "https://autoembed.xyz/movie/tmdb/";
const iframeSeriesLink = "https://autoembed.xyz/tv/tmdb/";
const TvSeriesurl = "https://api.themoviedb.org/3/tv/"

// all my elements
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tvSeries = document.getElementById("tvSeries");
const movies = document.getElementById("movies");
const nextPage = document.getElementById("next");
const prevPage = document.getElementById("prev");
const paginated = document.getElementById("pagination");
const playOverview = document.getElementById("play-overview");
const playContentData = document.createElement("div");
const iframe = document.createElement("div");
const movieTitle = document.createElement("div");
const selectSeason = document.createElement("select");
movieTitle.classList.add("iframes");

let image = "empty.jpg";

getTvSeries(APITVSERIESURL);
getMovies(APIMOVIEURL);

// get only Tv series returned
tvSeries.addEventListener("click",  () => {
    main.innerHTML = ''
    getTvSeries(APITVSERIESURL)
    main.classList.add("series")
    main.classList.remove("movies")
})


// get only movies returned
movies.addEventListener("click",  () => {
    main.innerHTML = ''
    getMovies(APIMOVIEURL)
    main.classList.add("movies")
    main.classList.remove("series")
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
    console.log(respData.results);

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
            <button class="trailer" id="allTrailers">Play : &#9654;</button>
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
        movieEl.addEventListener("click", () => {

            movieTitle.innerText = `${title}`;
            playContentData.innerHTML = `<span>${title}</span><br><span>Release Date: ${ release_date }</span><br><span class="${getClassByRate(vote_average)}">Rating : ${vote_average}</span><br><span>Overview: <p>${overview}</p></span>`
            iframe.innerHTML = 
                   `<iframe src="${iframeMovieLink + id}" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen">`
                 
            main.innerHTML = '';
            main.appendChild(movieTitle);
            main.appendChild(iframe);
            playOverview.appendChild(playContentData);
            paginated.removeChild(nextPage);
            paginated.removeChild(prevPage);
        })
    });
    
}

// get all Tv series and episodes

function showTvSeries(movies) {

    main.innerHTML = '';

    // looping through all the tv shows data using 
    movies.forEach((movie) => {

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
            main.innerHTML = '';
            const tvSeriesSeason = `${TvSeriesurl + id}?api_key=04c35731a5ee918f014970082a0088b1&language=en-US`       
            movieTitle.innerText = `${name}`;
            playContentData.innerHTML = `<span>${name}</span><br><span>Release Date: ${ first_air_date }</span><br><span class="${getClassByRate(vote_average)}">Rating : ${vote_average}</span><br><span>Overview: <p>${overview}</p></span>`;

            (async function getSeason() {
                iframe.innerHTML = `<iframe src="${iframeSeriesLink + id + "-" + season + "-" + episode}" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen">`
                const resp = await fetch(tvSeriesSeason);
                const respData = await resp.json();
               
                console.log(respData.season_number)

                selectSeason.classList.add('seasons');
                for (index = 1 ; index <= respData.number_of_seasons; index++){
                    const option = document.createElement("option");
                    selectSeason.classList.add("active");
                    option.value = `${index}`;
                    option.innerText = `${index}`;
                    selectSeason.appendChild(option);
                    main.appendChild(selectSeason);
                    option.addEventListener("click", () => {
                        season = option.value;
                        iframe.innerHTML = `<iframe src="${iframeSeriesLink + id + "-" + season + "-" + episode}" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen">`;
                        (async function getSeasonEpisodes() {
                            const tvSeriesEpisodes = `${TvSeriesurl + id}/season/${season}?api_key=04c35731a5ee918f014970082a0088b1&language=en-US`
                            const resp = await fetch(tvSeriesEpisodes);
                            const respData = await resp.json();
                            console.log(respData);
                            // iterating through the Episodes and creating a button
                            for (index = 1 ; index <= respData.episodes.length; index++){
                                const btnEpisodes = document.createElement("button");
                                btnEpisodes.classList.add("btnEpisodes")
                                btnEpisodes.innerText = `${index}`;
                                btnEpisodes.value = `${index}`;
                                main.appendChild(btnEpisodes);
                                btnEpisodes.addEventListener("click", () => { 
                                    episode = btnEpisodes.value;
                                    iframe.innerHTML = `<iframe src="${iframeSeriesLink + id + "-" + season + "-" + episode}" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen">` 
                                });   
                            }
                        })();
                    }); 
                };
               
            })();

        
            main.appendChild(movieTitle);
            // main.appendChild(iframe);
            console.log(iframe)
            playOverview.appendChild(playContentData);
            // paginated.removeChild(nextPage);
            // paginated.removeChild(prevPage);  
            paginated.remove()        
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

// Search fuctionality but not the best, but as of now we will let it be
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

// pagination using button but planning to do an infinate scroll

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
})