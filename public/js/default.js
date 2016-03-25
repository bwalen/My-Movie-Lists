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
  
}

var searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", search);
