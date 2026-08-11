# Food Garden

Auto-deployment enabled on VPS (`130.210.62.71`).
 🍔

A MERN-stack online food ordering and delivery marketplace built for Pakistan — inspired by Foodpanda. Food Garden connects local restaurant/food vendors with buyers through a single platform, with an admin layer to manage and moderate the whole marketplace.

Repository: https://github.com/SohailShabbir867/Food-Garden

## What This Project Does

Food Garden lets a **buyer** browse menus from multiple sellers, add items to a cart, and place an order for delivery or pickup. A **seller** (vendor) manages their own menu and fulfills incoming orders. An **admin** oversees the whole platform — users, vendors, and disputes. Buyers and sellers will be able to chat (and eventually call) directly to coordinate an order.

## Users & Stakeholders

| Stakeholder | Who they are | What they need from the platform |
|---|---|---|
| **Buyer (Customer)** | End users ordering food — students, families, office workers | Easy browsing, fast checkout, order tracking, direct chat with the seller, reliable delivery |
| **Seller (Vendor)** | Restaurant owners, home-based cooks, small food businesses | A storefront to list their menu, manage incoming orders, get paid, talk to buyers |
| **Admin** | Platform owner/operators (you) | Full visibility and control — approve vendors, manage users, resolve complaints, monitor platform health |
| **Delivery Rider** *(future scope)* | Riders fulfilling delivery orders | Order assignment, pickup/delivery status updates |
| **Developer/Maintainer** | You, and any future collaborators | Clean, documented, easy-to-extend codebase |

## Tech Stack

**Frontend** (`/frontend`)
- React 19 + Vite
- Tailwind CSS
- React Router (role-based routing: buyer, vendor, admin)
- Framer Motion, GSAP, AOS, Swiper — animations & transitions
- React Hook Form, React Toastify

**Backend** (`/backend`) — scaffolded, not yet built out
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication, bcrypt password hashing
- Socket.io — planned for real-time buyer↔seller chat
- Multer — file/image uploads

## Project Structure

```
Food-Garden/
├── frontend/     # React + Vite client (buyer, vendor, admin UIs)
├── backend/      # Express + MongoDB API (in progress)
├── .gitignore
└── README.md     # you are here
```

See `frontend/README.md` for frontend-specific structure, scripts, and setup.
See `backend/.env.example` for backend environment variables needed once the API is built.

## Core Features

- [x] Buyer-facing storefront: home, menu, cart, checkout (frontend UI built)
- [x] Role-based layouts: Admin portal, Vendor portal, Buyer site
- [ ] Backend API: auth, food/menu CRUD, orders, users
- [ ] Connect frontend to live backend data (currently using local/mock state)
- [ ] Real-time chat between buyer and seller
- [ ] Voice/video call between buyer and seller
- [ ] Delivery rider role and order-tracking
- [ ] Payments integration
- [ ] Deployment (frontend + backend)

## Getting Started

```powershell
# Frontend
cd frontend
npm install
npm run dev

# Backend (once you start building it out)
cd backend
npm install
copy .env.example .env
npm run dev
```

## Status

Currently in active frontend development. Backend is scaffolded but empty — models, routes, and controllers still need to be written.
