# DearDiary 🪶

> A simple, polished digital diary web application designed for calm, focused personal reflection, daily goal tracking, thoughts, and mood logging.

![DearDiary Banner](https://img.shields.io/badge/DearDiary-v1.0.0-4A6B5D?style=for-the-badge)

## 🌟 Overview & Features

DearDiary is built with a warm, uncluttered aesthetic to minimize distraction and prioritize the writing experience.

### 1. **Login & Sign Up Screen (`AuthScreen.js`)**

- Reassuring, welcoming intro with security reassurance.
- Sign in, Create Account, and Forgot Password flows.
- Password input with eye toggle button (`PasswordInput.js`).
- One-click demo login (`demo@diary.app`).
- Decoupled `AuthService` abstraction layer easily adaptable to Firebase, Supabase, or REST backends.

### 2. **Home Dashboard (`HomeScreen.js`)**

- Personalized greeting and formatted full date.
- Prominent **"Write today's entry"** action card.
- Pressure-free writing streak indicator (e.g. `🔥 3 day streak`) & weekly dominant mood badge.
- Compact recent entry previews with tags and mood indicators.
- Calm empty state with CTA to start writing or load realistic demo entries.

### 3. **Write & Edit Screen (`WriteScreen.js`)**

- Clean title & body text fields formatted in high-legibility serif typography (`Lora`).
- Customizable date picker defaulting to today.
- 7 clear mood selector choices with custom HSL badges (`MoodBadge.js`).
- Preset and custom tag generator (`TagInput.js`).
- **Autosave Drafts**: Automatically saves active writing to browser draft storage, displaying real-time status (`Draft saved at 20:16`).
- Unsaved changes safeguard: Confirmation modal before discarding drafts.
- Keyboard Shortcut: `Cmd + S` or `Ctrl + S` to save instantly.

### 4. **Diary History (`HistoryScreen.js`)**

- Reverse-chronological listing of all past entries.
- Real-time text search across title, body content, and tags.
- Flexible filters: Filter by mood (`Calm`, `Happy`, `Grateful`, etc.), tag (`#Mindfulness`, `#Work`, etc.), or date range (Past 7 Days, Past 30 Days).
- Full readable modal view for inspecting complete entries.
- Direct Edit and Confirmable Delete modal actions (`ConfirmModal.js`).

### 5. **Profile & Settings (`ProfileScreen.js`)**

- View and edit display name, personal bio/reflection statement, and daily writing reminder time.
- **Visual Themes**: Switch between **Gentle Light**, **Serene Dark**, and **Warm Sepia**.
- **Data Privacy & Backup**:
  - Export entries to **JSON** backup or **Markdown** document.
  - Import previous JSON backup files.
  - Load or remove sample demo entries.
- **Danger Zone**: Confirmable destructive actions ("Clear All My Entries" and "Delete Account & Data").

---

## 🚀 How to Run the App

Since DearDiary uses standard ES modules and browser runtime JSX via React 18, you can serve it with any local static web server.

### Option 1: Python HTTP Server (Recommended)

Run the following command in the root folder:

```bash
python3 -m http.server 5173
```

Then open your browser at [http://localhost:5173](http://localhost:5173).

### Option 2: Node static server / npx serve

```bash
npx serve .
```

---

## 📂 Project Structure

```
uedvr/
├── index.html                 # Entry point with Google Fonts & React scripts
├── css/
│   ├── main.css               # Design system, CSS variables & theme tokens
│   ├── components.css         # Buttons, cards, modals, form inputs & toasts
│   └── responsive.css         # Mobile bottom bar & desktop grid layouts
├── js/
│   ├── app.js                 # Main React App router & global state controller
│   ├── mockData.js            # Sample realistic diary entries for demo state
│   ├── services/
│   │   ├── authService.js     # Auth logic, local session management & profiles
│   │   └── storageService.js  # Diary entries CRUD, auto-save drafts, export/import
│   ├── components/
│   │   ├── Navbar.js          # Header & mobile navigation bar
│   │   ├── PasswordInput.js   # Reusable password field with eye toggle
│   │   ├── MoodBadge.js       # Mood badges & interactive selection
│   │   ├── TagInput.js        # Interactive tags chip manager
│   │   ├── ConfirmModal.js    # Accessible confirmation dialog modal
│   │   └── ToastNotification.js # Toast notifications system
│   └── screens/
│       ├── AuthScreen.js      # Login, Sign Up, and Forgot Password screen
│       ├── HomeScreen.js      # Home dashboard & stats
│       ├── WriteScreen.js     # Entry editor with autosave draft
│       ├── HistoryScreen.js   # Searchable diary history & detail view
│       └── ProfileScreen.js   # User profile, theme picker & data export/import
└── README.md
```
