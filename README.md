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
![anasayfa](https://github.com/user-attachments/assets/dc26618e-1d9c-4a0c-941e-ffdb8054902e)

---

## 📸 Uygulama Arayüzü

| Ana Sayfa & Karşılama | Yeni Arıza Bildirimi | Kayıtlarım & Durum Takibi |
| :---: | :---: | :---: |
| ![Ana Sayfa](https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/image_b08cdc.jpg) | ![Kayıt Formu](https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/image_b08ce1.jpg) | ![Kayıtlarım](https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/image_b08d21.jpg) |

> **Veritabanı Yapısı:** Projede MongoDB kullanılmış olup; `arizas`, `desteks` ve `users` koleksiyonları ile ilişkisel olmayan ancak düzenli bir veri mimarisi kurulmuştur.

---

## 🛠️ Teknik Yığın (Tech Stack)

### **Frontend**
* **HTML5 & CSS3:** Modern, temiz ve kullanıcı dostu arayüz tasarımı.
* **JavaScript (Vanilla):** DOM manipülasyonu ve asenkron (Fetch API) işlemler.
* **Responsive Design:** Farklı ekran boyutlarına uyumlu yapı.

### **Backend**
* **Node.js:** Ölçeklenebilir ve hızlı sunucu altyapısı.
* **Express.js:** RESTful API mimarisi ve middleware yönetimi.
* **Nodemailer:** SMTP protokolü ile otomatik e-posta gönderim servisi.

### **Veritabanı**
* **MongoDB:** JSON tabanlı esnek veri depolama.
* **Mongoose:** Veri modelleme ve şema yönetimi.

