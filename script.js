// Handle GET response from server

function handleResponse(xhr) {
  console.log(xhr.responseText);
  if(xhr.status == 200) {
    console.log("GET request was successful!");
    let element = document.getElementById("notes");
    element.value = xhr.responseText;
  } else {
    console.log("GET request was unsuccessful. :(");
    let element = document.getElementById("notes");
    element.value = xhr.responseText;
  }
}

// Create request to get latest text from database

function getText() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "https://httpbin.org/ip", true);
  xhr.onload = function(){
    handleResponse(xhr);
  };
  xhr.responseType = "text";
  xhr.send(null);
}

window.addEventListener("DOMContentLoaded", () => {
  let button = document.getElementById("get-button");
  button.addEventListener("click", getText);
});
