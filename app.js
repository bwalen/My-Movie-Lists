var express = require('express');
var app = express();
var request = require("request");
var listArray = ["tt0096895"];

app.use(express.static("./"));

app.get("/search/:search", function(req, res){
  request("http://www.omdbapi.com/?s=" + req.params.search + "&type=movie&page=1&y=&plot=short&r=json&tomatoes=true", function(error, response, body){
    res.send(body);
  })
});

app.get("/load" , function(req, res){
  res.send(JSON.stringify(listArray));
})

app.listen(8080, function(){
  console.log("Listening on port 8080.");
});
