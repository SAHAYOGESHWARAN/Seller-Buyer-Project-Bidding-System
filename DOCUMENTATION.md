# Pro Find Project Flow Documentation

## Overview
Pro Find Project Flow is a platform for project bidding and collaboration between sellers and buyers. This documentation provides an overview of the project structure, setup, and usage.

---

## Project Structure
- `src/` - Main frontend source code (React, TypeScript)
- `backend/` - Backend logic, routes, and middleware
- `prisma/` - Prisma schema and migrations
- `public/` - Static assets

---

## Setup Instructions
1. Clone the repository
2. Install dependencies with `npm install` or `yarn`
3. Configure your environment variables (see `.env.example`)
4. Start the development server with `npm run dev` or `yarn dev`

---

## Database
- PostgreSQL hosted on Supabase
- Connection string example:
  ```
  postgresql://postgres:[YOUR-PASSWORD]@db.bjykjmayolewnhirammb.supabase.co:5432/postgres
  ```
- Prisma is used for database schema and migrations

---

## Main Features
- User authentication (buyer/seller)
- Project posting and bidding
- Dashboard for managing projects and bids

---

## Author
Developed by sahayogeshwaran

---

## Live Demo
[https://seller-buyer-project-bidding-system.vercel.app](https://seller-buyer-project-bidding-system.vercel.app)
