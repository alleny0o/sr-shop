# 💼 Sam & Rachel's Laserworks – Custom eCommerce Platform

A custom full-stack eCommerce platform built for **Sam & Rachel’s Laserworks**, a small business known for handcrafted laser-engraved boards and puzzles.

This project was created to help Sam & Rachel migrate away from **Etsy** — giving them full control over their brand, user experience, and operations without the limitations or fees of marketplace platforms. Built from the ground up to fit their needs, this site empowers their creativity and scales with their growth.

---

## 🔑 Features

| Feature | Description |
|--------|-------------|
| Product Variants | Dynamic variants with flexible option display logic |
| Custom Forms | Product-level customization forms (e.g., engraved messages, image uploads) |
| Variant Media | Upload unique images/videos per product variant or variant option |
| Product Reviews | Customer feedback system with moderation support |
| Shipping Info | Custom shipping details per product |
| Admin Tools | Admin dashboard to manage products, orders, media, and variants |
| Email Workflows | Transactional and marketing emails using Resend & React Email |
| Modular Backend | Powered by Medusa v2 modules, subscribers, workflows, and jobs |
| Caching | Redis-backed performance layer |

---

## 🛠 Backend Stack

| Technology | Purpose | Icon |
|------------|---------|------|
| **TypeScript** | Strong typing, maintainability | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) |
| **MedusaJS v2** | Headless commerce engine (extended) | ![Medusa](https://img.shields.io/badge/MedusaJS-000000?logo=medusa&logoColor=white) |
| **React Hook Form** | Form state management | ![RHF](https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white) |
| **Zod** | Schema validation | ![Zod](https://img.shields.io/badge/Zod-3C3C3C?logo=zod&logoColor=white) |
| **Multer** | File uploads | ![Multer](https://img.shields.io/badge/Multer-3F3F3F?logo=express&logoColor=white) |
| **Redis** | In-memory data store | ![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white) |
| **Dropzone** | Drag-and-drop file upload | ![Dropzone](https://img.shields.io/badge/Dropzone-646CFF?logo=dropbox&logoColor=white) |
| **React Color** | Color selection tool | ![React Color](https://img.shields.io/badge/React_Color-61DAFB?logo=react&logoColor=white) |
| **React Email** | Email templating in React | ![React Email](https://img.shields.io/badge/React_Email-000000?logo=react&logoColor=white) |
| **Resend** | Email delivery API | ![Resend](https://img.shields.io/badge/Resend-000000?logo=resend&logoColor=white) |

> **Deployment:** Backend is deployed on [Railway](https://railway.app)

---

## 🧑‍🎨 Frontend Stack (Planned)

| Technology | Purpose | Icon |
|------------|---------|------|
| **Next.js** | React framework with SSR | ![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white) |
| **TypeScript** | Typed React development | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) |
| **Tailwind CSS** | Utility-first styling | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) |

> **Deployment Target:** [Vercel](https://vercel.com)

---

## 📁 Architecture Overview

| Layer | Stack | Notes |
|-------|-------|-------|
| **Backend** | MedusaJS v2, Redis, Multer, Resend | Extended with **modules**, **subscribers**, **jobs**, and **workflows** |
| **Frontend** | Next.js (in progress) | Will deliver a polished shopping and customization experience |
| **Infrastructure** | Railway (backend), Vercel (frontend) | Easy deploy, auto CI/CD |

---

## ✅ Custom Engineering Work

- Extended Medusa's backend to support:
  - Product customization forms
  - Media management per variant & option
  - Product reviews
  - Custom workflows and job handlers
- Redis-powered session and cache layer
- Custom image handling pipeline via Multer
- Email flow via React Email and Resend
- API routes, modules, and logic using Medusa v2 standards

---

## 📦 Status

| Area | Status |
|------|--------|
| Backend | ✅ Complete |
| Frontend | 🚧 In Progress |
| Deployment | ✅ Backend on Railway, Frontend on Vercel |

---

Let me know if you'd like badges (e.g., Vercel Deploy, Railway Deploy, MIT License), images, usage instructions, or contribution guidelines added next.