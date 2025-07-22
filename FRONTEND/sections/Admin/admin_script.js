// ========== TOKEN KONTROLÜ ==========
function checkAdminAuth() {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    alert("Yetkisiz erişim! Lütfen admin olarak giriş yapın.");
    window.location.href = "admin-login.html";
  }
  return token;
}

// ========== ADMIN GİRİŞ ==========
const loginForm = document.getElementById("adminLoginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Burada id'ler HTML ile uyumlu şekilde değiştirildi
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Giriş başarısız");
      }

      if (data.role !== "admin") {
        throw new Error("Bu alana yalnızca admin kullanıcılar giriş yapabilir.");
      }

      localStorage.setItem("adminToken", data.token);
      window.location.href = "admin_index.html";

    } catch (error) {
      const errorElement = document.getElementById("errorMsg");
      if (errorElement) {
        errorElement.innerText = error.message;
      } else {
        alert(error.message);
      }
    }
  });
}

// ========== KULLANICI LİSTESİ ==========
const userTable = document.getElementById("userTableBody");
if (userTable) {
  const token = checkAdminAuth();

  fetch("http://localhost:5000/api/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Kullanıcılar yüklenirken hata oluştu.");
      return res.json();
    })
    .then(users => {
      users.forEach(user => {
        const row = `
          <tr>
            <td>${user.firstName || "-"}</td>
            <td>${user.lastName || "-"}</td>
            <td>${user.email}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>${user.role}</td>
          </tr>
        `;
        userTable.innerHTML += row;
      });
    })
    .catch(err => {
      alert("Kullanıcılar yüklenemedi: " + err.message);
    });
}

// ========== ARIZA KAYITLARI ==========
const recordTable = document.getElementById("recordTableBody");
if (recordTable) {
  const token = checkAdminAuth();

  fetch("http://localhost:5000/api/admin/records", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Arıza kayıtları yüklenirken hata oluştu.");
      return res.json();
    })
    .then(records => {
      records.forEach(r => {
        const row = `
          <tr>
            <td>${r.kullanici}</td>
            <td>${r.baslik}</td>
            <td>${r.aciklama}</td>
            <td>${new Date(r.tarih).toLocaleDateString()}</td>
            <td>${r.durum}</td>
            <td><button>Düzenle</button></td>
          </tr>
        `;
        recordTable.innerHTML += row;
      });
    })
    .catch(err => {
      alert("Arıza kayıtları yüklenemedi: " + err.message);
    });
}

// ========== DESTEK TALEPLERİ ==========
const supportTable = document.getElementById("supportTableBody");
if (supportTable) {
  const token = checkAdminAuth();

  fetch("http://localhost:5000/api/admin/supports", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Destek talepleri yüklenirken hata oluştu.");
      return res.json();
    })
    .then(supports => {
      supports.forEach(s => {
        const row = `
          <tr>
            <td>${s.kullanici}</td>
            <td>${s.mesaj}</td>
            <td>${new Date(s.tarih).toLocaleDateString()}</td>
            <td>${s.durum}</td>
            <td><button>Cevapla</button></td>
          </tr>
        `;
        supportTable.innerHTML += row;
      });
    })
    .catch(err => {
      alert("Destek talepleri yüklenemedi: " + err.message);
    });
}
