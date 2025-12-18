// Handle GET response from server

function handleResponse(xhr) {
  if(xhr.status == 200) {
    console.log("GET request was successful!");
    let element = document.getElementById("notes");
    element.value = "GET request was successful!";
  } else {
    console.log("GET request was unsuccessful. :(");
    let element = document.getElementById("notes");
    element.value = "GET request was unsuccessful. :(";
  }
}

// Create request to get latest text from database

function getText() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "https://httpbin.org/get", true);
  xhr.onload = function(){
    handleResponse(xhr);
  };
  xhr.send(null);
}

window.addEventListener("DOMContentLoaded", () => {
  let button = document.getElementById("submit");
  button.addEventListener("click", getText);
});
