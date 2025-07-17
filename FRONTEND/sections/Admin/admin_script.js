// Giriş işlemi (admin-login.html)
const loginForm = document.getElementById('adminLoginForm');

if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const adminUser = "admin";
    const adminPass = "admin123";

    if (username === adminUser && password === adminPass) {
      window.location.href = "admin-dashboard.html";
    } else {
      document.getElementById("errorMsg").innerText = "Kullanıcı adı veya şifre hatalı!";
    }
  });
}

// Kullanıcı listesi (admin-users.html)
const userTable = document.getElementById("userTableBody");
if (userTable) {
  const users = [
    { ad: "İrem", soyad: "Çınar", email: "irem@example.com", tarih: "2024-01-12", rol: "kullanıcı" },
    { ad: "Mert", soyad: "Yılmaz", email: "mert@example.com", tarih: "2023-12-01", rol: "admin" }
  ];

  users.forEach(user => {
    const row = `
      <tr>
        <td>${user.ad}</td>
        <td>${user.soyad}</td>
        <td>${user.email}</td>
        <td>${user.tarih}</td>
        <td>${user.rol}</td>
      </tr>
    `;
    userTable.innerHTML += row;
  });
}

// Arıza kayıtları (admin-records.html)
const recordTable = document.getElementById("recordTableBody");
if (recordTable) {
  const records = [
    { kullanici: "İrem Çınar", baslik: "İnternet Kesintisi", aciklama: "İnternet bağlantısı yok.", tarih: "2025-07-15", durum: "Açık" },
    { kullanici: "Mert Yılmaz", baslik: "Elektrik Sorunu", aciklama: "Fiş çalışmıyor.", tarih: "2025-07-10", durum: "Kapalı" }
  ];

  records.forEach(r => {
    const row = `
      <tr>
        <td>${r.kullanici}</td>
        <td>${r.baslik}</td>
        <td>${r.aciklama}</td>
        <td>${r.tarih}</td>
        <td>${r.durum}</td>
        <td><button>Düzenle</button></td>
      </tr>
    `;
    recordTable.innerHTML += row;
  });
}

// Destek talepleri (admin-support.html)
const supportTable = document.getElementById("supportTableBody");
if (supportTable) {
  const supports = [
    { kullanici: "İrem Çınar", mesaj: "Hesabımda sorun var.", tarih: "2025-07-14", durum: "Bekliyor" },
    { kullanici: "Mert Yılmaz", mesaj: "Kayıt silinmiyor.", tarih: "2025-07-13", durum: "Cevaplandı" }
  ];

  supports.forEach(s => {
    const row = `
      <tr>
        <td>${s.kullanici}</td>
        <td>${s.mesaj}</td>
        <td>${s.tarih}</td>
        <td>${s.durum}</td>
        <td><button>Cevapla</button></td>
      </tr>
    `;
    supportTable.innerHTML += row;
  });
}
document.getElementById("adminLoginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("adminUsername").value;
  const password = document.getElementById("adminPassword").value;

  // Basit örnek giriş kontrolü
  if (username === "admin" && password === "1234") {
    alert("Giriş başarılı!");
    window.location.href = "admin-dashboard.html"; // Admin paneline yönlendirme
  } else {
    alert("Hatalı giriş!");
  }
});
