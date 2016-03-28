function search(){
  var searchText = document.getElementById("search-text");
  console.log(searchText.value);
  xhr = new XMLHttpRequest();
  xhr.open("GET", "/search/" + searchText.value);
  xhr.send();
  xhr.addEventListener("load", function(){
    var object = JSON.parse(xhr.response);
    console.log(object);
    displaySearchResults(object);
  })
}

function displaySearchResults(inputObject){
  removeAll("search-results");
  for( var i = 0; i < inputObject.Search.length; i++){
    
    displayOneSearch(inputObject.Search[i]);
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
  container.setAttribute("class" , "media");
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
}

function removeAll(inputId){
  //deletes all children below the inputId
  var deleteContainer = document.getElementById(inputId);
  while (deleteContainer.firstChild){
    deleteContainer.removeChild(deleteContainer.firstChild);
  }
}


var searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", search);
