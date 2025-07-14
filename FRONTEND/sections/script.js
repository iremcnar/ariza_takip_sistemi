document.addEventListener("DOMContentLoaded", function () {
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

    // Menüden bir öğeye tıklanınca menüyü kapat
    document.querySelectorAll(".nav-item").forEach(item => {
      item.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        authButtons.classList.remove("active");
        hamburger.setAttribute("aria-expanded", false);
      });
    });
  }

  // Yeni Kayıt Formu Kontrol
  const form = document.querySelector(".yenikayit-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      const konu = document.getElementById("konuBasligi").value.trim();
      const aciklama = document.getElementById("aciklama").value.trim();
      const oncelik = document.querySelector('input[name="oncelik"]:checked');

      if (!konu || !aciklama || !oncelik) {
        alert("Lütfen tüm zorunlu alanları eksiksiz doldurun!");
        e.preventDefault();
      }
    });
  }

  // Destek Formu Onay
  const destekForm = document.querySelector(".destek-form");
  if (destekForm) {
    destekForm.addEventListener("submit", function (e) {
      const onay = confirm("Mesajınızı göndermek istediğinize emin misiniz?");
      if (!onay) {
        e.preventDefault();
      }
    });
  }

  // Fade-in animasyonu
  const mainImage = document.querySelector(".main-image");
  if (mainImage) {
    mainImage.classList.add("fade-in");
  }

  // Kayıt Formu Validasyon
  const registerForm = document.getElementById("registerForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("errorMessage");

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      let errors = [];

      if (name === "") errors.push("İsim Soyisim alanı boş bırakılamaz.");
      if (!emailPattern.test(email)) errors.push("Geçerli bir e-posta adresi giriniz.");
      if (password.length < 6) errors.push("Şifre en az 6 karakter olmalıdır.");

      if (errors.length > 0) {
        e.preventDefault();
        errorMessage.innerHTML = errors.join("<br>");
        errorMessage.style.color = "red";
      } else {
        errorMessage.textContent = "";
      }
    });
  }
});
