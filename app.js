var express = require('express');
var app = express();
var request = require("request");

app.use(express.static("./"));

app.get("/search/:search", function(req, res){
  console.log(req.params.search);
  request("http://www.omdbapi.com/?s=" + req.params.search + "&type=movie&page=1&y=&plot=short&r=json&tomatoes=true", function(error, response, body){
    res.send(body);
  })

});

app.listen(8080, function(){
  console.log("Listening on port 8080.");
});
