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
![main](https://github.com/user-attachments/assets/e24ef41d-d1ee-41b2-9c8e-46ee4051e789)

### 🔐 Erişim Sayfaları

 ![adming](https://github.com/user-attachments/assets/e3d555a1-8e27-411b-bfe4-963dde47e426)
![giriş](https://github.com/user-attachments/assets/3d73db99-0f12-42d7-b366-62c6d13752d3)
![kayıt](https://github.com/user-attachments/assets/ac323836-0a2c-4d43-8ae7-134952d9f5d0)



### 📝 Kullanıcı İşlemleri (Arıza & Destek)
![destek](https://github.com/user-attachments/assets/fb1f0114-a6ae-4315-b88c-5a240805d896)
![kayıtyap](https://github.com/user-attachments/assets/959c204a-30db-40ce-94e4-514f3d39b036)

### 📋 Takip ve Yönetim
![kayıtlar](https://github.com/user-attachments/assets/ebfeeef5-66bc-4f8d-9d54-5627db72d3e3)


**Admin Paneli:** Dashboard üzerinde son arıza kayıtları ve son destek mesajları anlık olarak listelenir.
![arıza_kayıtları](https://github.com/user-attachments/assets/da16b775-dfac-4f4c-9dca-83915b7cbdf5)
![kullanıcı_listesi](https://github.com/user-attachments/assets/c4bd6928-5ecd-48c6-95c2-0ebea186fa18)

![destek_talepleri](https://github.com/user-attachments/assets/14e13461-bcc0-40e3-b401-93b6e3cd41b3)
![son_arıza_kayıtları](https://github.com/user-attachments/assets/de203874-d3de-4a39-bed6-a2e388aae538)


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
