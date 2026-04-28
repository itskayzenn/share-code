# ⚡ Kayzen ShareCode V2

Platform berbagi snippet kode modern dengan sistem kategori, manajemen database via Supabase, dan pusat notifikasi real-time.

## 🛠 Tech Stack
- **Frontend:** Vanilla JS, Tailwind CSS 3.4
- **Backend:** Supabase (Database & Auth)
- **Deployment:** Vercel
- **Icons:** FontAwesome 6
- **Notifications:** Telegram Bot API Integration

## 🌟 Key Features
- **Notification Center:** Lonceng notifikasi untuk pengumuman admin.
- **Category System:** Filter snippet berdasarkan AI, Anime, Scraper, dll.
- **Modern Dashboard:** UI Admin untuk manajemen konten dan broadcast pengumuman.
- **SEO Optimized:** Meta tag lengkap untuk sharing sosial media.
- **Responsive Design:** Pengalaman maksimal di Mobile maupun Desktop.

## 🚀 Setup Database
Gunakan schema SQL berikut di Supabase Dashboard:
1. Buat tabel `snippets` dengan kolom: `title`, `code`, `category`.
2. Buat tabel `announcements` dengan kolom: `title`, `message`.

## 🔑 Security
Dashboard admin dilindungi dengan *Access Key* statis dan notifikasi alert ke Telegram setiap kali dashboard diakses.
