let lastKnownId = null;
let inFlight = 0;
let isTyping = false;
let pollXhr = null;
let pollTimeoutId = null;

function request({ method, url, body }, handlers = {}) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  if (body !== undefined) xhr.setRequestHeader("Content-Type", "application/json");
  inFlight++;
  xhr.onload = () => handlers.onload?.(xhr);
  xhr.onloadend = () => {
    inFlight--;
    handlers.onloadend?.(xhr);
    maybeStartPolling();
  };
  xhr.send(body !== undefined ? JSON.stringify(body) : null);
  return xhr;
}

function canPoll() {
  return document.visibilityState === "visible" && !isTyping && inFlight === 0;
}

function cancelPoll() {
  clearTimeout(pollTimeoutId);
  pollTimeoutId = null;
  if (pollXhr) pollXhr.abort();
}

function maybeStartPolling() {
  if (!canPoll()) return;
  if (pollXhr || pollTimeoutId !== null) return;
  poll();
}

function poll() {
  pollTimeoutId = null;
  if (!canPoll()) return;
  const startedAt = Date.now();
  pollXhr = request({ method: "GET", url: "/api/notes" }, {
    onload: (xhr) => {
      if (xhr.status !== 200) return;
      const data = JSON.parse(xhr.responseText);
      if (data.id === lastKnownId || !canPoll()) return;
      lastKnownId = data.id;
      const notes = document.getElementById("notes");
      const s = notes.selectionStart, e = notes.selectionEnd;
      notes.value = data.content;
      notes.selectionStart = s; notes.selectionEnd = e;
    },
    onloadend: () => {
      pollXhr = null;
      if (canPoll()) {
        const elapsed = Date.now() - startedAt;
        pollTimeoutId = setTimeout(poll, Math.max(0, 3000 - elapsed));
      }
    },
  });
}

function getText() {
  cancelPoll();
  request({ method: "GET", url: "/api/notes" }, {
    onload: (xhr) => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        lastKnownId = data.id;
        document.getElementById("notes").value = data.content;
        console.log("GET successful");
      } else {
        console.log("GET failed", xhr.responseText);
        alert("GET request unsuccessful");
      }
    },
    onloadend: () => { isTyping = false; },
  });
}

function postText() {
  cancelPoll();
  const content = document.getElementById("notes").value;
  let willRecover = false;
  request({ method: "POST", url: "/api/notes", body: { content, lastKnownId } }, {
    onload: (xhr) => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        lastKnownId = data.id;
        console.log("POST successful");
      } else if (xhr.status === 409) {
        console.log("Conflict, re-fetching");
        willRecover = true;
        getText();
      } else {
        alert("POST request failed");
      }
    },
    onloadend: () => { if (!willRecover) isTyping = false; },
  });
  document.getElementById("status").textContent = "Saved!";
}

function debounceInputs() {
  let timeoutId;
  return () => {
    isTyping = true;
    cancelPoll();
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
