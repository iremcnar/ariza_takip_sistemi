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

  // Fare hareketiyle tilt efektini tamamen kaldırın
  // Bu kodu silin veya yorum satırı yapın
  /*
  document.querySelector('.yenikayit-container').addEventListener('mousemove', (e) => {
      // Tilt kodu burada
  });
  */

  // Sadece hover efekti için basit JavaScript
  const yenikayitContainer = document.querySelector('.yenikayit-container');
  if (yenikayitContainer) {
    yenikayitContainer.addEventListener('mouseenter', (e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
    });

    yenikayitContainer.addEventListener('mouseleave', (e) => {
      e.currentTarget.style.transform = 'translateY(0)';
    });
  }

  // --- ARIZA KAYIT FORMU İŞLEMİ (TEK VE DÜZELTİLMİŞ) ---
  const arizaForm = document.getElementById('arizaForm');
  const fileInput = document.getElementById('dosyalar');
  const fileDisplay = document.getElementById('file-display');
  const fileName = document.getElementById('file-name');
  const removeFile = document.getElementById('remove-file');

  if (arizaForm) {
    // Dosya yükleme işlevselliği
    if (fileInput && fileDisplay && fileName && removeFile) {
      // Dosya seçme alanına tıklandığında
      fileDisplay.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.click();
      });

      // Dosya seçildiğinde
      fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
          if (files.length === 1) {
            fileName.textContent = `📎 ${files[0].name}`;
          } else {
            fileName.textContent = `📎 ${files.length} dosya seçildi`;
          }
          removeFile.style.display = 'inline-block';
        } else {
          fileName.textContent = '📎 Dosya Yükle';
          removeFile.style.display = 'none';
        }
      });

      // Dosya silme butonuna tıklandığında
      removeFile.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        fileInput.value = '';
        fileName.textContent = '📎 Dosya Yükle';
        removeFile.style.display = 'none';
      });
    }

    // Form gönderme işlemi (TEK LISTENER)
    let isSubmitting = false; // Çoklu gönderim önleme
    
    arizaForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Eğer zaten gönderim işlemi devam ediyorsa, tekrar gönderme
      if (isSubmitting) {
        return;
      }

      isSubmitting = true;

      // Submit butonunu devre dışı bırak
      const submitBtn = this.querySelector('button[type="submit"]') || this.querySelector('input[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Gönderiliyor...';
      }

      const formData = new FormData(this);
      const token = localStorage.getItem('token');

      // Giriş kontrolü
      if (!token) {
        alert('Lütfen önce giriş yapınız!');
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        return;
      }

      // Form doğrulama
      const baslik = formData.get('baslik');
      const aciklama = formData.get('aciklama');

      if (!baslik || !baslik.trim()) {
        alert('Lütfen konu başlığını giriniz!');
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        return;
      }

      if (!aciklama || !aciklama.trim()) {
        alert('Lütfen açıklama giriniz!');
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/ariza/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          
          // Başarı mesajı göster
          showSuccessMessage();

          // Formu temizle
          this.reset();
          if (fileName) fileName.textContent = '📎 Dosya Yükle';
          if (removeFile) removeFile.style.display = 'none';
          
          // Orta öncelik seçeneğini varsayılan olarak seç
          const ortaOncelik = document.querySelector('input[name="oncelik"][value="orta"]');
          if (ortaOncelik) ortaOncelik.checked = true;

        } else {
          const error = await response.json();
          alert('Hata oluştu: ' + error.message);
        }
      } catch (err) {
        console.error('İstek hatası:', err);
        alert('Sunucuya bağlanırken bir hata oluştu.');
      } finally {
        // Her durumda işlemi tamamla ve butonu aktif et
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });

    // Input alanlarına gerçek zamanlı validasyon ekle
    const inputs = arizaForm.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', function() {
        if (!this.value.trim()) {
          this.style.borderColor = '#e74c3c';
        } else {
          this.style.borderColor = '#27ae60';
        }
      });

      input.addEventListener('input', function() {
        if (this.value.trim()) {
          this.style.borderColor = '#27ae60';
        } else {
          this.style.borderColor = '#CCCCCC';
        }
      });
    });

    // Textarea otomatik yükseklik ayarlama
    const textarea = document.getElementById('aciklama');
    if (textarea) {
      textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
      });
    }
  }

  // Başarı mesajı gösterme fonksiyonu
  let isShowingSuccessMessage = false; // Çoklu mesaj önleme
  
  function showSuccessMessage() {
    // Eğer zaten mesaj gösteriliyorsa, yeni mesaj gösterme
    if (isShowingSuccessMessage) {
      return;
    }
    
    isShowingSuccessMessage = true;

    // Mevcut başarı mesajlarını kaldır
    const existingMessages = document.querySelectorAll('.success-message');
    existingMessages.forEach(msg => msg.remove());

    // Yeni başarı mesajı oluştur
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #27ae60, #2ecc71);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
      ">
        ✅ Arıza kaydınız başarıyla gönderildi!
      </div>
    `;
    

    // Animasyon CSS'i ekle
    if (!document.querySelector('#success-animation-style')) {
      const style = document.createElement('style');
      style.id = 'success-animation-style';
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(successMessage);

    // 5 saniye sonra mesajı kaldır (daha uzun süre)
    setTimeout(() => {
      const messageDiv = successMessage.querySelector('div');
      if (messageDiv) {
        messageDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          if (successMessage && successMessage.parentNode) {
            successMessage.remove();
          }
          isShowingSuccessMessage = false; // Bayrağı sıfırla
        }, 300);
      } else {
        isShowingSuccessMessage = false; // Bayrağı sıfırla
      }
    }, 5000); // 5 saniye bekle
  }

  // --- DESTEK FORMU ---
  const destekForm = document.getElementById('destekForm');
  if (destekForm) {
    destekForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const mesaj = document.getElementById('destekMesaj').value;

      // Mesaj doğrulama
      if (!mesaj || !mesaj.trim()) {
        alert('Lütfen mesajınızı yazınız!');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/destek', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Giriş yapıldıysa
          },
          body: JSON.stringify({ mesaj })
        });

        if (response.ok) {
          // Başarı mesajı göster (arıza formu ile aynı stil)
          showDestekSuccessMessage();
          document.getElementById('destekMesaj').value = '';
        } else {
          const hata = await response.json();
          alert('⚠️ Hata: ' + (hata.message || 'Mesaj gönderilemedi.'));
        }
      } catch (err) {
        alert('⛔ Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
        console.error(err);
      }
    });
  }

  // Destek formu başarı mesajı gösterme fonksiyonu
  function showDestekSuccessMessage() {
    // Mevcut başarı mesajını kaldır
    const existingMessage = document.querySelector('.destek-success-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Yeni başarı mesajı oluştur
    const successMessage = document.createElement('div');
    successMessage.className = 'destek-success-message';
    successMessage.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #27ae60, #2ecc71);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
      ">
        ✅ Destek mesajınız başarıyla gönderildi!
      </div>
    `;

    document.body.appendChild(successMessage);

    // 3 saniye sonra mesajı kaldır
    setTimeout(() => {
      const messageDiv = successMessage.querySelector('div');
      messageDiv.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        successMessage.remove();
      }, 300);
    }, 3000);
  }

  // --- ANA SAYFA GÖRSEL SLIDESHOWa ---
  const images = [
    "img/main.jpg",
    "img/main2.jpg",
    "img/main3.jpg",
  ];

  const container = document.querySelector(".main-image-container");

  if (container) {
    // Önce container içindeki tek resmi temizle
    container.innerHTML = "";

    // 3 img elementini oluştur ve yan yana koy
    const imgElements = images.map((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.classList.add("main-image");
      img.style.left = (i * 100) + "%"; // 0%, 100%, 200%
      container.appendChild(img);
      return img;
    });

    let currentIndex = 0;

    setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      imgElements.forEach((img, i) => {
        img.style.left = ((i - currentIndex) * 100) + "%";
      });
    }, 2000);
  }
});

// Ekstra: Formu programatik olarak temizleme fonksiyonu
function temizleArizaFormu() {
  const form = document.getElementById('arizaForm');
  const fileName = document.getElementById('file-name');
  const removeFile = document.getElementById('remove-file');
  
  if (form) {
    form.reset();
    if (fileName) fileName.textContent = '📎 Dosya Yükle';
    if (removeFile) removeFile.style.display = 'none';
  }
}

