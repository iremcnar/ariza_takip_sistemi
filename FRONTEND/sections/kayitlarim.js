const kayitlarListesi = document.getElementById('kayitlar-listesi');
const token = localStorage.getItem('token');

// 1. Kullanıcı giriş yapmış mı?
if (!token) {
  // Giriş yapılmamış, giriş mesajı + buton göster
  kayitlarListesi.innerHTML = `
    <p style="font-size:1.2rem; text-align:center; margin-bottom:20px; color:black;">
      Kayıtlarınıza bakmak için lütfen giriş yapınız.
    </p>
    <div style="text-align:center;">
      <a href="girisyap.html" class="btn" style="background: linear-gradient(45deg, #bbcacd, #14122a); color:white; padding:12px 25px; border-radius:25px; text-decoration:none; font-weight:600;">GİRİŞ YAP</a>
    </div>
  `;
  
} else {
  // 2. Loading göstergesi
  kayitlarListesi.innerHTML = `
    <div style="text-align:center; color:white; padding:40px;">
      <h3>📋 Kayıtlarınız Yükleniyor...</h3>
      <div class="loading-spinner" style="width:50px; height:50px; border:4px solid rgba(255,255,255,0.3); border-top:4px solid white; border-radius:50%; animation:spin 1s linear infinite; margin:20px auto;"></div>
    </div>
  `;

  // 3. Giriş yapılmış, kayıtları çek (doğru endpoint)
  fetch('http://localhost:5000/api/ariza/benim', {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  })
  .then(res => {
    console.log('📡 Response status:', res.status);
    if (!res.ok) {
      if (res.status === 401) {
        // Token geçersiz, giriş sayfasına yönlendir
        localStorage.removeItem('token');
        window.location.href = 'girisyap.html';
        return;
      }
      throw new Error('Kayıtlar alınamadı. HTTP ' + res.status);
    }
    return res.json();
  })
  .then(response => {
    console.log('✅ API Response:', response);
    
    // Backend response formatına göre data çek
    const arizalar = response.data || response;
    
    if (!arizalar || arizalar.length === 0) {
      // 4. Kayıt yoksa mesaj + kayıt butonu göster
      kayitlarListesi.innerHTML = `
        <div style="text-align:center; color:black; padding:60px 20px;">
          <h3 style="font-size:2rem; margin-bottom:20px;">📝 Henüz Kayıt Yok</h3>
          <p style="font-size:1.2rem; margin-bottom:30px; opacity:0.9;">
            Henüz arıza kaydınız bulunmamaktadır.
          </p>
          <a href="index.html#yenikayit-section" class="btn" style="background:linear-gradient(45deg, #bbcacd, #14122a);; color:#ffffff; padding:15px 30px; border-radius:30px; text-decoration:none; font-weight:600; font-size:1.1rem; box-shadow:0 5px 20px rgba(0,0,0,0.1); transition:all 0.3s ease;">
            ➕ Arıza Kaydı Yap
          </a>
        </div>
      `;
      return;
    }

    // 5. Kayıt varsa listele
    let html = `
      <div style="text-align:center; margin-bottom:40px; color:#2d1958">
        <h2 style="font-size:2.5rem; margin-bottom:10px; font-weight:700;">📋 Arıza Kayıtlarım</h2>
        <p style="font-size:1.1rem; opacity:0.9;">Toplam <strong>${arizalar.length}</strong> kayıt bulundu</p>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(400px, 1fr)); gap:25px;">
    `;

    arizalar.forEach((ariza, index) => {
      // Tarih formatla
      const tarih = new Date(ariza.createdAt).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Durum rengini belirle
      let durumClass = '';
      let durumText = '';
      switch(ariza.durum) {
        case 'beklemede':
          durumClass = 'background:#fff3cd; color:#856404;';
          durumText = '⏳ Beklemede';
          break;
        case 'işlemde':
          durumClass = 'background:#cce5ff; color:#004085;';
          durumText = '🔄 İşlemde';
          break;
        case 'çözüldü':
          durumClass = 'background:#d4edda; color:#155724;';
          durumText = '✅ Çözüldü';
          break;
        default:
          durumClass = 'background:#f8f9fa; color:#6c757d;';
          durumText = '❓ Bilinmiyor';
      }

      // Öncelik rengini belirle
      let oncelikClass = '';
      let oncelikText = '';
      switch(ariza.oncelik) {
        case 'düşük':
          oncelikClass = 'background:#d4edda; color:#155724;';
          oncelikText = '🟢 Düşük';
          break;
        case 'orta':
          oncelikClass = 'background:#fff3cd; color:#856404;';
          oncelikText = '🟡 Orta';
          break;
        case 'yüksek':
          oncelikClass = 'background:#f8d7da; color:#721c24;';
          oncelikText = '🔴 Yüksek';
          break;
        default:
          oncelikClass = 'background:#f8f9fa; color:#6c757d;';
          oncelikText = '⚪ Belirsiz';
      }

      html += `
        <div class="kayit-karti" style="background:white; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); padding:25px; transition:all 0.3s ease; border-left:5px solid #667eea;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:15px; gap:15px;">
            <h3 style="font-size:1.3rem; color:#333; font-weight:700; flex:1; line-height:1.3;">${ariza.baslik}</h3>
            <div style="display:flex; flex-direction:column; gap:5px; flex-shrink:0;">
              <span style="padding:5px 12px; border-radius:20px; font-size:0.85rem; font-weight:600; text-align:center; white-space:nowrap; ${durumClass}">${durumText}</span>
              <span style="padding:5px 12px; border-radius:20px; font-size:0.85rem; font-weight:600; text-align:center; white-space:nowrap; ${oncelikClass}">${oncelikText}</span>
            </div>
          </div>
          
          <div style="margin-bottom:20px;">
            <p style="color:#666; margin-bottom:15px; line-height:1.6;"><strong>Açıklama:</strong> ${ariza.aciklama}</p>
            
            ${ariza.dosyalar && ariza.dosyalar.length > 0 ? `
              <div style="background:#f8f9fa; padding:15px; border-radius:8px; margin-bottom:15px;">
                <strong>📎 Ekli Dosyalar:</strong>
                <ul style="list-style:none; margin-top:10px;">
                  ${ariza.dosyalar.map(dosya => `
                    <li style="margin-bottom:5px;">
                      <a href="http://localhost:5000/${dosya.path}" target="_blank" style="color:#667eea; text-decoration:none; font-weight:500;">
                        📄 ${dosya.originalname}
                      </a>
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : '<p style="color:#999; font-style:italic;">📎 Ekli dosya yok</p>'}
            
            ${ariza.adminNotlari && ariza.adminNotlari.length > 0 ? `
              <div style="background:#e8f2ff; padding:15px; border-radius:8px; border-left:4px solid #667eea;">
                <strong>👨‍💼 Admin Notları:</strong>
                <div style="margin-top:10px;">
                  ${ariza.adminNotlari.map(not => `
                    <div style="background:white; padding:10px; border-radius:5px; margin-bottom:8px;">
                      <p style="margin-bottom:5px; color:#333;">${not.text}</p>
                      <small style="color:#666; font-size:0.85rem;">${new Date(not.createdAt).toLocaleDateString('tr-TR')}</small>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
          
          <div style="display:flex; justify-content:space-between; align-items:center; padding-top:15px; border-top:1px solid #eee; font-size:0.9rem; color:#666;">
            <span>📅 ${tarih}</span>
            <span style="font-family:monospace; background:#f8f9fa; padding:3px 8px; border-radius:4px; font-size:0.8rem;">#${ariza._id.slice(-6)}</span>
          </div>
        </div>
      `;
    });

    html += `
      </div>
      <div style="text-align:center; margin-top:40px;">
        <a href="index.html#yenikayit-section" style="display:inline-block; background:white; color:#667eea; padding:15px 30px; border-radius:30px; text-decoration:none; font-weight:600; font-size:1.1rem; box-shadow:0 5px 20px rgba(0,0,0,0.1); transition:all 0.3s ease;">
          ➕ Yeni Kayıt Oluştur
        </a>
      </div>
    `;

    kayitlarListesi.innerHTML = html;
  })
  .catch(err => {
    console.error('❌ Hata:', err);
    kayitlarListesi.innerHTML = `
      <div style="text-align:center; color:white; padding:60px 20px;">
        <h3 style="font-size:2rem; margin-bottom:20px;">⚠️ Hata Oluştu</h3>
        <p style="font-size:1.1rem; margin-bottom:25px;">Kayıtlarınız yüklenirken bir hata oluştu:</p>
        <p style="background:rgba(255,255,255,0.1); padding:15px; border-radius:8px; margin:20px 0; font-family:monospace; word-break:break-word;">${err.message}</p>
        <button onclick="location.reload()" style="background:white; color:#667eea; padding:12px 25px; border-radius:25px; border:none; font-weight:600; cursor:pointer; font-size:1rem;">
          🔄 Tekrar Dene
        </button>
      </div>
    `;
  });
}

// CSS animasyonu ekle
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .kayit-karti:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.15) !important;
  }
`;
document.head.appendChild(style);