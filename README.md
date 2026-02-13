# 🛠️ Arıza Takip Sistemi | Hayat Kimya Staj Projesi

![Banner](https://img.shields.io/badge/Maintained%3F-yes-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![NodeJS](https://img.shields.io/badge/Node.js-v18.x-6DA55F?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb)

**Arıza Takip Sistemi**, Hayat Kimya bünyesinde gerçekleştirdiğim yaz stajı süresince, kurum içi teknik operasyonların dijitalleşmesi amacıyla geliştirilmiştir. Sistem, çalışanların karşılaştıkları teknik aksaklıkları hızlıca raporlamasını, teknik ekibin ise bu talepleri merkezi bir panelden yönetmesini sağlar.


---

## 🎯 Projenin Amacı ve Kapsamı
Geleneksel yöntemlerle (e-posta veya sözlü) iletilen arıza bildirimlerinin takibindeki zorlukları gidermek adına;
* Süreçleri otomatize etmek,
* Arızaların çözüm sürelerini (SLA) öncelik seviyelerine göre optimize etmek,
* Geçmişe dönük veri analizi için düzenli bir veritabanı yapısı oluşturmak hedeflenmiştir.

---

## ✨ Temel Özellikler

### 👤 Kullanıcı Modülü
- **Gelişmiş Kayıt & Giriş:** Güvenli kimlik doğrulama sistemi.
- **Arıza Bildirimi:** Konu başlığı, detaylı açıklama ve görsel/dosya eki desteği.
- **Dinamik Önceliklendirme:** Arızanın aciliyetine göre *Düşük, Orta, Yüksek* seçim imkanı.
- **Talep Takibi:** Oluşturulan kayıtların durumunu (Beklemede, İşlemde, Çözüldü) canlı izleme.

### 🔑 Admin & Yönetim Modülü
- **Merkezi Dashboard:** Sistemdeki tüm arıza ve destek taleplerinin listelenmesi.
- **Durum Güncelleme:** Kayıtlara admin tarafından çözüm notu eklenmesi ve durumun değiştirilmesi.
- **Mail Entegrasyonu:** Destek taleplerine doğrudan admin paneli üzerinden e-posta ile yanıt verme.
- **Veri Yönetimi:** MongoDB Compass üzerinde tüm süreçlerin şeffaf takibi.

### 🛡️ Güvenlik ve Servisler
- **Şifre Kurtarma:** Unutulan şifreler için sisteme tanımlı özel mail hesabı üzerinden otomatik, rastgele ve güvenli yeni şifre gönderimi.
- **Input Validation:** Form verilerinin sunucu tarafında doğrulanması.

---
## 📸 Uygulama Arayüzü ve Teknik Detaylar

### 🏠 Ana Sayfa (Landing Page)
Uygulamanın giriş noktasıdır. Kullanıcıyı projenin kapsamı hakkında bilgilendiren, modern ve temiz bir "Hero" tasarımı karşılar.
<p align="center">
  <img src="https://github.com/user-attachments/assets/e24ef41d-d1ee-41b2-9c8e-46ee4051e789" width="80%">
</p>

### 🔐 Erişim Sayfaları (Giriş & Kayıt)
Sistemde iki farklı rol (User/Admin) bulunmaktadır. Şifreleme ve güvenli oturum yönetimi uygulanmıştır.
* **Admin Giriş:** Yetkili personelin yönetim paneline erişimi için tasarlanmıştır.
* **Kullanıcı Kayıt & Giriş:** Çalışanların sisteme dahil olduğu ve kimlik doğrulamasının yapıldığı ekranlardır.
<p align="center">
  <img src="https://github.com/user-attachments/assets/e3d555a1-8e27-411b-bfe4-963dde47e426" width="32%">
  <img src="https://github.com/user-attachments/assets/3d73db99-0f12-42d7-b366-62c6d13752d3" width="32%">
  <img src="https://github.com/user-attachments/assets/ac323836-0a2c-4d43-8ae7-134952d9f5d0" width="32%">
</p>

### 📝 Kullanıcı İşlemleri (Arıza & Destek)
Kullanıcıların aktif olarak kullandığı ana form modülleridir.
* **Arıza Kaydı:** Kullanıcılar konu başlığı, detaylı açıklama ve öncelik (Düşük, Orta, Yüksek) seçerek kayıt oluşturur. Form verileri Mongoose üzerinden MongoDB'ye asenkron olarak kaydedilir.
* **Destek Mesajı:** Teknik ekibe genel sorular veya geri bildirimler iletmek için kullanılır.
<p align="center">
  <img src="https://github.com/user-attachments/assets/959c204a-30db-40ce-94e4-514f3d39b036" width="49%">
  <img src="https://github.com/user-attachments/assets/fb1f0114-a6ae-4315-b88c-5a240805d896" width="49%">
</p>

### 📋 Takip ve Listeleme (Kullanıcı Paneli)
Kullanıcılar açtıkları taleplerin güncel durumunu (Beklemede, İşlemde, Çözüldü) buradan izleyebilir. Teknik ekibin yazdığı çözüm notları bu sayfada görünür.
<p align="center">
  <img src="https://github.com/user-attachments/assets/ebfeeef5-66bc-4f8d-9d54-5627db72d3e3" width="80%">
</p>

### 🔑 Admin Yönetim Paneli (Merkezi Dashboard)
Sistemdeki tüm veri akışının kontrol edildiği kısımdır.
* **Dashboard:** Son arıza kayıtları ve son destek mesajları anlık olarak listelenir (Aggregated Data).
* **Yönetim Listeleri:** Tüm arızalar, destek talepleri ve kayıtlı kullanıcılar üzerinde tam kontrol (Silme, Güncelleme) sağlanır.
<p align="center">
  <img src="https://github.com/user-attachments/assets/de203874-d3de-4a39-bed6-a2e388aae538" width="60%">
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/da16b775-dfac-4f4c-9dca-83915b7cbdf5" width="32%">
  <img src="https://github.com/user-attachments/assets/14e13461-bcc0-40e3-b401-93b6e3cd41b3" width="32%">
  <img src="https://github.com/user-attachments/assets/c4bd6928-5ecd-48c6-95c2-0ebea186fa18" width="32%">
</p>

### 👤 Profil Yönetimi (Hesabım)
Kullanıcıların kişisel bilgilerini (Ad, Mail, Şifre) güncelleyebildiği alandır. Veriler güncellendiğinde **MongoDB** üzerinde atomik işlemler gerçekleştirilerek veri bütünlüğü korunur.
<p align="center">
  <img src="https://github.com/user-attachments/assets/09097ceb-ee7b-40ea-9703-33825c9cb117" width="50%">
</p>

