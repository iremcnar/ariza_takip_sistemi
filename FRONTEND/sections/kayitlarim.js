const kayitlarListesi = document.getElementById('kayitlar-listesi');
const token = localStorage.getItem('token');

// 1. Kullanıcı giriş yapmış mı?
if (!token) {
  // Giriş yapılmamış, giriş mesajı + buton göster
  kayitlarListesi.innerHTML = `
    <p style="font-size:1.2rem; text-align:center; margin-bottom:20px;">
      Kayıtlarınıza bakmak için lütfen giriş yapınız.
    </p>
    <div style="text-align:center;">
      <a href="girisyap.html" class="btn">GİRİŞ YAP</a>
    </div>
  `;
} else {
  // 2. Giriş yapılmış, kayıtları çek
  fetch('http://localhost:5000/api/ariza/myfaults', {
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  })
  .then(res => {
    if (!res.ok) throw new Error('Kayıtlar alınamadı.');
    return res.json();
  })
  .then(faults => {
    if (faults.length === 0) {
      // 3. Kayıt yoksa mesaj + kayıt butonu göster
      kayitlarListesi.innerHTML = `
        <p style="font-size:1.2rem; text-align:center; margin-bottom:20px;">
          Henüz arıza kaydınız bulunmamaktadır.
        </p>
        <div style="text-align:center;">
          <a href="index.html#yenikayit-section" class="btn">Arıza Kaydı Yap</a>
        </div>
      `;
      return;
    }

    // 4. Kayıt varsa listele
    kayitlarListesi.innerHTML = '';
    faults.forEach(fault => {
      const durumClass = fault.status.toLowerCase().replace(/ /g, '');
      kayitlarListesi.innerHTML += `
        <div class="kayit-karti">
          <h3>Konu: ${fault.subject}</h3>
          <p><strong>Açıklama:</strong> ${fault.description}</p>
          <p><strong>Öncelik:</strong> ${fault.priority}</p>
          <p><strong>Dosya:</strong> ${fault.fileUrl ? `<a href="${fault.fileUrl}" target="_blank">Dosyayı Gör</a>` : 'Yok'}</p>
          <p class="durum">Durum: <span class="etiket ${durumClass}">${fault.status}</span></p>
        </div>
      `;
    });
  })
  .catch(err => {
    kayitlarListesi.innerHTML = `<p style="color:red; text-align:center;">Bir hata oluştu: ${err.message}</p>`;
  });
}
