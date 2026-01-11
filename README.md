# Saine's Clothing
This is the **Saine's Clothing** e-commerce platform built using the **MEAN stack** (MongoDB, Express, Angular, Node.js). 

## Project Overview and Purpose
Saine's Clothing is an e-commerce platform designed to provide a seamless shopping experience for users while offering robust management tools for administrators. The project aims to demonstrate the power of the MEAN stack in building scalable and maintainable web applications.

## Features List
- User authentication and authorization.
- Product browsing, filtering, and searching.
- Shopping cart and order placement.
- Admin dashboard for managing products and orders.
- Cloudinary integration for image uploads.
- Responsive design for mobile and desktop.

## Architecture or System Design
The application follows a modular architecture:
- **Frontend**: Angular framework for a dynamic and responsive user interface.
- **Backend**: Node.js with Express for RESTful APIs.
- **Database**: MongoDB for data persistence.
- **Cloud Services**: Cloudinary for image storage.

## API Endpoints Summary
- **Authentication**:
  - POST `/api/auth/register`: Register a new user.
  - POST `/api/auth/login`: Login a user.
- **Products**:
  - GET `/api/products`: Fetch all products.
  - POST `/api/products`: Add a new product (Admin only).
- **Orders**:
  - GET `/api/orders`: Fetch user orders.
  - POST `/api/orders`: Place a new order.

## Screenshots of Major Pages
- **Home Page**: Displays featured products and categories.
- **Product Page**: Detailed view of a product.
- **Cart Page**: Overview of selected items.
- **Admin Dashboard**: Tools for managing products and orders.

## Challenges and Solutions
- **Challenge**: Managing state between frontend and backend.
  - **Solution**: Implemented services in Angular to handle state management.
- **Challenge**: Securely storing sensitive data like API keys.
  - **Solution**: Used environment variables and `.env` files.

## Deployment
- **Frontend**: Deployed on Vercel.
- **Backend**: Deployed on Render.

## How to Run
- **Backend**: `npm run start` in the `backend/` directory.
- **Frontend**: `npm run start` in the `frontend/` directory.
