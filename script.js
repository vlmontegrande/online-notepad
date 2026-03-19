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

// Handle GET response from server

function handleGetResponse(xhr) {
  if(xhr.status === 200) {
    console.log("GET request was successful!");
    // setTimeout(getText, 3000);
  } else {
    console.log("GET request was unsuccessful. :(");
    console.log(xhr.responseText);
    alert("GET request was unsuccessful. :(");
  }
}

// Create request to post data in database

function postText() {
  const element = document.getElementById("notes");
  const text = element.value;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "https://httpbin.org/post", true);
  xhr.setRequestHeader("Content-Type", "text/plain");
  xhr.onload = () => xhr.status === 200 ? console.log("The POST request was successful!") : alert("The POST request failed...");
  xhr.send(text);
  const status = document.getElementById("status");
  status.textContent = "Saved!";
}

// Debounce input events

function debounceInputs() {
  let timeoutId;
  return () => {
    const status = document.getElementById("status");
    status.textContent = "Loading...";
    console.log("Reset timer...");
    clearTimeout(timeoutId);
    timeoutId = setTimeout(postText, 2000);
  };
}

const textArea = document.getElementById("notes");

document.addEventListener("DOMContentLoaded", () => {
  textArea.addEventListener("input", debounceInputs());
  getText();

  document.addEventListener("visibilitychange", () => {
    if(document.visibilityState === "hidden") postText();
    else if(document.visibilityState === "visible") getText();
  });
});

textArea.addEventListener("keydown", (e) => {
  if(e.key === "Tab") {
    e.preventDefault();
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    textArea.value = textArea.value.substring(0, start) + "  " + textArea.value.substring(end);
    textArea.selectionStart = start + 2;
  }
});
