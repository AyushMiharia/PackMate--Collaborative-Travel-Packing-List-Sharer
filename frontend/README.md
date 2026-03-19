# PackMate 🧳

**Authors:** Rachit Patel · Prajakta Avachat  
**Class:** CS5610 Web Development  
**License:** MIT

## Project Objective

PackMate is a collaborative travel packing list manager. Travelers create trips and build custom packing lists from a categorized master items catalog. The community shares and upvotes real-world packing tips per trip type — making every packing experience smarter over time.

## Screenshot

> Add a screenshot here after deployment.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18 · React Router v6 · CSS Modules |
| Backend  | Node.js · Express (no Mongoose)     |
| Database | MongoDB (Native Driver)             |
| Auth     | JWT · bcryptjs                      |

## Project Structure

```
packmate/
├── src/                        ← React frontend
│   ├── components/
│   │   ├── Navbar/             (Navbar.js + Navbar.module.css)
│   │   ├── TripCard/           (TripCard.js + TripCard.module.css)
│   │   ├── TipCard/            (TipCard.js + TipCard.module.css)
│   │   ├── PackingItem/        (PackingItem.js + PackingItem.module.css)
│   │   ├── ProgressBar/        (ProgressBar.js + ProgressBar.module.css)
│   │   └── FilterBar/          (FilterBar.js + FilterBar.module.css)
│   ├── pages/
│   │   ├── Home/               Landing page
│   │   ├── Dashboard/          Trip list
│   │   ├── CreateTrip/         3-step trip creation form
│   │   ├── TripDetail/         Packing list + catalog + tips
│   │   ├── Community/          Browse & submit tips
│   │   ├── Login/
│   │   ├── Register/
│   │   └── Profile/
│   ├── styles/global.css       Design tokens & reset
│   └── utils/
│       ├── api.js              Backend fetch helpers
│       └── mockData.js         Demo data (works without backend)
├── backend/
│   ├── server.js               Express API
│   ├── seed.js                 Seeds 1,234 records
│   └── package.json
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── LICENSE
└── README.md
```

## Instructions to Build

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### 1. Frontend

```bash
npm install
npm start          # development — http://localhost:3000
npm run build      # production build
npm run lint       # ESLint check
npm run format     # Prettier format
```

### 2. Backend

```bash
cd backend
npm install

# create .env from template
cp .env.example .env
# edit .env — add your MONGO_URI and JWT_SECRET

npm run dev        # nodemon dev server — http://localhost:5000
npm start          # production
node seed.js       # seed 1,234 demo records
```

### Environment Variables (backend/.env)

```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/packmate
PORT=5000
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:3000
```

> ⚠️  **Never commit your `.env` file.** It is already listed in `.gitignore`.

## Collections

| Collection      | Owner    | CRUD |
|-----------------|----------|------|
| `trips`         | Rachit   | ✅ Full |
| `packingItems`  | Rachit   | ✅ Full |
| `users`         | Prajakta | ✅ Full |
| `communityTips` | Prajakta | ✅ Full |

## Seed Data

Running `node seed.js` inserts **1,234 records**:
- 34 curated packing items
- 50 synthetic users
- 500 trips across 20 destinations
- 650 community tips
