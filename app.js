var express = require('express');
var app = express();
var request = require("request");

app.use(express.static("./"));

app.get("/search/:search", function(req, res){
  console.log(req.params.search);
  request("http://www.omdbapi.com/?t=" + req.params.search + "&y=&plot=short&r=json", function(error, response, body){
    console.log(body);
    res.send(body);
  })

  /*xhr = new XMLHttpRequest();
  xhr.open("GET", "http://www.omdbapi.com/?t=" + req.params.search + "&y=&plot=short&r=json");
  xhr.send();
  console.log(xhr.response);*/
});

app.listen(8080, function(){
  console.log("Listening on port 8080.");
});
