// Handle GET response from server

function handleGetResponse(xhr) {
  console.log(xhr.responseText);
  if(xhr.status == 200) {
    console.log("GET request was successful!");
    const element = document.getElementById("notes");
    element.value = xhr.responseText;
  } else {
    console.log("GET request was unsuccessful. :(");
    alert("The GET request was unsuccessful. :(");
  }
}

// Create request to get latest text from database

function getText() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "https://httpbin.org/get", true);
  xhr.onload = function(){
    handleGetResponse(xhr);
  };
  xhr.responseType = "text";
  xhr.send(null);
}

// Create request to post data in database

function postText() {
  const element = document.getElementById("notes");
  const text = element.value;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "https://httpbin.org/post", true);
  xhr.setRequestHeader("Content-Type", "text/plain");
  xhr.onload = () => xhr.status === 200 ? alert("The POST request was successful!") : alert("The request failed...");
  xhr.send(text);
}

window.addEventListener("DOMContentLoaded", () => {
  let getButton = document.getElementById("get-button");
  let postButton = document.getElementById("post-button");
  getButton.addEventListener("click", getText);
  postButton.addEventListener("click", postText);
});
