// admin-script.js

const jsonBinUrl = "https://api.jsonbin.io/v3/b/67d3f80a8960c979a5715d3b";
const apiKey = "$2a$10$LZDpV8PPAx7WyATB653BxO06mW8SD07b0fqCGAhv7efjJF4ZQ4C0q";

// Fungsi untuk mengekstrak data pengguna dari JSONBin
function extractUsers(data) {
    let users = [];
    function findUsers(obj) {
        if (obj.users) {
            users = users.concat(obj.users);
        }
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                findUsers(obj[key]);
            }
        }
    }
    findUsers(data.record);
    return users;
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
        let tableBody = document.getElementById("userTable");
        tableBody.innerHTML = "";

        if (users.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4">Tidak ada data pengguna</td></tr>`;
            return;
        }

        users.forEach((user, index) => {
            let row = `<tr>
                <td>${index + 1}</td>
                <td ondblclick='copyText(this)'>${user.username}</td>
                <td ondblclick='copyText(this)'>${user.password}</td>
                <td><button class='delete-btn' onclick='deleteUser(${index})'>Hapus</button></td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => {
        console.error("Gagal mengambil data:", error);
        document.getElementById("userTable").innerHTML = `<tr><td colspan="4">Gagal memuat data</td></tr>`;
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

// Matrix Effect
const canvas = document.querySelector('.matrix');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const columns = Math.floor(canvas.width / 15);
const drops = Array(columns).fill(0);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    ctx.font = '15px monospace';
    drops.forEach((y, index) => {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);
        ctx.fillText(text, index * 15, y);
        drops[index] = y > canvas.height || Math.random() > 0.98 ? 0 : y + 15;
    });
}
setInterval(drawMatrix, 50);

// Tombol Play/Pause Music
const music = document.getElementById("background-music");
const playButton = document.getElementById("play-button");

playButton.addEventListener("click", function() {
    if (music.paused) {
        music.play();
        playButton.textContent = "Pause";
    } else {
        music.pause();
        playButton.textContent = "Play";
    }
});

// Tombol Kembali ke Index
const backButton = document.getElementById("back-button");
backButton.addEventListener("click", () => {
    window.location.href = 'index.html';
});
