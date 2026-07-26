# 📚 Qashqirli.uz — Yozuvchi Rasmiy Veb-Sayti

![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![Netlify](https://img.shields.io/badge/Hosted_on-Netlify-00C7B7?style=for-the-badge&logo=netlify)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

Yozuvchi **Qashqirli** ning ijodiy namunasi, chop etilgan kitoblari, hikoyalari, maqolalari hamda kitobxonlar bilan muloqot qilish uchun mo'ljallangan zamonaviy interaktiv web-platforma.

🌐 **Demo (Live Preview):** [https://qashqirli.netlify.app](https://qashqirli.netlify.app)

---

## 📌 Asosiy Imkoniyatlar

* 📖 **Asarlar va Kitoblar katalogi:** Muallifning chop etilgan va chop etilmagan kitoblari, hikoyalari hamda qisqa bitiklari.
* 🎧 **Audio va E-kitoblar:** Kitoblarni onlayn mutolaa qilish va audio formatida tinglash imkoniyati.
* 📰 **Muallif Blogi / Maqolalar:** Fikrlar, ijodiy jarayonlar va maqolalar bo'limi.
* 📩 **Bog'lanish va Fikr-mulohaza:** Kitobxonlar va nashriyotlar uchun tezkor aloqa shakli.
* 🌙 **Interfeys:** Zamonaviy, minimalistik hamda qorong'i/yorug' (Dark/Light) rejimni qo'llab-quvvatlovchi dizayn.
* ⚡ **Tezkor va Responsive:** Barcha qurilmalarda (Mobil, Planshet, ПК) to'liq moslashuvchan interfeys.

---

## 🛠 Texnologiyalar Steki

* **Til:** [TypeScript](https://www.typescriptlang.org/)
* **Frontend Framework:** [React.js](https://react.dev/) / [Next.js](https://nextjs.org/)
* **Styling:** Tailwind CSS / Styled-components
* **Icons:** Lucide-React / React-Icons
* **Deployment & Hosting:** [Netlify](https://www.netlify.com/)

---

## 🚀 Loyihani Mahalliy (Local) Ishga Tushirish

### 1. Repozitoriyani klonlash
```bash
git clone [https://github.com/username/qashqirli-uz.git](https://github.com/username/qashqirli-uz.git)
cd qashqirli-uz
2. Bog'liqliklarni (Dependencies) o'rnatish
Bash
npm install
# yoki
yarn install
# yoki
pnpm install
3. Loyihani local muhitda drayv qilish (Development mode)
Bash
npm run dev
# yoki
yarn dev
Sayt mahalliy serverda ishga tushadi: http://localhost:3000 yoki http://localhost:5173

4. Production uchun build qilish
Bash
npm run build
📁 Loyiha Tuzilishi (Project Structure)
Plaintext
├── public/            # Statik fayllar (Rasm, kitob muqovalari, shriftlar)
├── src/
│   ├── assets/        # Media va dizayn resurslari
│   ├── components/    # Qayta ishlatiluvchi UI komponentlar (Navbar, Footer, Card va h.k.)
│   ├── data/          # Kitoblar va asarlar haqidagi ma'lumotlar (JSON/TS constants)
│   ├── pages/         # Bosh sahifa, Asarlar, Blog, Muallif haqida sahifalari
│   ├── styles/        # Global va Tailwind CSS stillari
│   ├── types/         # TypeScript interface va tiplari
│   └── App.tsx        # Asosiy ilova komponenti
├── .gitignore         # Git e'tiborsiz qoldiradigan fayllar
├── netlify.toml       # Netlify deploy sozlamalari
├── package.json       # Loyiha paketlari va skriptlari
├── tsconfig.json      # TypeScript konfigurasiyasi
└── README.md
📝 Kelgusi Rejalar (Roadmap)
[ ] Kitob sotib olish uchun integratsiyalashgan to'lov tizimini ulashtirish

[ ] Izohlar va retsenziyalar qoldirish funksionali

[ ] Multitilli (Uz/En) qo'llab-quvvatlash

👨‍💻 Muallif va Dasturchi
Yozuvchi: Qashqirli

Dasturchi: Shahriyor Muxammadiyev – Backend & AI Developer

📄 Litsenziya
Ushbu loyiha MIT License litsenziyasi ostida tarqatiladi.
