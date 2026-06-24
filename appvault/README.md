# AppVault — Android App Store (APKPure-style)

A full-stack Android app store that pulls **live data from Google Play Store** using `google-play-scraper`.

---

## 📁 Project Structure

```
appvault/
├── server.js          ← Express backend (API)
├── package.json
└── public/
    └── index.html     ← Full frontend (no build step needed)
```

---

## 🚀 Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Start the server
```bash
node server.js
```

### 3. Open in browser
```
http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=whatsapp&num=20` | Search apps |
| GET | `/api/top?category=APPLICATION&collection=TOP_FREE&num=30` | Top charts |
| GET | `/api/app/:appId` | Full app details |
| GET | `/api/similar/:appId` | Similar apps |
| GET | `/api/reviews/:appId` | User reviews |
| GET | `/api/categories` | Category list |

### Category IDs
`APPLICATION`, `GAME`, `COMMUNICATION`, `TOOLS`, `VIDEO_PLAYERS`, `PRODUCTIVITY`,
`FINANCE`, `HEALTH_AND_FITNESS`, `EDUCATION`, `PHOTOGRAPHY`, `MUSIC_AND_AUDIO`,
`TRAVEL_AND_LOCAL`, `SHOPPING`, `NEWS_AND_MAGAZINES`, `SPORTS`, `FOOD_AND_DRINK`

### Collection IDs
`TOP_FREE`, `TOP_PAID`, `NEW_FREE`, `NEW_PAID`

---

## ✨ Features

- 🔍 **Live search** — real-time search with debounce
- 📊 **Top Charts** — Top Free, Top Paid, New Free, New Paid
- 📂 **16 Categories** — Games, Social, Tools, Media, Finance, and more
- 📱 **App Detail Modal** — icon, description, stats, screenshots, reviews
- 🔗 **Similar Apps** — loaded inside the detail panel
- ⭐ **User Reviews** — top 3 helpful reviews per app
- 💾 **Download button** — links to Play Store (real APK hosting needs own storage)
- 🦴 **Skeleton loaders** — smooth loading states
- 📱 **Responsive** — works on mobile too

---

## 📝 Notes

- This uses `google-play-scraper` which scrapes Play Store metadata.
- **Actual APK hosting** requires you to download and store APK files yourself.
- To serve real APKs, download the APK file and serve it from `/public/apks/`.
- Add a download route in `server.js`: `app.get('/download/:appId', ...)`.

---

## 🛠 Customize

Edit the `categories` array in `server.js` to add/remove categories.
Edit `public/index.html` to change colors, layout, or branding.
