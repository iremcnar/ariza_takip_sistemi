document.addEventListener('DOMContentLoaded', () => {
  const supportTableBody = document.getElementById('supportTableBody');
  const token = localStorage.getItem('adminToken');

  if (!token) {
    alert('Admin girişi yapılmamış! Lütfen giriş yapınız.');
    window.location.href = 'admin_login.html'; // Admin giriş sayfasına yönlendir
    return;
  }

  async function fetchSupportRequests() {
    try {
      const response = await fetch('http://localhost:5000/api/destek', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          alert('Giriş yetkiniz yok veya oturumunuz sona erdi. Lütfen tekrar giriş yapın.');
          window.location.href = 'admin_login.html';
          return;
        }
        throw new Error('Destek talepleri alınamadı.');
      }

      const destekler = await response.json();
      supportTableBody.innerHTML = ''; // Tabloyu temizle

      destekler.forEach(destek => {
        const tr = document.createElement('tr');

        // Kullanıcı adı
        const userTd = document.createElement('td');
        userTd.textContent = destek.user && destek.user.name ? destek.user.name : 'Bilinmiyor';
        tr.appendChild(userTd);

        // Mesaj
        const mesajTd = document.createElement('td');
        mesajTd.textContent = destek.mesaj || '-';
        tr.appendChild(mesajTd);

        // Tarih (düzenli formatta)
        const tarihTd = document.createElement('td');
        const date = new Date(destek.createdAt);
        tarihTd.textContent = isNaN(date.getTime()) ? '-' : date.toLocaleString('tr-TR', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit'
        });
        tr.appendChild(tarihTd);

      
        // İşlem (email link)
        const islemTd = document.createElement('td');
        if (destek.user && destek.user.email) {
          const mailLink = document.createElement('a');
          mailLink.href = `mailto:${destek.user.email}`;
          mailLink.textContent = 'Mail Gönder';
          mailLink.classList.add('mail-link');
          islemTd.appendChild(mailLink);
        } else {
          islemTd.textContent = '-';
        }
        tr.appendChild(islemTd);

        supportTableBody.appendChild(tr);
      });

    } catch (error) {
      alert(error.message);
      console.error('Destek talepleri çekilirken hata:', error);
    }
  }

  fetchSupportRequests();
});
