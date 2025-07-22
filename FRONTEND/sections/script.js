document.addEventListener("DOMContentLoaded", async () => {
  const authButtons = document.getElementById("authButtons");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const userGreeting = document.getElementById("userGreeting");
  const userNameSpan = document.getElementById("userName");
  const logoutBtn = document.getElementById("logoutBtn");

  // Navbar güncelleme fonksiyonu - backend'den kullanıcı adını alır
  async function updateNavbar() {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Kullanıcı bilgisi alınamadı.");

        const data = await res.json();

        if (authButtons) authButtons.style.display = "none";

       if (usernameDisplay) {
  usernameDisplay.textContent = data.name;
  usernameDisplay.style.display = "inline-block";

  // Buraya tıklama olayı ekle
  usernameDisplay.style.cursor = "pointer"; // imleci el yapar
  usernameDisplay.onclick = () => {
    window.location.href = "hesabim.html";
  };
}
        

        if (userGreeting && userNameSpan) {
          userNameSpan.textContent = data.name;
          userGreeting.style.display = "inline-block";
        }
      } catch (error) {
        console.error("Navbar güncellenemedi:", error);
        // Token geçersiz ise temizle
        localStorage.removeItem("token");
        if (authButtons) authButtons.style.display = "flex";
        if (usernameDisplay) usernameDisplay.style.display = "none";
        if (userGreeting) userGreeting.style.display = "none";
      }
    } else {
      if (authButtons) authButtons.style.display = "flex";
      if (usernameDisplay) usernameDisplay.style.display = "none";
      if (userGreeting) userGreeting.style.display = "none";
    }
  }

  updateNavbar();

  // Logout butonu işlemi (hesabim.html sayfasında)
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "girisyap.html";
    });
  }

  // Hamburger Menü
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");

      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", !expanded);
    });

    document.querySelectorAll(".nav-item").forEach(item => {
      item.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        hamburger.setAttribute("aria-expanded", false);
      });
    });
  }

  // --- Kayıt Formu (kayitol.html için) ---
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const errorMessage = document.getElementById("errorMessage");

      let errors = [];
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!name) errors.push("İsim boş olamaz.");
      if (!emailPattern.test(email)) errors.push("Geçerli e-posta giriniz.");
      if (password.length < 6) errors.push("Şifre en az 6 karakter olmalı.");

      if (errors.length > 0) {
        errorMessage.innerHTML = errors.join("<br>");
        errorMessage.style.color = "red";
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Kayıt başarısız.");

        alert("✅ Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
        window.location.href = "girisyap.html";
      } catch (err) {
        errorMessage.textContent = err.message;
        errorMessage.style.color = "red";
      }
    });
  }

  // --- Giriş Formu (girisyap.html için) ---
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const loginErrorMessage = document.getElementById("errorMessage");

      if (!email || !password) {
        loginErrorMessage.textContent = "Email ve şifre boş olamaz.";
        loginErrorMessage.style.color = "red";
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Giriş başarısız.");

        // Token localStorage'a kaydedilir
        localStorage.setItem("token", data.token);

        alert("✅ Giriş başarılı! Anasayfaya yönlendiriliyorsunuz.");
        window.location.href = "index.html";
      } catch (err) {
        loginErrorMessage.textContent = err.message;
        loginErrorMessage.style.color = "red";
      }
    });
  }
});

// Fare hareketiyle tilt efektini tamamen kaldırın
// Bu kodu silin veya yorum satırı yapın
/*
document.querySelector('.yenikayit-container').addEventListener('mousemove', (e) => {
    // Tilt kodu burada
});
*/

// Sadece hover efekti için basit JavaScript
document.querySelector('.yenikayit-container').addEventListener('mouseenter', (e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
});

document.querySelector('.yenikayit-container').addEventListener('mouseleave', (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
});
// Dosya yükleme butonu için JS
document.querySelector('.file-upload-btn').addEventListener('click', function() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.jpeg,.png,.gif';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            document.querySelector('.file-name').textContent = e.target.files[0].name;
        }
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
});