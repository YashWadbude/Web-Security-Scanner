/**
 * dashboard.js - FULL (List + Detailed Report)
 */

const API_BASE = "http://127.0.0.1:5000";

window.onload = function () {
    loadUserScans();   // 🔥 load list (optional UI)
    loadLatestScan();  // 🔥 load detailed report
};


// =========================
// 🔐 COMMON AUTH CHECK
// =========================
function getTokenOrRedirect() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return null;
    }

    return token;
}


// =========================
// 📜 LOAD ALL SCANS (LIST VIEW)
// =========================
function loadUserScans() {

    const token = getTokenOrRedirect();
    if (!token) return;

    fetch(`${API_BASE}/my-scans`, {
        headers: { "Authorization": token }
    })
    .then(res => res.json())
    .then(scans => displayScans(scans))
    .catch(err => console.error(err));
}


// =========================
// 📊 DISPLAY SCAN LIST
// =========================
function displayScans(scans) {

    const container = document.getElementById("scanResults");

    // 👉 If this page doesn't have list UI → skip safely
    if (!container) return;

    container.innerHTML = "";

    if (!scans.length) {
        container.innerHTML = "<p>No scans found</p>";
        return;
    }

    scans.forEach(scan => {

        const div = document.createElement("div");

        div.innerHTML = `
            <h3>${scan.target}</h3>
            <p>Date: ${scan.date}</p>
            <p>Total Issues: ${scan.results.length}</p>
            <button onclick='viewReport(${JSON.stringify(scan)})'>
                View Report
            </button>
            <hr>
        `;

        container.appendChild(div);
    });
}


// =========================
// 🔥 LOAD SCAN (LATEST OR SELECTED)
// =========================
function loadLatestScan() {

    const token = getTokenOrRedirect();
    if (!token) return;

    fetch(`${API_BASE}/my-scans`, {
        headers: { "Authorization": token }
    })
    .then(res => res.json())
    .then(scans => {

        const resultsTable = document.getElementById("results");

        // 👉 If this page doesn't have report UI → skip
        if (!resultsTable) return;

        if (!scans.length) {
            resultsTable.innerHTML =
                "<tr><td colspan='4'>No scans found</td></tr>";
            return;
        }

        // 🔥 Selected from history OR latest
        const selected = localStorage.getItem("selectedScan");

        let scanData;

        if (selected) {
            scanData = JSON.parse(selected);
            localStorage.removeItem("selectedScan");
        } else {
            scanData = scans[0];
        }

        displayScan(scanData);
    })
    .catch(err => console.error(err));
}


// =========================
// 📊 DISPLAY DETAILED REPORT
// =========================
function displayScan(scanData) {

    const results = document.getElementById("results");
    const targetUrl = document.getElementById("targetUrl");

    // 👉 safety check
    if (!results || !targetUrl) return;

    let total = 0, critical = 0, high = 0, medium = 0;

    results.innerHTML = "";

    targetUrl.innerText = "Target URL: " + scanData.target;

    scanData.results.forEach(v => {

        total++;

        if (v.severity === "Critical") critical++;
        else if (v.severity === "High") high++;
        else if (v.severity === "Medium") medium++;

        let row = `
        <tr>
            <td>${v.type}</td>
            <td><code>${v.url}</code></td>
            <td><span class="badge ${v.severity.toLowerCase()}">${v.severity}</span></td>
            <td><span class="status-open">Open</span></td>
        </tr>
        `;

        results.innerHTML += row;
    });

    document.getElementById("totalVulns").innerText = total;
    document.getElementById("critical").innerText = critical;
    document.getElementById("high").innerText = high;
    document.getElementById("medium").innerText = medium;
}


// =========================
// 🔍 VIEW REPORT (FROM LIST)
// =========================
function viewReport(scan) {
    localStorage.setItem("selectedScan", JSON.stringify(scan));
    window.location.href = "dashboard.html";
}


// =========================
// 📄 PDF EXPORT
// =========================
function generatePDF() {
    const element = document.getElementById('report-content');
    if (element) {
        html2pdf().from(element).save("WebSec_Report.pdf");
    }
}