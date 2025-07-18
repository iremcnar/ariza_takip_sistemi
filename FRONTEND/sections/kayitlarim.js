const kayitlarListesi = document.getElementById('kayitlar-listesi');
const token = localStorage.getItem('token');

if (!token) {
  // Giriş yoksa mesaj ve buton göster
  kayitlarListesi.innerHTML = `
    <p id="no-kayit-mesaji">Lütfen giriş yapınız.</p>
    <div style="text-align:center;">
      <a href="girisyap.html" class="btn">Giriş Yap</a>
    </div>
  `;
} else {
  // Giriş varsa kayıtları çek
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
      // Kayıt yoksa farklı mesaj ve buton göster
      kayitlarListesi.innerHTML = `
        <p id="no-kayit-mesaji">Henüz arıza kaydınız bulunmamaktadır.</p>
        <div style="text-align:center;">
          <a href="index.html#yenikayit-section" class="btn">Arıza Kaydı Yap</a>
        </div>
      `;
      return;
    }

    // Kayıt varsa listele
    kayitlarListesi.innerHTML = '';
    faults.forEach(fault => {
      const durumClass = fault.status.toLowerCase().replace(' ', '');
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
