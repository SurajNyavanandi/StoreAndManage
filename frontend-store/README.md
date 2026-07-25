# 🛍️ StoreAndManage (Frontend)

## 📌 Idea

Simple ecommerce UI:

* Men's Wear
* Women's Wear
* Kids Wear

Goal 👉 Startup-level UI + Job-ready project 🔥

---

## ⚙️ Tech Stack

* React 19.2.4
* Vite 8.0.4
* Tailwind CSS v4.2.2
* Lucide React (Icons)
* React Router v7

---

## 🚀 Setup

```bash
npm create vite@latest frontend-store
# Select → React → JavaScript

cd frontend-store
npm install
npm run dev
```

---

## 🎨 Tailwind Setup (v4)

```bash
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
```

### index.css

```css
@import "tailwindcss";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
}

body {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

#root {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
```

### postcss.config.js

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

### tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## ❌ Mistakes I Did

* Used Create React App (outdated) ❌
* Ran npm commands inside `src` ❌
* Used wrong Tailwind directive (`@tailwind` instead of `@import "tailwindcss"`) ❌
* Missing `postcss.config.js` ❌
* Expected Bootstrap-like setup ❌
* Used `npm start` in Vite ❌
* Old CSS conflicting with Tailwind ❌

---

## ✅ Learnings

* Use Vite for modern React apps ✅
* Tailwind v4 uses `@import "tailwindcss"` syntax ✅
* Always create `postcss.config.js` with `@tailwindcss/postcss` ✅
* Always run commands in root folder ✅
* Version compatibility matters ✅
* Clean CSS (no conflicting styles) ✅
* Debugging is part of development 🔥

---

## 🧩 Features

### ✅ Done

* Project setup (Vite + React 19)
* Tailwind CSS v4 setup
* Header component with responsive design
  - Logo (stoReAndManage - R, A, M in blue)
  - Navigation menu (Store & Manage, Kids, Men, Women)
  - Search bar with icon
  - Cart icon with badge
  - Profile icon
  - Mobile hamburger menu
  - Fully responsive (mobile, tablet, desktop)

### ⏳ Pending

* Home page (carousel + cards)
* Product listing
* Product detail page
* Cart page
* Checkout
* User authentication
* Animations
* Footer

---

## 🎯 Goal

* Clean UI ✅
* Real startup feel ✅
* Impress recruiters ✅

---

## 🧠 Mindset

"Less features + perfect UI = 🔥 impact"