function search(){
  var searchText = document.getElementById("search-text");
  xhr = new XMLHttpRequest();
  xhr.open("GET", "http://www.omdbapi.com/?s=" + searchText.value + "&type=movie&page=1&y=&plot=short&r=json&tomatoes=true" );
  xhr.send();
  xhr.addEventListener("load", function(){
    displaySearchResults(JSON.parse(xhr.response));
  })
}

function displaySearchResults(inputObject){
  removeAll("search-results");
  for( var i = 0; i < inputObject.Search.length; i++){
    displayOneSearch(inputObject.Search[i]);
  }
}

function loadMovieArray(){
  xhr = new XMLHttpRequest();
  xhr.open("GET", "/load");
  xhr.send();
  xhr.addEventListener("load", function(){
    moviesArray = JSON.parse(xhr.response);
    displayMovies(JSON.parse(xhr.response));
  })
}

function displayMovieLists(inputArray){
  removeAll("search-results");
  for(var i = 0; i < inputArray.length; i++){
    getListData(inputArray[i]);
  }
}

function getListData(imdbid){
  xhr = new XMLHttpRequest();
  xhr.open("GET", "http://www.omdbapi.com/?i=" + imdbid + "&plot=full&r=json&tomatoes=true");
  xhr.send();
  xhr.addEventListener("load", processListData);
}

function processListData(e){
  displayOneSearch(JSON.parse(e.target.response));
}

function displayMovies(array){
  removeAll("movie-body");
  for(var i = 0 ; i < array.length ; i++){
    getMovieData(array[i]);
  }
}

function displayOneSearch(inputObject){
  var searchResults = document.getElementById("search-results");
  var container = document.createElement("div");
  var outterDiv = document.createElement("div");
  var mediaImage = document.createElement("img");
  var innerDiv = document.createElement("div");
  var mediaHeading = document.createElement("h5");
  var headingText = document.createTextNode(inputObject.Title + "  (" + inputObject.Year + ")");
  searchResults.setAttribute("class" , "more-margin");
  container.setAttribute("class" , "media");
  container.setAttribute("data-id", inputObject.imdbID);
  outterDiv.setAttribute("class", "media-left");
  if (inputObject.Poster == "N/A"){
    mediaImage.setAttribute("src", "images/blankposter.png");
  }
  else{
    mediaImage.setAttribute("src" , inputObject.Poster);
  }
  mediaImage.setAttribute("class" , "media-object");
  innerDiv.setAttribute("class" , "media-body");
  mediaHeading.setAttribute("class", "media-heading");
  mediaHeading.appendChild(headingText);
  innerDiv.appendChild(mediaHeading);
  outterDiv.appendChild(mediaImage);
  container.appendChild(outterDiv);
  container.appendChild(innerDiv);
  searchResults.appendChild(container);
  container.addEventListener("click", addMovieToList);
}

function addMovieToList(e){
  var imdbId;
  if(e.target.parentNode.getAttribute("data-id")){
    imdbId = e.target.parentNode.getAttribute("data-id");
  }
  else if(e.target.parentNode.parentNode.getAttribute("data-id")){
    imdbId = e.target.parentNode.parentNode.getAttribute("data-id");
  }
  if(_.contains(moviesArray, imdbId) == false){
    moviesArray.push(imdbId);
    var copyBox = document.getElementById("copy-text");
    copyBox.value = "localhost:8080/session/" + JSON.stringify(moviesArray);
    getMovieData(imdbId);
  }
}

function removeAll(inputId){
  //deletes all children below the inputId
  var deleteContainer = document.getElementById(inputId);
  while (deleteContainer.firstChild){
    deleteContainer.removeChild(deleteContainer.firstChild);
  }
}

function getMovieData(movieId){
  xhr = new XMLHttpRequest();
  xhr.open("GET", "http://www.omdbapi.com/?i=" + movieId + "&plot=full&r=json&tomatoes=true");
  xhr.send();
  xhr.addEventListener("load", addMovieData);
}

function addMovieData(e){
  var inputObj = JSON.parse(e.target.response);
  movieDataArray.push(inputObj);
  displayOneMovie(inputObj);
}

function displayOneMovie(inputObj){
  var movieDisplay = document.getElementById("movie-body");
  var container = document.createElement("div");
  var outterDiv = document.createElement("div");
  var movieImage = document.createElement("img");
  var caption = document.createElement("div");
  var header = document.createElement("h5");
  var body = document.createElement("p");
  var starring = document.createElement("p");
  var headerText = document.createTextNode(inputObj.Title + " (" + inputObj.Year +")");
  var bodyText = document.createTextNode(inputObj.Plot);
  var starringText = document.createTextNode(inputObj.Actors);
  var closeSpan = document.createElement("span");
  container.setAttribute("class", "col-md-12 more-margin");
  movieImage.setAttribute("src", inputObj.Poster);
  movieImage.setAttribute("class", "img-responsive");
  movieImage.setAttribute("data-id", movieDataArray.length-1 );
  caption.setAttribute("class", "col-md-9");
  outterDiv.setAttribute("class", "col-md-3");
  body.setAttribute("class", "body-text");
  closeSpan.setAttribute("class", "close glyphicon glyphicon-remove");
  container.setAttribute("data-id", inputObj.imdbID);
  closeSpan.setAttribute("data-id", inputObj.imdbID);
  starring.appendChild(starringText);
  body.appendChild(bodyText);
  header.appendChild(headerText);
  caption.appendChild(header);
  caption.appendChild(starring);
  caption.appendChild(body);
  container.appendChild(closeSpan);
  outterDiv.appendChild(movieImage);
  container.appendChild(outterDiv);
  container.appendChild(caption);
  movieDisplay.insertBefore(container, movieDisplay.firstChild);
  closeSpan.addEventListener("click", removeAMovie);
  movieImage.addEventListener("click", displayProfile);
}

function displayProfile(e){
  removeAll("profile-page");
  var inputObj = movieDataArray[e.target.getAttribute("data-id")];
  var movieDisplay = document.getElementById("profile-page");
  var container = document.createElement("div");
  var outterDiv = document.createElement("div");
  var movieImage = document.createElement("img");
  var caption = document.createElement("div");
  var header = document.createElement("h3");
  var body = document.createElement("p");
  var starring = document.createElement("p");
  var trailerDiv = document.createElement("div");
  var headerText = document.createTextNode(inputObj.Title + " (" + inputObj.Year +")");
  var bodyText = document.createTextNode(inputObj.Plot);
  var starringText = document.createTextNode("Starring: " + inputObj.Actors);
  var directedText = document.createTextNode("Directed by: " + inputObj.Director);
  var directedP = document.createElement("p");
  var ratingP = document.createElement("p");
  var rating = document.createTextNode("Rated: " + inputObj.Rated);
  var imdbRatingP = document.createElement("a");
  var imdbRating = document.createTextNode("IMDB rating: " + inputObj.imdbRating + "/10");
  var closeSpan = document.createElement("span");
  imdbRatingP.setAttribute("href", "http://www.imdb.com/title/" + inputObj.imdbID + "/");
  imdbRatingP.setAttribute("target", "_blank");
  movieDisplay.setAttribute("class", "panel-body");
  movieImage.setAttribute("src", inputObj.Poster);
  movieImage.setAttribute("class", "img-responsive");
  caption.setAttribute("class", "col-md-9");
  outterDiv.setAttribute("class", "col-md-3");
  trailerDiv.setAttribute("id", "trailer");
  closeSpan.setAttribute("class", "close glyphicon glyphicon-remove");
  imdbRatingP.appendChild(imdbRating);
  directedP.appendChild(directedText);
  ratingP.appendChild(rating);
  starring.appendChild(starringText);
  starring.appendChild(directedP);
  starring.appendChild(ratingP);
  starring.appendChild(imdbRatingP);
  body.appendChild(bodyText);
  starring.appendChild(body);
  header.appendChild(headerText);
  caption.appendChild(header);
  caption.appendChild(starring);
  outterDiv.appendChild(movieImage);
  container.appendChild(closeSpan);
  container.appendChild(outterDiv);
  container.appendChild(caption);
  container.appendChild(trailerDiv);
  movieDisplay.appendChild(container);
  closeSpan.addEventListener("click", function(){
    movieDisplay.setAttribute("class", "hidden");
    removeAll("profile-page");
  });
  getTrailer(inputObj);
}

function getTrailer(inputObj){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/profile/" + inputObj.imdbID);
  xhr.send();
  xhr.addEventListener("load", trailerResponse);
}

function trailerResponse(e){
  var res = JSON.parse(e.target.response);
  var trailerDiv = document.getElementById("trailer");
  trailerDiv.innerHTML = res.Assets[0].EmbedCodes[0].EmbedHTML;
}

function removeAMovie(e){
  var movieDisplay = document.getElementById("movie-body");
  var whereIam = movieDisplay.firstChild;
  while(whereIam.getAttribute("data-id") != e.target.getAttribute("data-id")){
    whereIam = whereIam.nextSibling;
  }
  moviesArray = _.without(moviesArray, whereIam.getAttribute("data-id"));
  movieDisplay.removeChild(whereIam);
  for (var i = 0 ; i < movieDataArray.length; i++){
    if(movieDataArray[i].imdbID == whereIam.getAttribute("data-id")){
      movieDataArray = _.without(movieDataArray, movieDataArray[i]);
    }
  }
  var copyBox = document.getElementById("copy-text");
  copyBox.value = "localhost:8080/session/" + JSON.stringify(moviesArray);
}

function copySession(e){
  var copyBox = document.getElementById("copy-text");
  copyBox.select();
  var successful = document.execCommand("copy");
  copyBox.value = "Copy Successful";
}

function sorter(e){
  if(e.target.getAttribute("id") == "sort-title"){
    movieDataArray = _.sortBy(movieDataArray, "Title").reverse();
  }
  if(e.target.getAttribute("id") == "sort-date"){
    movieDataArray = _.sortBy(movieDataArray, "Year");
  }
  if(e.target.getAttribute("id") == "sort-imdb"){
    movieDataArray = _.sortBy(movieDataArray, "imdbRating");
  }
  if(e.target.getAttribute("id") == "sort-rtr"){
    movieDataArray = _.sortBy(movieDataArray, "tomatoRating");
  }
  removeAll("movie-body");
  for(var i = 0; i < movieDataArray.length; i++){
    displayOneMovie(movieDataArray[i]);
  }
}

var searchButton = document.getElementById("search-button");
var copyButton = document.getElementById("copy-button");
var sortList = document.getElementById("sort-list");
var topLists = document.getElementById("imdb-fifty");
searchButton.addEventListener("click", search);
copyButton.addEventListener("click", copySession);
sortList.addEventListener("click", sorter);
topLists.addEventListener("click", function(){ displayMovieLists(imdbTopFifty)});
var moviesArray = [];
var movieDataArray = [];
var imdbTopFifty = ["tt0111161","tt0068646","tt0071562","tt0468569","tt0108052","tt0050083","tt0110912","tt0167260","tt0120737","tt0060196","tt0137523","tt0080684","tt0109830","tt1375666","tt0167261","tt0073486","tt0099685","tt0133093","tt0047478","tt0076759","tt0317248","tt0114369","tt0102926","tt0038650","tt0114814","tt0118799","tt0110413","tt0064116","tt0245429","tt0120815","tt0816692","tt0034583","tt0120586","tt0021749","tt0054215","tt0082971","tt0047396","tt1675434","tt0027977","tt0120689","tt0103064","tt0253474","tt0407887","tt0088763","tt2582802","tt0209144","tt0172495","tt0078788","tt0482571","tt0057012"];
loadMovieArray();
