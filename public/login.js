"use strict";

const form = document.getElementById("login-form");
const errorDiv = document.getElementById("error-message");
const submitBtn = form.querySelector("button[type='submit']");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorDiv.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in...";

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            window.location.href = "/";
        } else {
            errorDiv.textContent = data.error || "Invalid username or password.";
            errorDiv.hidden = false;
            submitBtn.disabled = false;
            submitBtn.textContent = "Sign In";
        }
    } catch (err) {
        errorDiv.textContent = "Network error. Please try again.";
        errorDiv.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "Sign In";
    }
});