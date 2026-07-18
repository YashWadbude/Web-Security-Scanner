/* =========================
   🔐 AUTH CHECK
========================= */
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


/* =========================
   🚀 START SCAN
========================= */
function startScan() {

    let url = document.getElementById("url").value;

    if (!url) {
        alert("Please enter a URL");
        return;
    }

    if (!url.startsWith("http")) {
        url = "http://" + url;
    }

    let progressBar = document.getElementById("progress");
    let logs = document.getElementById("logs");
    let percentText = document.getElementById("progress-percent");
    let currentTask = document.getElementById("current-task");

    document.getElementById("progressCard").style.display = "block";
    logs.innerHTML = "";

    console.log("Starting scan for:", url);

    // 🔐 Use TOKEN (NOT user_id)
    const eventSource = new EventSource(
        `http://127.0.0.1:5000/scan-stream?url=${encodeURIComponent(url)}&token=${token}`
    );

    eventSource.onopen = () => {
        console.log("✅ SSE Connected");
    };

    eventSource.onmessage = function (event) {

        let data = JSON.parse(event.data);

        console.log("DATA RECEIVED:", data);

        // ✅ Update UI
        progressBar.style.width = data.progress + "%";
        percentText.innerText = data.progress + "%";
        currentTask.innerText = data.log;

        logs.innerHTML += "➤ " + data.log + "<br>";
        logs.scrollTop = logs.scrollHeight;

        // ✅ When scan completes
        if (data.done) {

            console.log("✅ Scan completed & saved to database");

            eventSource.close();

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1500);
        }
    };

    eventSource.onerror = function (err) {
        console.error("❌ SSE ERROR:", err);
        logs.innerHTML += "❌ Connection failed. Check backend.<br>";
        eventSource.close();
    };
}