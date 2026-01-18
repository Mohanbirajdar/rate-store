# 🏪 RateStore

A modern, full-stack **Store Rating Platform** built with Next.js 16, TypeScript, Prisma, and PostgreSQL. This application allows users to discover stores, submit ratings, and provides role-based dashboards for different user types.

![Next.js](https://img.shields.io/badge/Next.js-16.1.3-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.19-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=flat-square&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure HTTP-only cookies
- **Role-based access control** (RBAC) with three user types:
  - **System Admin** - Full platform management
  - **Store Owner** - Store and ratings management
  - **Normal User** - Browse stores and submit ratings
- Protected routes with middleware-based route guarding
- Password hashing with bcrypt

### 👥 User Roles & Dashboards

#### 🛡️ System Administrator
- View platform-wide analytics (total users, stores, ratings)
- Manage all users (create, view, delete)
- Manage all stores
- Add new users with role assignment
- Add new stores with owner assignment

#### 🏬 Store Owner
- Personal store dashboard
- View all ratings received
- Search and filter ratings by user name, email, or address
- Sort ratings (latest, oldest, ascending, descending)
- View average store rating

#### 👤 Normal User
- Browse all available stores
- View store details and ratings
- Submit ratings (1-5 stars) for stores
- Update existing ratings
- View personal profile

### 🎨 UI/UX Features
- **Dark/Light theme** toggle with system preference detection
- **Responsive design** - Mobile-first approach
- **Animated components** using Framer Motion
- **Modern UI components** built with Radix UI primitives
- **Beautiful gradients** and glassmorphism effects

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | Radix UI, shadcn/ui |
| **Animations** | Framer Motion |
| **Authentication** | JWT (jose library) |
| **Password Hashing** | bcryptjs |
| **Icons** | Lucide React |

## 📁 Project Structure

```
ratestore/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── admin/               # Admin dashboard pages
│   │   ├── dashboard/
│   │   ├── analytics/
│   │   ├── stores/
│   │   └── users/
│   ├── api/                 # API routes
│   │   ├── admin/           # Admin APIs
│   │   ├── auth/            # Auth APIs (login, signup, logout, me)
│   │   ├── profile/
│   │   ├── ratings/
│   │   ├── store/
│   │   └── stores/
│   ├── store/               # Store owner pages
│   │   ├── dashboard/
│   │   └── ratings/
│   ├── user/                # Normal user pages
│   │   └── stores/
│   ├── change-password/
│   ├── profile/
│   └── unauthorized/
├── components/
│   ├── providers/           # Context providers
│   │   ├── AuthProvider.tsx
│   │   └── ThemeProvider.tsx
│   └── ui/                  # Reusable UI components
├── lib/                     # Utility functions
│   ├── auth.ts              # Auth utilities
│   ├── prisma.ts            # Prisma client
│   └── utils.ts             # Helper functions
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Database seeding
│   └── migrations/          # Database migrations
└── middleware.ts            # Route protection middleware
```

## 🗃️ Database Schema

### Models

```prisma
User
├── id (String, CUID)
├── name (String, max 60 chars)
├── email (String, unique)
├── password (String, hashed)
├── address (String, max 400 chars)
├── role (Enum: SYSTEM_ADMIN, NORMAL_USER, STORE_OWNER)
├── store? (One-to-one relation for store owners)
└── ratings[] (Ratings submitted by user)

Store
├── id (String, CUID)
├── name (String, max 60 chars)
├── email (String, unique)
├── address (String, max 400 chars)
├── ownerId (String, unique)
├── owner (User relation)
└── ratings[] (Ratings received)

Rating
├── id (String, CUID)
├── value (Integer, 1-5)
├── userId (String)
├── storeId (String)
└── Unique constraint on [userId, storeId]
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mohanbirajdar/rate-store.git
   cd rate-store
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

6. **Seed the database** (optional - creates demo data)
   ```bash
   pnpm seed
   ```

7. **Start the development server**
   ```bash
   pnpm dev
   ```

8. **Open the application**
   
   Visit [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Credentials

After running the seed command, you can use these credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@storerating.com | Admin@123 |
| **Store Owner 1** | owner1@grocery.com | Store@123 |
| **Store Owner 2** | owner2@electronics.com | Store@456 |

*Note: Normal users can be created via the signup page or by admin.*

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/change-password` | Change password |

### Stores
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stores` | Get all stores |
| GET | `/api/stores/[id]` | Get store by ID |
| GET | `/api/store/info` | Get current user's store (store owner) |

### Ratings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ratings` | Submit/update rating |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Get platform statistics |
| GET/POST/DELETE | `/api/admin/users` | Manage users |
| GET/POST/DELETE | `/api/admin/stores` | Manage stores |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/PUT | `/api/profile` | Get/update user profile |

## 🎨 UI Components

This project uses a custom UI component library built on top of Radix UI primitives:

- Alert, Avatar, Badge, Button
- Card, Dialog, Dropdown Menu
- Input, Label, Select, Separator
- Table, Textarea, Tooltip
- Floating Dock navigation

## 🔧 Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm seed         # Seed the database
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed on any platform that supports Next.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

**Mohan Birajdar** - [@Mohanbirajdar](https://github.com/Mohanbirajdar)

Project Link: [https://github.com/Mohanbirajdar/rate-store](https://github.com/Mohanbirajdar/rate-store)

---

<p align="center">Made with ❤️ using Next.js</p>
