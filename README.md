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

## 📸 Uygulama Arayüzü (Galeri)

### 🏠 Ana Sayfa
<p align="center">
  <a href="C:\Users\PC\OneDrive\Belgeler\arıza_takipsis\ariza_takip_sistemi\proje_görselleri\main.jpeg
    "
>
    <img src="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/main.jpeg" width="100%" alt="Ana Sayfa">
  </a>
</p>

### 🔐 Erişim Sayfaları
<p align="center">
  <a href="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/adming.jpeg"><img src="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/adming.jpeg" width="32%" alt="Admin Giriş"></a>
  <a href="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/kayıt.jpeg"><img src="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/kayıt.jpeg" width="32%" alt="Kayıt Ol"></a>
  <a href="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/giriş.jpeg"><img src="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/giriş.jpeg" width="32%" alt="Giriş Yap"></a>
</p>

### 📝 Kullanıcı İşlemleri (Arıza & Destek)
<p align="center">
  <a href="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/kayıtyap.jpeg"><img src="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/kayıtyap.jpeg" width="49%" alt="Arıza Kaydı"></a>
  <a href="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/destek.jpeg"><img src="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/destek.jpeg" width="49%" alt="Destek Talebi"></a>
</p>

### 📋 Takip ve Yönetim
<p align="center">
  <a href="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/kayıtlar.jpeg">
    <img src="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/kayıtlar.jpeg" width="100%" alt="Kayıtlarım">
  </a>
</p>

**Admin Paneli:** Dashboard üzerinde son arıza kayıtları ve son destek mesajları anlık olarak listelenir.
<p align="center">
  <a href="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/son_arıza_kayıtları.jpeg">
    <img src="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/son_arıza_kayıtları.jpeg" width="60%" alt="Admin Dashboard">
  </a>
</p>

<p align="center">
  <a href="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/arıza_kayıtları.jpeg"><img src="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/arıza_kayıtları.jpeg" width="32%" alt="Tüm Arızalar"></a>
  <a href="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/destek_talepleri.jpeg"><img src="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/destek_talepleri.jpeg" width="32%" alt="Destek Listesi"></a>
  <a href="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/kullanıcı_listesi.jpeg"><img src="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/kullanıcı_listesi.jpeg" width="32%" alt="Kullanıcılar"></a>
</p>

### 👤 Profil Yönetimi
- **Hesabım:** Kullanıcılar ad, mail ve şifre bilgilerini güncelleyebilir; yapılan her değişiklik eş zamanlı olarak veritabanına yansıtılır.
<p align="center">
  <a href="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/hesabımm.jpeg">
    <img src="https://raw.githubusercontent.com/iremcnar/anza_takip_sistemi/main/hesabımm.jpeg" width="50%" alt="Hesabım">
  </a>
</p>

---

## 📁 Proje Klasör Yapısı (MVC)

```bash
ARIZA_TAKIP_SISTEMI/
├── BACKEND/                    # Sunucu Tarafı
│   ├── Admin/                  # Admin paneli mantığı
│   ├── config/                 # db.js yapılandırması
│   ├── controllers/            # Ana mantık katmanı (admin, ariza, auth, destek, user)
│   ├── middleware/             # Auth ve Upload ara yazılımları
│   ├── models/                 # MongoDB Şemaları (Ariza, Destek, User)
│   ├── routes/                 # API Endpoints
│   ├── uploads/                # Ekli dosyalar
│   └── server.js               # Ana giriş
├── FRONTEND/                   # İstemci Tarafı
│   ├── sections/               # HTML Sayfaları
│   ├── styles/                 # CSS Tasarımları
│   └── assets/                 # Görseller
└── README.md
