document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("recordTableBody");
  const token = localStorage.getItem("adminToken");

  if (!token) {
    alert("Giriş yapmanız gerekiyor!");
    window.location.href = "/FRONTEND/sections/Admin/admin-login.html";
    return;
  }

  try {
    console.log("API çağrısı başlatılıyor...");
    
    // 
    const response = await fetch("http://localhost:5000/api/ariza/arizalar", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Hatası:", errorText);
      
      if (response.status === 401) {
        alert("Oturum süreniz dolmuş. Tekrar giriş yapın.");
        localStorage.removeItem("adminToken");
        window.location.href = "/FRONTEND/sections/Admin/admin-login.html";
        return;
      }
      
      throw new Error(`Kayıtlar yüklenemedi! Status: ${response.status}`);
    }

    const records = await response.json();
    console.log("Gelen kayıtlar:", records);

    if (!Array.isArray(records) || records.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7">Henüz kayıt bulunmuyor.</td></tr>';
      return;
    }

    tableBody.innerHTML = ""; // Tabloyu temizle

    records.forEach((record) => {
      const row = document.createElement("tr");

      // Son admin notunu al
      const lastAdminNote = (record.adminNotlari && record.adminNotlari.length > 0) 
        ? record.adminNotlari[record.adminNotlari.length - 1].text 
        : '';

      row.innerHTML = `
        <td>${record.user?.name || record.user?.email || "Bilinmiyor"}</td>
        <td>${record.baslik || ""}</td>
        <td style="max-width: 300px; word-wrap: break-word;">${record.aciklama || ""}</td>
        <td>${new Date(record.createdAt || record.date).toLocaleString("tr-TR")}</td>
        <td>
          <select data-id="${record._id}" class="status-select" style="padding: 5px;">
            <option value="beklemede" ${record.durum === "beklemede" ? "selected" : ""}>Beklemede</option>
            <option value="işlemde" ${record.durum === "işlemde" ? "selected" : ""}>İşlemde</option>
            <option value="çözüldü" ${record.durum === "çözüldü" ? "selected" : ""}>Çözüldü</option>
          </select>
        </td>
        <td>
          <input type="text" class="admin-reply" value="${lastAdminNote}" data-id="${record._id}" placeholder="Admin notu..." style="width: 200px; padding: 5px;" />
        </td>
        <td>
          <button class="save-btn" data-id="${record._id}" style="padding: 5px 10px; background: #622457ff; color: white; border: none; border-radius: 3px; cursor: pointer;">Kaydet</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    console.log(`✅ ${records.length} kayıt tabloya eklendi`);

    // Kaydet butonları için event listener'lar
    document.querySelectorAll(".save-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const status = document.querySelector(`select[data-id="${id}"]`).value;
        const adminReply = document.querySelector(`input[data-id="${id}"]`).value;

        console.log("Güncelleme verileri:", { id, status, adminReply });

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

          console.log("Update response status:", updateResponse.status);

          if (!updateResponse.ok) {
            const errText = await updateResponse.text();
            console.error("Güncelleme hatası:", errText);
            alert("Güncelleme başarısız: " + errText);
            return;
          }

          const updatedRecord = await updateResponse.json();
          console.log("Güncellenen kayıt:", updatedRecord);
          
          // Başarı mesajı ve buton rengini yeşil yap
          alert("✅ Kayıt başarıyla güncellendi!");
          button.style.background = "#28a745";
          
          // 2 saniye sonra normal renge döndür
          setTimeout(() => {
            button.style.background = "#007bff";
          }, 2000);
          
        } catch (err) {
          console.error("Güncelleme hatası:", err);
          alert("❌ Güncelleme sırasında hata oluştu: " + err.message);
          
          // Hata durumunda kırmızı yap
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

  } catch (err) {
    console.error("Kayıtlar yüklenemedi:", err);
    alert("Kayıtlar yüklenemedi: " + err.message);
  }
});