$(document).ready(function () {
    var apiUrl = 'https://api.themoviedb.org/3/';

    var apiKey = '1ac542775457e8364e37c9dc09f924dd';

    var posterUrl = 'https://image.tmdb.org/t/p/';

    const allMoviesURL = apiUrl + 'discover/movie?api_key=' + apiKey + '&certification_country=US&certification.lte=G&sort_by=popularity.desc';



    function getMovies(page) {
        var MoviesURL = apiUrl + 'discover/movie?api_key=' + apiKey + '&certification_country=US&certification.lte=G&sort_by=popularity.desc&page=' + page;
        $.getJSON(MoviesURL, function (MoviesIndex) {
            for (let i = 0; i < MoviesIndex.results.length; i++) {
                var id = MoviesIndex.results[i].id;
                var currentMovie = apiUrl + 'movie/' + id + '/videos?api_key=' + apiKey;

                $.getJSON(currentMovie, function (movie) {

                    var poster = posterUrl + 'original' + MoviesIndex.results[i].poster_path;

                    var title = MoviesIndex.results[i].original_title;

                    var releaseDate = MoviesIndex.results[i].release_date;

                    var overview = MoviesIndex.results[i].overview;

                    var movieID = MoviesIndex.results[i].id;
                    if (overview.length > 200) {
                        overview = overview.slice(0, 200);
                        while (overview[overview.length - 1] != ' ') {
                            overview = overview.substring(0, overview.length - 1);
                        }
                        overview += '...';
                    }

                    var rating = MoviesIndex.results[i].vote_average;

                    var htmlContent = '';

                    htmlContent += '<div class="col-xs-7 col-sm-6 col-md-4 col-lg-3" style="padding-bottom: 2rem; display: inline-block">';
                    htmlContent += '<div class="card shadow p-3 mb-5 bg-white rounded" style="width: 100%; height: 100%;" >';
                    htmlContent += '<img src="' + poster + '" style="height: 100%; width: 100%;"> ';
                    htmlContent += '<div class="card-body">';
                    htmlContent += '<h5 class="card-title">' + title + '</h5>';
                    htmlContent += '<h6 class="card-text" >' + 'Rating: ' + rating + '</h6>';
                    htmlContent += '<h6 class="card-text" >' + 'Rlease Date: </h6>';
                    htmlContent += '<p class="card-text" >' + releaseDate + '</p>';
                    htmlContent += '<div class="row" style="height: 4rem;">';
                    htmlContent += '<a href="https://www.themoviedb.org/movie/' + movieID + '"' + ' class="btn btn-primary" style="margin: 0.8rem;">Detail</a>';
                    htmlContent += '</div>';
                    htmlContent += '</div>';
                    htmlContent += '</div>';
                    htmlContent += '</div>';


                    $('#card').append(htmlContent);

                })
            }
        })
    }

    var input = '';
    var searched = false;
    searchTitle();
    $('.searchForm').submit(function (event) {
        searched = true;
        $('#card').html('');
        $('#page').html('');
        event.preventDefault();
        input = $('.form-control').val();
        searchTitle(1);
        //re-arrange pages
        var pageNumber = 1;
        var searchURL = apiUrl + 'search/movie?api_key=' + apiKey + '&language=en-US&page=' + pageNumber + '&include_adult=false&query=' + input;
        $.getJSON(searchURL, function (MoviesIndex) {
            $('#page').append('current page on ' + pageNumber + ' of' + MoviesIndex.total_pages);
        })


        $('#next').click(function () {
            $('#card').html('');
            var htmlContent = '';
            if (pageNumber == searchURL.total_pages) {
                searchTitle(searchURL.total_pages);
                $('#card').html(htmlContent);
            } else {
                pageNumber += 1;
                searchTitle(pageNumber);
                $('#card').html(htmlContent);
            }
            $.getJSON(searchURL, function (MoviesIndex) {
                $('#page').html('current page on ' + pageNumber + ' of' + MoviesIndex.total_pages);
            })
        })

        $('#previous').click(function () {

            if (pageNumber != 1) {
                $('#card').html('');
                pageNumber -= 1;
                searchTitle(pageNumber);
                $('#card').html(htmlContent);
                $.getJSON(searchURL, function (MoviesIndex) {
                    $('#page').html('current page on ' + pageNumber + ' of' + MoviesIndex.total_pages);
                })
            }

        })
    })

    function searchTitle(page) {
        var searchURL = apiUrl + 'search/movie?api_key=' + apiKey + '&language=en-US&page=1&include_adult=false&query=' + input;
        // console.log(searchURL);
        $.getJSON(searchURL, function (searchIndex) {
            // console.log(searchIndex);
            for (let i = 0; i < searchIndex.results.length; i++) {
                var movieID = searchIndex.results[i].id;
                var currentMovie = apiUrl + 'movie/' + movieID + '/videos?api_key=' + apiKey;

                $.getJSON(currentMovie, function (movie) {
                    var poster = posterUrl + 'w300' + searchIndex.results[i].poster_path;
                    var title = searchIndex.results[i].original_title;
                    var releaseDate = searchIndex.results[i].release_date;
                    var overview = searchIndex.results[i].overview;
                    var rating = searchIndex.results[i].vote_average;
                    var htmlContent = '';
                    htmlContent += '<div class="col-xs-7 col-sm-6 col-md-4 col-lg-3" style="padding-bottom: 2rem; display: inline-block">';
                    htmlContent += '<div class="card shadow p-3 mb-5 bg-white rounded" style="width: 100%; height: 100%;" >';
                    htmlContent += '<img src="' + poster + '" style="height: 100%; width: 100%;"> ';
                    htmlContent += '<div class="card-body">';
                    htmlContent += '<h5 class="card-title">' + title + '</h5>';
                    htmlContent += '<h6 class="card-text" >' + 'Rating: ' + rating + '</h6>';
                    htmlContent += '<h6 class="card-text" >' + 'Rlease Date: </h6>';
                    htmlContent += '<p class="card-text" >' + releaseDate + '</p>';
                    htmlContent += '<div class="row" style="height: 4rem;">';
                    htmlContent += '<a href="https://www.themoviedb.org/movie/' + movieID + '"' + ' class="btn btn-primary" style="margin: 0.8rem;">Detail</a>';
                    htmlContent += '</div>';
                    htmlContent += '</div>';
                    htmlContent += '</div>';
                    htmlContent += '</div>';
                    $('#card').append(htmlContent);
                })
            }
        })
    }


    var pageNumber = 1;
    getMovies(pageNumber);
    $.getJSON(allMoviesURL, function (MoviesIndex) {
        $('#page').append('current page on ' + pageNumber + ' of' + MoviesIndex.total_pages);
    })




    var htmlContent = '';
    $('#next').click(function () {
        if (searched = false) {
            if (pageNumber == allMoviesURL.total_pages) {
                getMovies(allMoviesURL.total_pages);
                $('#card').html(htmlContent);
            } else {
                pageNumber += 1;
                getMovies(pageNumber);
                $('#card').html(htmlContent);
            }
            $.getJSON(allMoviesURL, function (MoviesIndex) {
                $('#page').html('current page on ' + pageNumber + ' of' + MoviesIndex.total_pages);
            })
        }

    })

    $('#previous').click(function () {
        if (searched = false) {
            if (pageNumber != 1) {
                pageNumber -= 1;
                getMovies(pageNumber);
                $('#card').html(htmlContent);
            }
        }


    })
});

