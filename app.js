var express = require('express');
var app = express();
var request = require("request");
var listArray = [];

app.use(express.static("./"));

app.get("/session/:search", function(req, res){
  listArray = JSON.parse(req.params.search);
  res.redirect("/public/index.html");
});

app.get("/search/:search", function(req, res){
  request("http://www.omdbapi.com/?s=" + req.params.search + "&type=movie&page=1&y=&plot=short&r=json&tomatoes=true", function(error, response, body){
    res.send(body);
  })
});

app.get("/profile/:id", function(req, res){
  request("https://ee.internetvideoarchive.net/api/expressstandard/" + req.params.id + "?appid=f6f1cc712ad6&idtype=12", function(error, response, body){
    console.log(body);
    res.send(body);
  })
})

app.get("/load" , function(req, res){
  res.send(JSON.stringify(listArray));
  listArray = [];
})

app.listen(8080, function(){
  console.log("Listening on port 8080.");
});
