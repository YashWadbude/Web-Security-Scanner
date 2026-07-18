function loginUser() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        console.log("LOGIN RESPONSE:", data); // 👈 DEBUG

        if (data.token) {
            localStorage.setItem("token", data.token);  // ✅ MUST
            window.location.href = "index.html";
        } else {
            alert("❌ " + data.error);
        }
    });
}