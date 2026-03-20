# PackMate – Collaborative Travel Packing List Sharer

![PackMate Dashboard](./screenshots/home.png)

---

## Authors

**Rachit Patel** – patel.rachi@northeastern.edu  
**Prajakta Avachat** – avachat.pr@northeastern.edu

---

## Class Link

**Course:** CS 5610 – Web Development  
**Institution:** Northeastern University  
**Semester:** Spring 2026  
**Assignment Page:** [https://johnguerra.co/classes/webDevelopment_online_spring_2026/](https://johnguerra.co/classes/webDevelopment_online_spring_2026/)

---

## Deployment

**Live Application:** https://packmate-frontend-five.vercel.app/

The application is deployed on Vercel with MongoDB Atlas for the database.

---

## Video Demo

[Link to narrated video demonstration – to be added]

---

## Slides

https://docs.google.com/presentation/d/1yK7NN8nF-mYBXKhguoKBxzNFqB3UfK6LAZp7LlPA9EU/edit?usp=sharing

---

## Design Document

See [DESIGN_DOCUMENT.md](./DESIGN-DOCUMENT.md) for full project design including mockups and schema diagrams.

---

## Project Objective

Travelers waste hours researching what to pack, often forgetting essentials or over-packing for the wrong climate especially students going abroad or taking their first solo trip. **PackMate** solves this by letting travelers build and manage structured packing lists for their trips while the community contributes and upvotes real-world packing tips per trip type.

Users create a trip by entering their destination, climate, trip type, and duration, then build their packing list by selecting from a categorized master items database (Clothing, Electronics, Toiletries, Documents, Activity Gear) and adding custom items of their own. Community members who've traveled to similar destinations can share and upvote packing tips, which appear alongside each trip's list. Students save significant planning time by browsing proven community advice instead of starting from scratch — and after their trip, they contribute back, creating a self-improving feedback loop.

---

## Screenshots

### Home

![Home](./screenshots/home.png)

### Login

![Login](./screenshots/login.png)

### Profile

![Profile](./screenshots/profile.png)

### My Trips

![My Trips](./screenshots/mytrips.png)

### Trip Details

![Trip Details](./screenshots/tripdetails.png)

### Community

![Community](./screenshots/community.png)

### Tips

![Community](./screenshots/tips.png)

---

## User Personas

**Sarah** – CS junior studying abroad in Europe who needs a carry-on-only packing list for cold weather and business casual settings.

**Marcus** – Freshman taking his first solo beach trip who is overwhelmed by packing and wants to browse what experienced travelers recommend.

**Priya** – Graduate student organizing a group hiking trip who needs a structured gear checklist and wants advice from people who've done similar trips.

**Alex** – Budget backpacker hopping between multiple countries who needs minimalist lists and proven tips for long multi-destination travel.

---

## User Stories

### Rachit's Scope (Trips & Packing Items)

- As a traveler, I want to create a trip by entering destination, climate, type, and duration so I have a dedicated space to build my packing list.
- As a traveler, I want to view all my trips in a dashboard so I can manage multiple upcoming trips at once.
- As a traveler, I want to update my trip details (dates, luggage type, destination) so my trip information stays accurate as plans change.
- As a traveler, I want to delete a trip I've cancelled so my dashboard only shows relevant trips.
- As a traveler, I want to browse master packing items by category (Clothing, Electronics, Documents) so I can pick relevant items and add them to my trip list.
- As a traveler, I want to add custom items not in the master list so I can personalize my packing list for specific needs.
- As a traveler, I want to check off items as I pack them so I can track my packing progress with a completion percentage.
- As an admin, I want to add, edit, and delete master packing items so the item catalog stays accurate and up to date.

### Prajakta's Scope (Users & Community Tips)

- As a traveler, I want to create an account so I can save trips and contribute community tips.
- As a traveler, I want to log in securely so my trip data and profile are protected.
- As a traveler, I want to submit a packing tip tagged to a specific trip type and climate so other travelers with similar trips can benefit from my experience.
- As a traveler, I want to browse community tips filtered by trip type (beach, hiking, business) so I find advice relevant to my journey.
- As a traveler, I want to upvote tips I found genuinely useful so the best advice rises to the top for future travelers.
- As a traveler, I want to remove an upvote I placed accidentally so vote counts stay accurate.
- As a traveler, I want to view all tips I've submitted in one place so I can track my community contributions.
- As a traveler, I want to log out so my session is secure.

---

## Technology Stack

### Backend

- **Node.js** with ES6 Modules (`import`/`export` only — no `require`)
- **Express.js** – Web framework
- **MongoDB Native Driver** (no Mongoose)
- **JWT Authentication** with Passport.js
- **bcrypt** – Password hashing

### Frontend

- **React** – Component-based UI
- **React Router** – Client-side routing
- **CSS Modules** – Scoped component styling
- **Vite** – Build tool and dev server

### Code Quality

- **ESLint** – Linting
- **Prettier** – Formatting

---

## Instructions to Build

### Prerequisites

- Node.js v18.19.0 or higher
- MongoDB Atlas account (or local MongoDB instance)
- npm package manager

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/PatelRachit/packmate.git
cd packmate
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd frontend
npm install
```

4. **Create a `.env` file in the root directory**

```env
MONGO_URI=mongodb+srv://rachit:rachit@cluster0.345aiwy.mongodb.net/?appName=packmate
DB_NAME=packmate
PORT=5000
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

> **Important:** Never commit `.env` to version control. It is listed in `.gitignore`.

5. **Start the backend server**

```bash
npm run dev
```

6. **Start the frontend (in a separate terminal)**

```bash
cd frontend
npm run dev
```

7. **Open the application**

```
http://localhost:3000
```

---

## Available Scripts

### Backend

```bash
npm run dev           # Start backend with nodemon
npm run lint          # Run ESLint
npm run format        # Format with Prettier
```

### Frontend

```bash
npm run dev           # Start Vite dev server
npm run build         # Production build
```

---

## Project Structure

```
packmate/
├── backend/
│   ├── middleware/               # Auth & validation middleware
│   ├── src/
│   │   ├── config/               # MongoDB connection & Passport JWT strategy
│   │   ├── routes/               # Express route definitions
│   │   │   ├── auth.router.js
│   │   │   ├── items.router.js
│   │   │   ├── tips.router.js
│   │   │   ├── trips.router.js
│   │   │   └── user.router.js
│   │   └── server.js             # Express app entry point
│   ├── scripts/
│   │   ├── seedItems.js          # Master items seeder
│   │   ├── seedTips.js           # Community tips seeder
│   │   └── seedTrips.js          # Sample trips seeder
│   ├── .env                      # Environment variables (gitignored)
│   ├── .gitignore
│   ├── .prettierrc
│   ├── eslint.config.mjs
│   ├── nodemon.json
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── FilterBar/
│   │   │   ├── Navbar/
│   │   │   ├── PackingItem/
│   │   │   ├── ProgressBar/
│   │   │   ├── TipCard/
│   │   │   └── TripCard/
│   │   ├── pages/                # Page-level components
│   │   │   ├── Community/
│   │   │   ├── CreateTrip/
│   │   │   ├── Dashboard/
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Profile/
│   │   │   ├── Register/
│   │   │   └── TripDetail/
│   │   ├── utils/
│   │   │   ├── api.js            # API client
│   │   │   ├── constants.js      # Static config values
│   │   │   └── errorCode.js      # Error message mappings
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .gitignore
│   ├── .prettierrc
│   ├── eslint.config.js
│   ├── index.html
│   ├── LICENSE
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Database Collections

The application uses **4 MongoDB collections** supporting full CRUD operations:

**users** – Authentication and profile data including name, email, passwordHash, homeCity, and session management via JWT.

**trips** – Trip records including tripName, destination, country, climate, tripType, luggageType, durationDays, startDate, endDate, status, and an embedded items array (itemId reference, isChecked, isCustom, customName).

**items** – Master packing items catalog including name, category, climateTags, tripTypeTags, and isEssential flag.

**communityTips** – Community-submitted tips including title, description, email, tripTypeTags, climateTags, upvoteCount, upvotedBy array, isVerified, and isFeatured.

---

## Team Responsibilities

### Rachit Patel

- Trips collection – full CRUD (create, read, update, delete)
- Items collection – full CRUD and catalog seeding
- Trip packing list management (add/remove/check items, custom items)
- Trip status tracking (planning → ongoing → completed)
- Community trips browsing page with filters, search, and pagination
- Public trip detail page (read-only packing list + tips)
- Dashboard with status-based filtering

### Prajakta Avachat

- Users collection – full CRUD
- CommunityTips collection – full CRUD
- JWT authentication system (register, login, logout)
- Community tips submission, filtering, and upvote system
- Profile page with submitted tips and active trips
- Tips seeding with full climate and trip type coverage

---

## How to Use the App

1. **Register** for an account on the Sign Up page.
2. **Create a trip** from your dashboard by entering destination, climate, trip type, and duration.
3. **Browse the catalog** in your trip's Browse Catalog tab and add items to your packing list.
4. **Add custom items** using the text input at the top of your list.
5. **Check off items** as you pack them to track your progress.
6. **Change trip status** between Planning, Ongoing, and Completed using the status pills in the trip header.
7. **Browse community trips** on the Community page, filter by climate, trip type, status, and luggage type.
8. **Click any community trip** to view its packing list and read or upvote community tips.
9. **Add a tip** on a community trip's Tips tab once you've completed a trip of the same type or climate.
10. **Log out** from the navbar or your profile page when done.

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
