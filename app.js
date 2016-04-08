var express = require('express');
var app = express();
var request = require("request");
var cookieParser = require("cookie-parser");
var movieListArray = [];
var popularMoviesIMDB = getPopular();
var popularMoviesByYear = [];
//timedPopular();
var port = process.env.PORT || 1337;

app.use(cookieParser());

app.use(express.static("./public/"));

app.get("/session/:search", function(req, res){
  movieListArray = JSON.parse(req.params.search);
  res.redirect("/index.html");
});

app.get("/profile/:id", function(req, res){
  var profileData;
  var idData;
  request("http://api-public.guidebox.com/v1.43/US/rK5aa0fSTWUNFOjiiL2UNae5YTYsXxxF/search/movie/id/imdb/" + req.params.id, function (error, response, body){
    if (!error && response.statusCode == 200) {
      idData = JSON.parse(body);
    }
    if(idData.id){
      request("http://api-public.guidebox.com/v1.43/US/rK5aa0fSTWUNFOjiiL2UNae5YTYsXxxF/movie/" + idData.id, function(error, response, body){
        if (!error && response.statusCode == 200) {
          res.send(body);
        }
      })
    }
  });
});

app.get("/load" , function(req, res){
  if(req.cookies.list){
    movieListArray = JSON.parse(req.cookies.list);
  }
  res.send(JSON.stringify([movieListArray,popularMoviesIMDB,popularMoviesByYear]));
  movieListArray = [];
});

app.listen(port, function(){
  console.log("Listening on port " + port);
});

function getPopular(){
  var array = [];
  request("http://api.themoviedb.org/3/discover/movie?api_key=b2537b210a995e8a2dc935dfae46e48d&page=1&sort_by=popularity.desc", function(error,response,body){
    var returnedData = JSON.parse(body);
    for (var i = 0; i < returnedData.results.length; i++){
      request("http://api.themoviedb.org/3/movie/"+ returnedData.results[i].id + "?api_key=b2537b210a995e8a2dc935dfae46e48d", function(error, response, body){
        var moreData = JSON.parse(body);
        array.push(moreData.imdb_id);
      })
    }
  })
  return array;
}

function timedPopular(){
  var year = 2016;
  var intervalTimer = setInterval(function(){
    console.log("Loading..." + year);
    popularMoviesByYear.push(getPopularYear(year));
    year--;
    if(year <= 1920){
      clearInterval(intervalTimer);
    }
  }, 10000)
}

function getPopularYear(year){
  //gets the 20 most popular movies for a particular year
  var array = [];
  request("http://api.themoviedb.org/3/discover/movie?api_key=b2537b210a995e8a2dc935dfae46e48d&page=1&sort_by=popularity.desc&primary_release_year=" + year, function(error,response,body){
    var returnedData = JSON.parse(body);
    for (var i = 0; i < returnedData.results.length; i++){
      request("http://api.themoviedb.org/3/movie/"+ returnedData.results[i].id + "?api_key=b2537b210a995e8a2dc935dfae46e48d", function(error, response, body){
        var moreData = JSON.parse(body);
        array.push(moreData.imdb_id);
      })
    }
  })
  return array;
}
