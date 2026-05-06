let lastKnownId = null;
let active = false;

function getText() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/notes", true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      lastKnownId = data.id;
      document.getElementById("notes").value = data.content;
      console.log("GET successful");
    } else {
      console.log("GET failed", xhr.responseText);
      alert("GET request unsuccessful");
    }
  };
  xhr.send(null);
}

function postText() {
  const content = document.getElementById("notes").value;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/notes", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function() {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      lastKnownId = data.id;
      console.log("POST successful");
    } else if (xhr.status === 409) {
      console.log("Conflict, re-fetching");
      getText();
    } else {
      alert("POST request failed");
    }
  };
  xhr.send(JSON.stringify({ content, lastKnownId }));
  document.getElementById("status").textContent = "Saved!";
}

function debounceInputs() {
  let timeoutId;
  return () => {
    document.getElementById("status").textContent = "Saving...";
    clearTimeout(timeoutId);
    timeoutId = setTimeout(postText, 2000);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  getText();
  document.getElementById("notes").addEventListener("input", debounceInputs());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") postText();
    else if (document.visibilityState === "visible") getText();
  });
});

document.getElementById("notes").addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    e.target.value = e.target.value.substring(0, start) + "  " + e.target.value.substring(end);
    e.target.selectionStart = e.target.selectionEnd = start + 2;
  }
});
