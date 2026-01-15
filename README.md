# Saine's Clothing

A full-stack e-commerce sample project (Angular frontend + Express/Node backend + MongoDB) demonstrating product browsing, cart management, checkout, and a simple admin dashboard.

---

## Table of contents
- [Project overview](#project-overview)
- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Environment variables](#environment-variables)
- [Local setup — Backend](#local-setup----backend)
- [Local setup — Frontend](#local-setup----frontend)
- [Seeding the database](#seeding-the-database)
# Saine's Clothing

Full-stack e-commerce sample (Angular frontend + Express/Node backend + MongoDB).

This document covers setup, runtime commands, main APIs, environment variables, and a short changelog of recent fixes and guard behavior.

---

**Table of contents**
- **Project Overview**
- **Quick Start**
- **Environment Variables**
- **Run Backend**
- **Run Frontend**
- **Seeding**
- **API Summary**
- **Recent Changes**
- **Troubleshooting**

---

**Project Overview**
- Full-stack app with product browsing, cart, checkout, user auth, and an admin dashboard.
- Frontend: Angular + Tailwind. Backend: Express + Mongoose. Images via Cloudinary.

---

**Quick Start**
- Clone repository and install both sides:

```bash
# backend
cd backend
npm install

# frontend
cd ../frontend
npm install
```

---

**Environment Variables (backend)**
- Create `backend/.env` with at minimum:

```
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
PORT=4000
```

Notes: Cloudinary may also be configured with separate `CLOUDINARY_*` vars; do not commit secrets.

---

**Run Backend**

```bash
cd backend
npm start
```

Default port can be set via `PORT` in `.env`.

**Run Frontend (dev)**

```bash
cd frontend
npm start
# or
ng serve
```

**Build Frontend (prod)**

```bash
cd frontend
npm run build
```

---

**Seeding**
- Seed sample products (if provided) from the backend:

```bash
cd backend
node src/seed.js
```

---

**API Summary (high level)**
- Authentication: `POST /api/user/register`, `POST /api/user/login` (returns JWT)
- Products: `GET /api/product`, `GET /api/product/:id`, `POST /api/product/add` (admin), `POST /api/product/update` (admin), `POST /api/product/remove` (admin)
- Orders: `POST /api/order/place` (users only), `POST /api/order/userorders` (user), `GET /api/order/list` (admin), `POST /api/order/status` (admin)

Protected endpoints require a valid JWT (frontend sends token; backend expects it). See controllers in `backend/src/controllers` for details.

---

**Recent Changes / Notes**
- `SHIPPING_FEE` was renamed to `DELIVERY_FEE` in source code (rebuild frontend to propagate to `dist`).
- Newsletter component: form input/button sizing fixed for mobile and desktop (input is flexible; button matches height on larger screens).
- Navbar/search: search opener focuses search input on the collection page; the close icon hides the search bar correctly.
- Admin access rules:
	- Admin users are routed only to the Home and Admin panel (`/admin`).
	- A new `no-admin` frontend guard prevents admins from accessing public/customer pages (collection, cart, place-order, orders, product pages).
	- Backend prevents admin accounts from creating orders (server returns 403 for admin order attempts).
	- The profile dropdown hides the `Orders` link for admin users.

If you want the UI to additionally hide action buttons (e.g., 'Place order' CTA) when an admin is logged in, enable `AuthService.isAdmin()` checks in the relevant components.

---

**Troubleshooting**
- MongoDB connectivity errors: verify `MONGODB_URI`, network, and Atlas access.
- Cloudinary: verify `CLOUDINARY_URL` or separate credentials.
- After UI or identifier changes (e.g., `DELIVERY_FEE` rename) rebuild frontend to update `dist`.

---

If you'd like, I can:
- Add a small `frontend/.env.example` and `backend/.env.example`.
- Generate curl examples for common API calls or a Postman collection.

---

Thanks — tell me if you want this README expanded with deployment scripts or a troubleshooting checklist for production.
node src/seed.js

