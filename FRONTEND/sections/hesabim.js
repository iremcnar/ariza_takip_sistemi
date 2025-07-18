document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "girisyap.html";
    return;
  }

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  // Kullanıcı bilgilerini getir ve inputlara yaz
  async function fetchUserData() {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Bilgiler alınamadı");
      const data = await res.json();

      nameInput.value = data.name;
      emailInput.value = data.email;
      passwordInput.value = "";
      // Disable inputs by default
      nameInput.disabled = true;
      emailInput.disabled = true;
      passwordInput.disabled = true;

      saveBtn.style.display = "none";
      editBtn.style.display = "inline-block";
    } catch (err) {
      alert("Bilgiler alınamadı, lütfen tekrar giriş yapınız.");
      localStorage.removeItem("token");
      window.location.href = "girisyap.html";
    }
  }

  // Bilgileri düzenlemek için inputları aktif et
  editBtn.addEventListener("click", () => {
    nameInput.disabled = false;
    emailInput.disabled = false;
    passwordInput.disabled = false;

    editBtn.style.display = "none";
    saveBtn.style.display = "inline-block";
  });

  // Bilgileri güncelle (PUT isteği)
  saveBtn.addEventListener("click", async () => {
    const updatedName = nameInput.value.trim();
    const updatedEmail = emailInput.value.trim();
    const updatedPassword = passwordInput.value;

    if (!updatedName || !updatedEmail) {
      alert("İsim ve email boş bırakılamaz.");
      return;
    }

    // İstersen email format kontrolü ekleyebilirsin

    const updateData = { name: updatedName, email: updatedEmail };
    if (updatedPassword) {
      if (updatedPassword.length < 6) {
        alert("Şifre en az 6 karakter olmalı.");
        return;
      }
      updateData.password = updatedPassword;
    }

    try {
      const res = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Güncelleme başarısız.");
      }

      alert("Bilgiler başarıyla güncellendi.");
      fetchUserData(); // Güncel bilgileri tekrar çek
    } catch (err) {
      alert(err.message);
    }
  });

  // Hesabı sil (DELETE isteği)
  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;

    try {
      const res = await fetch("http://localhost:5000/api/user/delete", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Hesap silme başarısız.");
      }

      alert("Hesabınız silindi.");
      localStorage.removeItem("token");
      window.location.href = "girisyap.html";
    } catch (err) {
      alert(err.message);
    }
  });

  // Çıkış yap
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "girisyap.html";
  });

  // Sayfa yüklendiğinde kullanıcı verisini çek
  fetchUserData();
});
