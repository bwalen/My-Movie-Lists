function search(){
  var searchText = document.getElementById("search-text");
  xhr = new XMLHttpRequest();
  xhr.open("GET", "/search/" + searchText.value);
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
  var mediaHeading = document.createElement("h4");
  var headingText = document.createTextNode(inputObject.Title + "  (" + inputObject.Year + ")");
//  var bodyText = document.createTextNode()
  searchResults.setAttribute("class" , "panel panel-default");
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

function removeAll(inputId){
  //deletes all children below the inputId
  var deleteContainer = document.getElementById(inputId);
  while (deleteContainer.firstChild){
    deleteContainer.removeChild(deleteContainer.firstChild);
  }
}

function getMovieData(movieId){
  xhr = new XMLHttpRequest();
  xhr.open("GET", "http://www.omdbapi.com/?i=" + movieId + "&plot=short&r=json");
  xhr.send();
  xhr.addEventListener("load", displayOneMovie);
}

function displayOneMovie(e){
  var inputObj= JSON.parse(e.target.response);
  movieDataArray.push(inputObj);
  var movieDisplay = document.getElementById("movie-body");
  var container = document.createElement("div");
  var outterDiv = document.createElement("div");
  var movieImage = document.createElement("img");
  var caption = document.createElement("div");
  var header = document.createElement("h5");
  var body = document.createElement("p");
  var headerText = document.createTextNode(inputObj.Title + " (" + inputObj.Year +")");
  var bodyText = document.createTextNode(inputObj.Plot);
  container.setAttribute("class", "col-md-4");
  movieImage.setAttribute("src", inputObj.Poster);
  caption.setAttribute("class", "caption");
  outterDiv.setAttribute("class", "thumbnail");
  body.appendChild(bodyText);
  header.appendChild(headerText);
  caption.appendChild(header);
  caption.appendChild(body);
  outterDiv.appendChild(movieImage);
  outterDiv.appendChild(caption);
  container.appendChild(outterDiv);
  movieDisplay.appendChild(container);
}

function addMovieToList(e){
  var imdbId;
  if(e.target.parentNode.getAttribute("data-id")){
    imdbId = e.target.parentNode.getAttribute("data-id");
  }
  else if(e.target.parentNode.parentNode.getAttribute("data-id")){
    imdbId = e.target.parentNode.parentNode.getAttribute("data-id");
  }
  moviesArray.push(imdbId);
}

var searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", search);
var moviesArray;
var movieDataArray = [];
loadMovieArray();
