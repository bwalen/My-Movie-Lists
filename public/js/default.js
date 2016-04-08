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
    var array = JSON.parse(xhr.response);
    moviesArray = array[0];
    mostPopularArray = array[1];
    mostPopularByYear = array[2];
    displayMovies(moviesArray);
    displayMovieLists(mostPopularArray);
    displayYears();
  })
}

function displayMovieLists(inputArray){
  removeAll("search-results");
  for(var i = 0; i < inputArray.length; i++){
    if(inputArray[i]!=undefined){
      getListData(inputArray[i]);
    }
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
    if(array[i].title){
      differentTitle(array[i].title);
    }
    else{
      getMovieData(array[i]);
    }
  }
}

function displayOneSearch(inputObject){
  if (inputObject.Title){
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
      mediaImage.setAttribute("src", "images/movie-1.png");
    }
    else{
      mediaImage.setAttribute("src" , inputObject.Poster);
    }
    mediaImage.setAttribute("class" , "media-object");
    innerDiv.setAttribute("class" , "media-body");
    mediaHeading.setAttribute("class", "media-heading");
    mediaHeading.appendChild(headingText);
    innerDiv.appendChild(mediaHeading);
    if( inputObject.imdbRating && inputObject.imdbRating != "N/A"){
      var imdbP = document.createElement("p");
      var imdbText = document.createTextNode("IMDB Rating: " + inputObject.imdbRating + " / 10");
      imdbP.setAttribute("class", "body-text");
      imdbP.appendChild(imdbText);
      innerDiv.appendChild(imdbP);
    }
    if( inputObject.Genre && inputObject.Genre != "N/A"){
      var genreP = document.createElement("p");
      var genreText = document.createTextNode(inputObject.Genre);
      genreP.setAttribute("class", "body-text")
      genreP.appendChild(genreText);
      innerDiv.appendChild(genreP);
    }
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
  if(_.contains(moviesArray, imdbId) == false  && imdbId != undefined){
    moviesArray.push(imdbId);
    document.cookie = ("list=" + JSON.stringify(moviesArray));
    document.cookie = ("max-age=31536e3");
    var copyBox = document.getElementById("copy-text");
    copyBox.value = "localhost:1337/session/" + JSON.stringify(moviesArray);
    getMovieData(imdbId);
  }
  }
}

function removeAll(inputId){
  //deletes all children of the element with the inputId
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
  var header = document.createElement("h4");
  var body = document.createElement("p");
  var starring = document.createElement("p");
  var headerText = document.createTextNode(inputObj.Title + " (" + inputObj.Year +")");
  var bodyText = document.createTextNode(inputObj.Plot);
  var starringText = document.createTextNode(inputObj.Actors);
  var closeSpan = document.createElement("span");
  var detailsLink = document.createElement("a");
  var detailsText = document.createTextNode("Click here for more information about " + inputObj.Title);
  container.setAttribute("class", "col-md-12 more-margin");
  if(inputObj.Poster== "N/A" ){
    movieImage.setAttribute("src", "images/movie-1.png");
  }
  else{
    movieImage.setAttribute("src", inputObj.Poster);
  }
  movieImage.setAttribute("class", "img-responsive");
  detailsLink.setAttribute("class", "h5");
  caption.setAttribute("class", "col-md-9");
  outterDiv.setAttribute("class", "col-md-3");
  body.setAttribute("class", "body-text");
  closeSpan.setAttribute("class", "close glyphicon glyphicon-remove");
  container.setAttribute("data-id", inputObj.imdbID);
  closeSpan.setAttribute("data-id", inputObj.imdbID);
  detailsLink.appendChild(detailsText);
  starring.appendChild(starringText);
  body.appendChild(bodyText);
  header.appendChild(headerText);
  caption.appendChild(header);
  caption.appendChild(starring);
  caption.appendChild(body);
  caption.appendChild(detailsLink);
  container.appendChild(closeSpan);
  outterDiv.appendChild(movieImage);
  container.appendChild(outterDiv);
  container.appendChild(caption);
  movieDisplay.insertBefore(container, movieDisplay.firstChild);
  container.addEventListener("click", whichProfile);
  var copyBox = document.getElementById("copy-text");
  copyBox.value = "localhost:1337/session/" + JSON.stringify(moviesArray);
  closeSpan.addEventListener("click", removeAMovie);
}

function whichProfile(e){
  removeAll("movie-body");
  var imdb;
  var movieDisplay = document.getElementById("movie-body");
  for(var i = 0; i < movieDataArray.length; i++){
    displayOneMovie(movieDataArray[i]);
  }
  var movieDisplay = document.getElementById("movie-body");
  if(e.target.hasAttribute("data-id")){
    imdb = e.target.getAttribute("data-id");
  }
  else if(e.target.parentNode.hasAttribute("data-id")){
    imdb = e.target.parentNode.getAttribute("data-id");
  }
  else if(e.target.parentNode.parentNode.hasAttribute("data-id")){
    imdb = e.target.parentNode.parentNode.getAttribute("data-id");
  }
  for (var i = 0; i < movieDataArray.length; i++){
    if( imdb == movieDataArray[i].imdbID){
      var whereIam = movieDisplay.firstChild;
      while(whereIam.getAttribute("data-id") != imdb){
        whereIam = whereIam.nextSibling;
      }
      movieDisplay.insertBefore(displayProfile(movieDataArray[i]), whereIam);
      movieDisplay.removeChild(whereIam);
    }
  }
}

function displayProfile(inputObj){
  var movieDisplay = document.createElement("div");
  var container = document.createElement("div");
  var outterDiv = document.createElement("div");
  var movieImage = document.createElement("img");
  var caption = document.createElement("div");
  var header = document.createElement("h4");
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
  var imdbRating = document.createTextNode("IMDB: " + inputObj.imdbRating + " / 10");
  var closeSpan = document.createElement("span");
  var runtimeP = document.createElement("p");
  var runtimeText = document.createTextNode("Runtime: " + inputObj.Runtime);
  var tomatoRatingP = document.createElement("a");
  var tomatoRatingPP = document.createElement("p");
  var tomatoText = document.createTextNode("Rotten Tomatoes Rating: " + inputObj.tomatoRating + " / 10");
  tomatoRatingP.setAttribute("href", inputObj.tomatoURL);
  imdbRatingP.setAttribute("href", "http://www.imdb.com/title/" + inputObj.imdbID + "/");
  imdbRatingP.setAttribute("target", "_blank");
  movieDisplay.setAttribute("class", "col-md-12 more-margin profile");
  movieDisplay.setAttribute("id", "details");
  if(inputObj.Poster== "N/A" ){
    movieImage.setAttribute("src", "images/movie-1.png");
  }
  else{
    movieImage.setAttribute("src", inputObj.Poster);
  }
  movieImage.setAttribute("class", "img-responsive");
  caption.setAttribute("class", "col-md-9");
  outterDiv.setAttribute("class", "col-md-3");
  outterDiv.setAttribute("id", "movie-stream");
  trailerDiv.setAttribute("id", "trailer");
  closeSpan.setAttribute("class", "close glyphicon glyphicon-remove");
  tomatoRatingP.appendChild(tomatoText);
  tomatoRatingPP.appendChild(tomatoRatingP);
  runtimeP.appendChild(runtimeText);
  imdbRatingP.appendChild(imdbRating);
  directedP.appendChild(directedText);
  ratingP.appendChild(rating);
  body.appendChild(bodyText);
  header.appendChild(headerText);
  caption.appendChild(header);
  caption.appendChild(starringText);
  caption.appendChild(directedP);
  caption.appendChild(ratingP);
  caption.appendChild(runtimeP);
  caption.appendChild(imdbRatingP);
  caption.appendChild(tomatoRatingPP);
  caption.appendChild(body);
  caption.appendChild(trailerDiv);
  outterDiv.appendChild(movieImage);
  container.appendChild(closeSpan);
  container.appendChild(outterDiv);
  container.appendChild(caption);
  movieDisplay.appendChild(container);
  closeSpan.addEventListener("click", function(){
    removeAll("movie-body");
    for(var i = 0; i < movieDataArray.length; i++){
      displayOneMovie(movieDataArray[i]);
    }
  });
  getTrailer(inputObj);
  return(movieDisplay);
}

function getTrailer(inputObj){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/profile/" + inputObj.imdbID);
  xhr.send();
  xhr.addEventListener("load", trailerResponse);
}

function trailerResponse(e){
  var res = e.target.response;
  res = JSON.parse(res);
  processPurchaseData(res);
  if(res.trailers.web.length > 0){
    var trailerDiv = document.getElementById("trailer");
    var trailerIframe = document.createElement("iframe");
    trailerIframe.setAttribute("width", "640");
    trailerIframe.setAttribute("height", "360");
    trailerIframe.setAttribute("src", res.trailers.web[0].embed);
    trailerIframe.setAttribute("allowfullscreen" , "");
    trailerDiv.appendChild(trailerIframe);
  }
}

function processPurchaseData(inputObj){
  var movieStream = document.getElementById("movie-stream");
  //free sources
  if(inputObj.free_web_sources.length > 0){
    var freeHeader = document.createElement("h5");
    var freeHeaderText = document.createTextNode("Stream Free");
    freeHeader.appendChild(freeHeaderText);
    movieStream.appendChild(freeHeader);
    for (var i = 0; i<inputObj.free_web_sources.length; i++){
      movieStream.appendChild(streamElement(inputObj.free_web_sources[i]));
    }
  }
  //subscription sources
  if(inputObj.subscription_web_sources.length > 0){
    var subHeader = document.createElement("h5");
    var subText = document.createTextNode("View with subscription");
    subHeader.appendChild(subText);
    movieStream.appendChild(subHeader);
    for (var i = 0; i < inputObj.subscription_web_sources.length; i++){
      movieStream.appendChild(streamElement(inputObj.subscription_web_sources[i]));
    }
  }
  //purchase sources
  if(inputObj.purchase_web_sources.length > 0){
    var purchaseHeader = document.createElement("h5");
    var purchaseText = document.createTextNode("Purchase");
    purchaseHeader.appendChild(purchaseText);
    movieStream.appendChild(purchaseHeader);
    for (var i = 0; i < inputObj.purchase_web_sources.length; i++){
      movieStream.appendChild(streamElement(inputObj.purchase_web_sources[i]));
    }
  }
}

function streamElement(inputObj){
  var sourceLink = document.createElement("a");
  var sourceText = document.createTextNode(inputObj.display_name);
  var lineBreak = document.createElement("br");
  sourceLink.setAttribute("href", inputObj.link);
  sourceLink.setAttribute("target", "_blank");
  sourceLink.appendChild(sourceText);
  sourceLink.appendChild(lineBreak);
  return(sourceLink);
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
  copyBox.value = "localhost:1337/session/" + JSON.stringify(moviesArray);
  document.cookie = ("list=" + JSON.stringify(moviesArray));
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

function changeTitle(){
  var title = document.getElementById("title");
  var inputText = document.getElementById("title-text");
  var inputButton = document.getElementById("title-button");
  title.setAttribute("class", "hidden");
  inputText.setAttribute("class", "form-control");
  inputButton.setAttribute("class", "btn btn-default");
  inputButton.addEventListener("click", function(){
    differentTitle(inputText.value);
  });
}

function differentTitle(newTitleText){
  var title = document.getElementById("title");
  var inputText = document.getElementById("title-text");
  var inputButton = document.getElementById("title-button");
  var text = document.createTextNode(newTitleText);
  inputText.setAttribute("class", "hidden form-control");
  inputButton.setAttribute("class", "hidden btn btn-default");
  title.setAttribute("class", "");
  title.removeChild(title.firstChild);
  title.appendChild(text);
  var listTitle = {title: newTitleText};
  for(var i = 0; i < moviesArray.length; i++){
    if(_.isObject(moviesArray[i])){
      moviesArray = _.without(moviesArray, moviesArray[i]);
    }
  }
  moviesArray.push(listTitle);
  document.cookie = ("list=" + JSON.stringify(moviesArray));
}

function displayYears(){
  var where = document.getElementById("years");
  var button = document.getElementById("year-button");
  for(var i = 0; i < mostPopularByYear.length; i++){
    where.appendChild(generateYearElement(2016 - i));
  }
  button.addEventListener("click", function(){
    var year = where.options[where.selectedIndex].value;
    displayMovieLists(mostPopularByYear[2016-year]);
  })
}

function generateYearElement(year){
  //var where = document.getElementById("years");
  var optionElement = document.createElement("option");
  var optionText = document.createTextNode(year);
  optionElement.appendChild(optionText);
  return optionElement;
}

var searchButton = document.getElementById("search-button");
var copyButton = document.getElementById("copy-button");
var sortList = document.getElementById("sort-list");
var topLists = document.getElementById("imdb-fifty");
var rottenLists = document.getElementById("rotten-fifty");
var changeText = document.getElementById("change-title");
var mostPopular = document.getElementById("most-popular");
searchButton.addEventListener("click", search);
copyButton.addEventListener("click", copySession);
sortList.addEventListener("click", sorter);
topLists.addEventListener("click", function(){ displayMovieLists(imdbTopFifty)});
rottenLists.addEventListener("click", function(){ displayMovieLists(tomatoesTopFifty)});
mostPopular.addEventListener("click", function(){ displayMovieLists(mostPopularArray)});
changeText.addEventListener("click", changeTitle);
var moviesArray = [];
var movieDataArray = [];
var mostPopularArray = [];
var mostPopularByYear = [];
var imdbTopFifty = ["tt0111161","tt0068646","tt0071562","tt0468569","tt0108052","tt0050083","tt0110912","tt0167260","tt0120737","tt0060196","tt0137523","tt0080684","tt0109830","tt1375666","tt0167261","tt0073486","tt0099685","tt0133093","tt0047478","tt0076759","tt0317248","tt0114369","tt0102926","tt0038650","tt0114814","tt0118799","tt0110413","tt0064116","tt0245429","tt0120815","tt0816692","tt0034583","tt0120586","tt0021749","tt0054215","tt0082971","tt0047396","tt1675434","tt0027977","tt0120689","tt0103064","tt0253474","tt0407887","tt0088763","tt2582802","tt0209144","tt0172495","tt0078788","tt0482571","tt0057012","tt0110357","tt0043014","tt0078748","tt0032553","tt0405094","tt0095765","tt1853728","tt0081505","tt0050825","tt0095327","tt0910970","tt1345836","tt0169547","tt0090605","tt0119698","tt0364569","tt0033467","tt0053125","tt0087843","tt0052357","tt0082096","tt0086190","tt0051201","tt0022100","tt0105236","tt0211915","tt0112573","tt0180093","tt0066921","tt0075314","tt0435761","tt0036775","tt0056172","tt0056592","tt0338013","tt0093058","tt0086879","tt0070735","tt0045152","tt0062622","tt0040522","tt0208092","tt0071853","tt0114709","tt0012349","tt0361748","tt0119488","tt0059578","tt0042876","tt0053604"];
var tomatoesTopFifty = ["tt0032138","tt0041959","tt0033467","tt0010323","tt0042192","tt0027977","tt0068646","tt0083866","tt0017136","tt0045152","tt0025316","tt2096673","tt0037008","tt0058182","tt0029583","tt1065073","tt0053125","tt0059646","tt0024216","tt0029843","tt0058946","tt0033870","tt0047396","tt0042876","tt0120363","tt0032904","tt0043014","tt0435761","tt0026138","tt0040522","tt0053198","tt0022100","tt0047478","tt1020072","tt1049413","tt0040897","tt0075314","tt2948356","tt0050083","tt0032976","tt0065571","tt0044081","tt0048424","tt0063522","tt0266543","tt0021884","tt0119488","tt1125849","tt0057012","tt0026029","tt0887912","tt0032551","tt0067328","tt0046438","tt0032910","tt0046268","tt0114709","tt0046250","tt1155592","tt0052561","tt0047296","tt0075686","tt0061512","tt0057091","tt0036868","tt0071315","tt0015648","tt0031885","tt2473794","tt0049730","tt2321549","tt0015864","tt2209418","tt0051036","tt0088247","tt2370248","tt0058331","tt0065214","tt1139797","tt0067116","tt0062136","tt1935179","tt0021749","tt2872750","tt0049366","tt0068361","tt0090605","tt0892769","tt0069762","tt0064116","tt2802154","tt2425486","tt0053459","tt0070379","tt0056801","tt0056218","tt0120255","tt0068182","tt1832382","tt0071360"];
loadMovieArray();
