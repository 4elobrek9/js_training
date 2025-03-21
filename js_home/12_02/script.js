const apiKey = 'cf778048';
let currentPage = 1;
let totalPages = 1;

document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('movieTitle').value;
    const type = document.getElementById('movieType').value;
    searchMovies(title, type);
});

function searchMovies(title, type) {
    currentPage = 1;
    fetchMovies(title, type, currentPage);
}

function fetchMovies(title, type, page) {
    const url = `http://www.omdbapi.com/?s=${encodeURIComponent(title)}&type=${type}&page=${page}&apikey=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                totalPages = Math.ceil(data.totalResults / 10);
                displayResults(data.Search);
                displayPagination();
            } else {
                document.getElementById('results').innerHTML = '<p>Фильмы не найдены!</p>';
                document.getElementById('pagination').innerHTML = '';
            }
        })
        .catch(error => console.error('Ошибка:', error));
}

function displayResults(movies) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=Нет+изображения'}" alt="${movie.Title}">
            <h3>${movie.Title} (${movie.Year})</h3>
            <button onclick="getMovieDetails('${movie.imdbID}')">Подробнее</button>
        `;
        resultsDiv.appendChild(movieDiv);
    });
}

function displayPagination() {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.onclick = () => {
            currentPage = i;
            fetchMovies(document.getElementById('movieTitle').value, document.getElementById('movieType').value, currentPage);
        };
        paginationDiv.appendChild(pageButton);
    }
}

function getMovieDetails(imdbID) {
    const url = `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                displayDetails(data);
            } else {
                document.getElementById('details').innerHTML = '<p>Детали не найдены!</p>';
            }
        })
        .catch(error => console.error('Ошибка:', error));
}

function displayDetails(movie) {
    const detailsDiv = document.getElementById('details');
    detailsDiv.innerHTML = `
        <h2>${movie.Title} (${movie.Year})</h2>
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450?text=Нет+изображения'}" alt="${movie.Title}">
        <p><strong>Режиссер:</strong> ${movie.Director}</p>
        <p><strong>Актеры:</strong> ${movie.Actors}</p>
        <p><strong>Описание:</strong> ${movie.Plot}</p>
        <p><strong>Жанр:</strong> ${movie.Genre}</p>
        <p><strong>Рейтинг:</strong> ${movie.imdbRating}</p>
        <p><strong>Дата выхода:</strong> ${movie.Released}</p>
        <p><strong>Язык:</strong> ${movie.Language}</p>
    `;
}

function searchByGenre(genre) {
    fetchMovies(genre, 'movie', currentPage);
}

function toggleMenu() {
    const menu = document.getElementById('genreMenu');
    menu.classList.toggle('hidden');
}

// Функция для получения популярных фильмов
function fetchPopularMovies() {
    const url = `http://www.omdbapi.com/?s=popular&type=movie&apikey=${apiKey}`; // Пример запроса для получения популярных фильмов

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                displayPopularMovies(data.Search);
            } else {
                document.getElementById('popularMovies').innerHTML = '<p>Популярные фильмы не найдены!</p>';
            }
        })
        .catch(error => console.error('Ошибка:', error));
}

function displayPopularMovies(movies) {
    const popularMoviesDiv = document.getElementById('popularMovies');
    popularMoviesDiv.innerHTML = '';

    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=Нет+изображения'}" alt="${movie.Title}">
            <h3>${movie.Title} (${movie.Year})</h3>
            <button onclick="getMovieDetails('${movie.imdbID}')">Подробнее</button>
        `;
        popularMoviesDiv.appendChild(movieDiv);
    });
}

fetchPopularMovies();
