const API_BASE = "http://127.0.0.1:5000";

const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    loadHistory();
    initDarkMode();
    initProfileImageUpload();
});


/* =========================
   LOAD PROFILE (FROM BACKEND)
========================= */
function loadProfile() {
    fetch(`${API_BASE}/profile`, {
        headers: { "Authorization": token }
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("username").textContent = data.username || "N/A";
        document.getElementById("userid").textContent = data.user_id || "N/A";

        // Load avatar from DB
        if (data.profile_pic) {
            document.getElementById("profilePic").src = data.profile_pic;
        }

        // Navbar user display
        const userDisplay = document.getElementById("userDisplay");
        if (userDisplay) userDisplay.innerText = "👤 " + data.username;
    })
    .catch(() => logout());
}


/* =========================
   UPDATE USERNAME
========================= */
function updateUsername() {
    const username = document.getElementById("newUsername").value;
    const msg = document.getElementById("usernameMsg");

    if (!username) {
        msg.innerText = "⚠️ Enter username";
        return;
    }

    fetch(`${API_BASE}/update-profile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ username })
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            msg.innerText = "✅ Username updated!";
            msg.style.color = "green";

            document.getElementById("username").innerText = username;
        } else {
            msg.innerText = "❌ " + data.error;
        }
    })
    .catch(() => {
        msg.innerText = "❌ Server error";
    });
}


/* =========================
   CHANGE PASSWORD
========================= */
function changePassword() {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const msg = document.getElementById("passwordMsg");

    if (!oldPassword || !newPassword) {
        msg.innerText = "⚠️ Fill all fields";
        return;
    }

    fetch(`${API_BASE}/change-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.message) {
            msg.innerText = "✅ Password updated!";
            msg.style.color = "green";
        } else {
            msg.innerText = "❌ " + data.error;
            msg.style.color = "red";
        }
    })
    .catch(() => {
        msg.innerText = "❌ Server error";
    });
}


/* =========================
   PROFILE IMAGE (UPLOAD → BACKEND)
========================= */
function initProfileImageUpload() {
    const uploadInput = document.getElementById("uploadPic");

    if (!uploadInput) return;

    uploadInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            const base64Image = e.target.result;

            // Show instantly
            document.getElementById("profilePic").src = base64Image;

            // Send to backend
            fetch(`${API_BASE}/update-avatar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({ image: base64Image })
            })
            .then(res => res.json())
            .then(data => {
                console.log("Avatar updated:", data);
            })
            .catch(() => {
                alert("❌ Failed to upload image");
            });
        };

        reader.readAsDataURL(file);
    });
}


/* =========================
   LOAD HISTORY (FROM BACKEND)
========================= */
function loadHistory() {
    const table = document.getElementById("historyTable");

    fetch(`${API_BASE}/my-scans`, {
        headers: { "Authorization": token }
    })
    .then(res => res.json())
    .then(data => {

        if (!data.length) {
            table.innerHTML = "<tr><td colspan='3'>No activity found</td></tr>";
            return;
        }

        table.innerHTML = data.map(scan => `
            <tr>
                <td>${new Date(scan.date).toLocaleString()}</td>
                <td>${scan.target}</td>
                <td>${scan.results.length}</td>
            </tr>
        `).join("");
    })
    .catch(() => {
        table.innerHTML = "<tr><td colspan='3'>❌ Failed to load history</td></tr>";
    });
}


/* =========================
   CLEAR HISTORY (BACKEND)
========================= */
function clearHistory() {
    const msg = document.getElementById("historyMsg");

    if (!confirm("Delete all scan history?")) return;

    fetch(`${API_BASE}/clear-history`, {
        method: "DELETE",
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(data => {
        msg.innerText = "✅ History cleared";
        msg.style.color = "green";

        loadHistory(); // reload from backend
    })
    .catch(() => {
        msg.innerText = "❌ Failed to clear history";
    });
}


/* =========================
   DARK MODE (GLOBAL)
========================= */
function initDarkMode() {
    const toggle = document.getElementById("darkModeToggle");

    if (!toggle) return;

    // Load state
    const isDark = localStorage.getItem("darkMode") === "true";
    toggle.checked = isDark;

    // Apply immediately
    document.body.classList.toggle("dark", isDark);

    toggle.addEventListener("change", () => {
        localStorage.setItem("darkMode", toggle.checked);
        document.body.classList.toggle("dark", toggle.checked);
    });
}

function applyDarkMode() {
    document.body.classList.toggle(
        "dark",
        localStorage.getItem("darkMode") === "true"
    );
}


/* =========================
   DOWNLOAD REPORTS
========================= */
function downloadReports() {
    fetch(`${API_BASE}/my-scans`, {
        headers: { "Authorization": token }
    })
    .then(res => res.json())
    .then(data => {
        if (!data.length) return alert("No reports");

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json"
        });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "reports.json";
        a.click();
    });
}


/* =========================
   DELETE ACCOUNT
========================= */
function deleteAccount() {
    if (!confirm("Delete account permanently?")) return;

    fetch(`${API_BASE}/delete-account`, {
        method: "DELETE",
        headers: {
            "Authorization": token
        }
    })
    .then(() => {
        localStorage.clear();
        window.location.href = "login.html";
    });
}


/* =========================
   LOGOUT
========================= */
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}