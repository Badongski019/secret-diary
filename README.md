# 💌 Secret Diary

A beautiful, romantic web application where you can write, share, and cherish private letters. Built with React, Firebase, Tailwind CSS, and Framer Motion.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌸 Romantic login | Callsign-protected entry with animated heart background |
| 💌 Envelope gallery | Letters displayed as animated envelopes that open on tap |
| 📖 Letter reader | Paper-textured letter view with image lightbox and music |
| 🎵 Music player | Persistent background music + per-letter songs |
| 🛡️ Admin panel | Hidden `/admin` route with full CRUD, file uploads |
| ☁️ Firebase backend | Firestore + Storage + Authentication |
| 📱 Mobile-first | Fully responsive for Android, iPhone, tablet, desktop |
| ✨ Framer Motion | Envelope opening, paper unfolding, floating hearts |

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone <your-repo>
cd secret-diary
npm install
```

### 2. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com) → **Add project**
2. Enable **Authentication** → Sign-in method → **Email/Password**
3. Enable **Firestore Database** → Start in production mode
4. Enable **Storage** → Start in production mode
5. Go to **Project Settings** → **Your apps** → **Web** → copy the config object

### 3. Create Firebase users

In **Authentication → Users → Add user**, create TWO accounts:

| Role | Email | Password |
|---|---|---|
| Lover (shared) | `lover@your-domain.com` | something secure |
| Admin | `admin@your-domain.com` | something very secure |

### 4. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_CALLSIGN=babuu          # The word your partner types to enter
VITE_LOVER_EMAIL=lover@your-domain.com
VITE_LOVER_PASSWORD=...
VITE_ADMIN_EMAIL=admin@your-domain.com
VITE_ADMIN_PASSWORD=...

VITE_DEFAULT_MUSIC_URL=      # Optional: a Firebase Storage URL for homepage music
VITE_DEFAULT_MUSIC_TITLE=Our Song
```

### 5. Update security rules

In `firestore.rules` and `storage.rules`, replace `admin@your-domain.com` with your actual admin email.

### 6. Deploy Firestore & Storage rules

```bash
npm install -g firebase-tools
firebase login
firebase init firestore storage   # select your project, use existing files
firebase deploy --only firestore:rules,storage:rules
```

### 7. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📦 Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

Your app will be live at `https://YOUR_PROJECT.web.app`

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── auth/          # (reserved for future auth components)
│   ├── layout/
│   │   └── Layout.jsx          # App shell with header & music toggle
│   ├── letters/
│   │   ├── EnvelopeCard.jsx    # Animated envelope with open effect
│   │   └── LikeButton.jsx      # Heart burst like button
│   └── ui/
│       ├── FloatingHearts.jsx  # Background floating heart particles
│       ├── MusicPlayer.jsx     # Full + compact music player
│       └── PageTransition.jsx  # Fade/slide page transitions
├── hooks/             # (reserved for custom hooks)
├── lib/
│   ├── firebase.js             # Firebase app init
│   ├── AuthContext.jsx         # Auth state + lover/admin login
│   ├── MusicContext.jsx        # Global audio player state
│   └── letters.js              # Firestore CRUD + Storage upload
├── pages/
│   ├── LoginPage.jsx           # Callsign login with animated bg
│   ├── HomePage.jsx            # Envelope gallery + global music
│   ├── LetterPage.jsx          # Full letter view with paper unfold
│   ├── AdminLoginPage.jsx      # Admin credentials form
│   ├── AdminPage.jsx           # CRUD dashboard
│   └── NotFoundPage.jsx        # 404
├── styles/
│   └── globals.css             # Tailwind base + custom animations
├── App.jsx                     # Router + protected routes
└── main.jsx                    # Entry point + providers
```

---

## 🗄️ Firestore Schema

**Collection: `letters`**

| Field | Type | Description |
|---|---|---|
| `title` | string | Letter title |
| `content` | string | HTML or plain text content |
| `date` | string | Display date (YYYY-MM-DD) |
| `image` | string | Firebase Storage download URL |
| `music` | string | Firebase Storage download URL |
| `musicTitle` | string | Song name for music player |
| `createdAt` | timestamp | Server timestamp |
| `updatedAt` | timestamp | Server timestamp (on edit) |

---

## 🎨 Design System

| Token | Value | Use |
|---|---|---|
| `petal-*` | Pink palette | Primary accent, buttons |
| `wine` | `#8b3a62` | Text, headings |
| `dusty` | `#c9a0b4` | Muted text, icons |
| `cream-*` | Warm ivory | Backgrounds, envelopes |
| `rose` | `#f2c4d0` | Borders, soft fills |
| `ivory` | `#fdf9f0` | Paper backgrounds |
| Font: Playfair Display | Serif | Headings, letter content |
| Font: Dancing Script | Cursive | Logo, decorative |
| Font: Lato | Sans | Body, UI elements |

---

## 🔒 Security Notes

- The callsign (`babuu`) is checked client-side. For production, it's fine for a private app, but don't use it to protect truly sensitive data.
- Admin access is controlled by Firebase Authentication + Firestore rules — the admin email check is enforced server-side.
- Never commit your `.env` file to version control.
- Rotate your admin password periodically.

---

## 📱 Routes

| Route | Access | Description |
|---|---|---|
| `/login` | Public | Callsign entry |
| `/` | Lover | Envelope gallery + music |
| `/letter/:id` | Lover | Individual letter view |
| `/admin/login` | Public | Admin credentials |
| `/admin` | Admin only | CRUD dashboard |

---

Made with 💗 — may every letter reach its heart.
