document.addEventListener("DOMContentLoaded", function () {

  function updateNavbar() {
    const username = localStorage.getItem("username");

    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const authButtons = document.getElementById("authButtons");
    const usernameDisplay = document.getElementById("usernameDisplay");

    if (username) {
      // Giriş yapılmış: butonları gizle, adı göster
      if (authButtons) authButtons.style.display = "none";
      if (usernameDisplay) {
        usernameDisplay.textContent = username;
        usernameDisplay.style.display = "inline-block";
      }
    } else {
      // Giriş yok: butonları göster, adı gizle
      if (authButtons) authButtons.style.display = "flex";
      if (usernameDisplay) usernameDisplay.style.display = "none";
    }
  }

  updateNavbar();

  // Hamburger Menü
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const authButtons = document.querySelector(".auth-buttons");

  if (hamburger && navMenu && authButtons) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
      authButtons.classList.toggle("active");

      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", !expanded);
    });

    document.querySelectorAll(".nav-item").forEach(item => {
      item.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        authButtons.classList.remove("active");
        hamburger.setAttribute("aria-expanded", false);
      });
    });
  }

  // --- Kayıt Formu ---
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

  // --- Giriş Formu ---
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

        // Token ve ad localStorage'a kaydedilir
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.name);

        alert("✅ Giriş başarılı! Anasayfaya yönlendiriliyorsunuz.");
        window.location.href = "index.html";
      } catch (err) {
        loginErrorMessage.textContent = err.message;
        loginErrorMessage.style.color = "red";
      }
    });
  }

});
