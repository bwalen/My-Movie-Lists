var express = require('express');
var app = express();
var request = require("request");
var listArray = ["tt0111161","tt0068646","tt0071562","tt0468569","tt0108052","tt0050083"];
//localhost:8080/session/["tt0111161","tt0068646","tt0071562","tt0468569","tt0108052","tt0050083","tt0110912","tt0167260","tt0120737","tt0060196","tt0137523","tt0080684","tt0109830","tt1375666","tt0167261","tt0073486","tt0099685","tt0133093","tt0047478","tt0076759","tt0317248","tt0114369","tt0102926","tt0038650","tt0114814","tt0118799","tt0110413","tt0064116","tt0245429","tt0120815","tt0816692","tt0034583","tt0120586","tt0021749","tt0054215","tt0082971","tt0047396","tt1675434","tt0027977","tt0120689","tt0103064","tt0253474","tt0407887","tt0088763","tt2582802","tt0209144","tt0172495","tt0078788","tt0482571","tt0057012"]
//localhost:8080/session/["tt0111161","tt0068646","tt0071562","tt0468569","tt0108052","tt0050083","tt0110912","tt0167260","tt0120737","tt0060196","tt0137523","tt0080684","tt0109830","tt1375666","tt0167261","tt0073486","tt0099685","tt0133093","tt0047478","tt0076759","tt0317248","tt0114369","tt0102926","tt0038650","tt0114814","tt0118799","tt0110413","tt0064116","tt0245429","tt0120815","tt0816692","tt0034583","tt0120586","tt0021749","tt0054215","tt0082971","tt0047396","tt1675434","tt0027977","tt0120689","tt0103064","tt0253474","tt0407887","tt0088763","tt2582802","tt0209144","tt0172495","tt0078788","tt0482571","tt0057012","tt0110357","tt0043014","tt0078748","tt0032553","tt0405094","tt0095765","tt1853728","tt0081505","tt0050825","tt0095327","tt0910970","tt1345836","tt0169547","tt0090605","tt0119698","tt0364569","tt0033467","tt0053125","tt0087843","tt0052357","tt0082096","tt0086190","tt0051201","tt0022100","tt0105236","tt0211915","tt0112573","tt0180093","tt0066921","tt0075314","tt0435761","tt0036775","tt0056172","tt0056592","tt0338013","tt0093058","tt0086879","tt0070735","tt0045152","tt0062622","tt0040522","tt0208092","tt0071853","tt0114709","tt0012349","tt0361748","tt0119488","tt0059578","tt0042876","tt0053604"]

app.use(express.static("./"));

app.get("/session/:search", function(req, res){
  listArray = JSON.parse(req.params.search);
  res.redirect("/public/index.html");
});

app.get("/profile/:id", function(req, res){
  request("https://ee.internetvideoarchive.net/api/expressstandard/" + req.params.id + "?appid=f6f1cc712ad6&idtype=12", function(error, response, body){
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
