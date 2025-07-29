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

// ========== ARIZA KAYITLARI ========== (Düzeltilmiş versiyon)
const recordTable = document.getElementById("recordTableBody");
if (recordTable) {
  const token = checkAdminAuth();

  console.log('🔍 Arıza kayıtları yükleniyor...');

  fetch("http://localhost:5000/api/ariza/arizalar", {  // ✅ Yeni endpoint
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      console.log('📡 Response status:', res.status);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Arıza kayıtları yüklenirken hata oluştu.`);
      }
      return res.json();
    })
    .then(data => {
      console.log('📊 Gelen veri:', data);
      
      // Backend'den gelen veri formatına göre kayıtları al
      const records = Array.isArray(data) ? data : data.arizalar || [];
      
      if (records.length === 0) {
        recordTable.innerHTML = '<tr><td colspan="6" style="text-align: center;">Henüz arıza kaydı bulunmuyor.</td></tr>';
        return;
      }

      // Tabloyu temizle
      recordTable.innerHTML = "";

      records.forEach(r => {
        console.log('📝 İşlenen kayıt:', r);
        
        // Son admin notunu al
        const lastAdminNote = (r.adminNotlari && r.adminNotlari.length > 0) 
          ? r.adminNotlari[r.adminNotlari.length - 1].text 
          : '';

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${r.user?.name || r.user?.email || "Bilinmiyor"}</td>
          <td>${r.baslik || "-"}</td>
          <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${r.aciklama || "-"}</td>
          <td>${new Date(r.createdAt).toLocaleDateString("tr-TR")}</td>
          <td>
            <select data-id="${r._id}" class="status-select" style="padding: 5px;">
              <option value="beklemede" ${r.durum === "beklemede" ? "selected" : ""}>Beklemede</option>
              <option value="işlemde" ${r.durum === "işlemde" ? "selected" : ""}>İşlemde</option>
              <option value="çözüldü" ${r.durum === "çözüldü" ? "selected" : ""}>Çözüldü</option>
            </select>
          </td>
          <td>
            <input type="text" class="admin-reply" value="${lastAdminNote}" data-id="${r._id}" placeholder="Admin notu..." style="width: 150px; padding: 5px;" />
          </td>
          <td>
            <button class="save-btn" data-id="${r._id}" style="padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">Kaydet</button>
          </td>
        `;
        recordTable.appendChild(row);
      });

      console.log(`✅ ${records.length} kayıt tabloya eklendi`);

      // Kaydet butonları için event listener'lar ekle
      addSaveButtonListeners(token);

    })
    .catch(err => {
      console.error('❌ Arıza kayıtları yükleme hatası:', err);
      alert("Arıza kayıtları yüklenemedi: " + err.message);
      
      // Hata durumunda tablo içeriği
      recordTable.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">❌ Hata: ${err.message}</td></tr>`;
    });
}

// Kaydet buton işlevselliğini ayrı fonksiyon olarak tanımla
function addSaveButtonListeners(token) {
  document.querySelectorAll(".save-btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const status = document.querySelector(`select[data-id="${id}"]`).value;
      const adminReply = document.querySelector(`input[data-id="${id}"]`).value;

      console.log('💾 Güncelleme verileri:', { id, status, adminReply });

      try {
        // Buton durumunu değiştir
        button.disabled = true;
        button.textContent = "Kaydediliyor...";
        button.style.background = "#6c757d";

        const updateResponse = await fetch(`http://localhost:5000/api/ariza/update/${id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ durum: status, adminReply }),
        });

        console.log('📡 Update response status:', updateResponse.status);

        if (!updateResponse.ok) {
          const errText = await updateResponse.text();
          console.error('❌ Güncelleme hatası:', errText);
          throw new Error(`Güncelleme başarısız (${updateResponse.status}): ${errText}`);
        }

        const updatedRecord = await updateResponse.json();
        console.log('✅ Güncellenen kayıt:', updatedRecord);
        
        alert("✅ Kayıt başarıyla güncellendi!");
        
        // Başarılı güncelleme sonrası buton rengini yeşil yap
        button.style.background = "#28a745";
        setTimeout(() => {
          button.style.background = "#007bff";
        }, 2000);
        
      } catch (err) {
        console.error('❌ Güncelleme hatası:', err);
        alert("❌ Güncelleme sırasında hata oluştu: " + err.message);
        
        // Hata durumunda buton rengini kırmızı yap
        button.style.background = "#dc3545";
        setTimeout(() => {
          button.style.background = "#007bff";
        }, 3000);
      } finally {
        // Buton durumunu geri al
        button.disabled = false;
        button.textContent = "Kaydet";
      }
    });
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


async function loadRecentRecords() {
  const container = document.getElementById("recentRecords");
  const token = localStorage.getItem("adminToken");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/ariza/arizalar", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Arıza kayıtları yüklenemedi");
    const data = await res.json();

    container.innerHTML = "";

    if (!data.length) {
      container.innerHTML = `<div class="no-data">Henüz arıza kaydı yok.</div>`;
      return;
    }

    // Tarihe göre azalan (en yeni önce) sırala
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // İlk 5 kaydı al
    const latestFive = data.slice(0, 5);

    latestFive.forEach(r => {
      const dateStr = new Date(r.createdAt).toLocaleDateString("tr-TR");
      let statusClass = "";
      switch(r.durum) {
        case "beklemede": statusClass = "status-pending"; break;
        case "işlemde": statusClass = "status-inprogress"; break;
        case "çözüldü": statusClass = "status-completed"; break;
      }

      container.insertAdjacentHTML("beforeend", `
        <div class="record-card">
          <div class="record-header">
            <div class="record-id">${r._id.slice(-6)}</div>
            <div class="record-date">${dateStr}</div>
            <div class="record-status ${statusClass}">${r.durum}</div>
          </div>
          <div class="record-content">
            <div class="record-field"><span class="field-label">Başlık:</span> <span class="field-value">${r.baslik || "-"}</span></div>
            <div class="record-field"><span class="field-label">Açıklama:</span> <span class="field-value">${r.aciklama || "-"}</span></div>
          </div>
        </div>
      `);
    });
  } catch (err) {
    container.innerHTML = `<div class="no-data" style="color:red;">Hata: ${err.message}</div>`;
  }
}
async function loadRecentMessages() {
  const container = document.getElementById("recentMessages");
  const token = localStorage.getItem("adminToken");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/admin/destek", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Destek mesajları yüklenemedi");
    const data = await res.json();

    container.innerHTML = "";

    if (!data.length) {
      container.innerHTML = `<div class="no-data">Henüz destek mesajı yok.</div>`;
      return;
    }

    // Tarihe göre azalan sırala
    data.sort((a, b) => new Date(b.createdAt || b.tarih) - new Date(a.createdAt || a.tarih));

    const latestFive = data.slice(0, 5);

    latestFive.forEach(msg => {
      const dateStr = new Date(msg.createdAt || msg.tarih).toLocaleDateString("tr-TR");
      const sender = msg.user?.name || msg.kullanici || "Bilinmiyor";

      container.insertAdjacentHTML("beforeend", `
        <div class="message-card">
          <div class="message-header">
            <div class="message-sender">${sender}</div>
            <div class="message-date">${dateStr}</div>
          </div>
          <div class="message-content">${msg.mesaj || "-"}</div>
        </div>
      `);
    });
  } catch (err) {
    container.innerHTML = `<div class="no-data" style="color:red;">Hata: ${err.message}</div>`;
  }
}
