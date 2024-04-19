
# LMS (learning management system) project

This is a repository for Build an LMS Platform: Next.js 13,  React, Stripe, Mux, Prisma, Tailwind, MySQL.

## Technologies Used
- **Next.js 13**: The foundation of the project, providing server-side rendering and routing.
- **React**: Used for building the user interface and managing the state of the application.
- **App Router**: Handling routing and navigation within the application.
- **TypeScript**: Improving code quality and productivity with static typing.
- **Clerk**: Authentication and user management for enhanced security.
- **Prisma**: Secure and efficient database operations with a type-safe query language.
- **Stripe**: Handling secure online transactions and payments.
- **TailwindCSS**:  A utility-first CSS framework for simplified and consistent styling.
- **ShadcnUI**: Reusable UI component library for visual consistency.
- **MySQL**: Storing and managing data in a relational database.
- **UploadThing**: Used for sending attachments as messages.
- **Mux**: Providing video hosting, streaming, and transcoding services.
- **Webhooks**: Integrating external services and automating notifications and actions.

  [Explore the Live Demo](https://lms-project-kohl.vercel.app/)

Key Features:

- Browse & Filter Courses
- Purchase Courses using Stripe
- Mark Chapters as Completed or Uncompleted
- Progress Calculation of each Course
- Student Dashboard
- Teacher mode
- Create new Courses
- Create new Chapters
- Easily reorder chapter position with drag n’ drop
- Upload thumbnails, attachments and videos using UploadThing
- Video processing using Mux
- HLS Video player using Mux
- Rich text editor for chapter description
- Authentication using Clerk
- ORM using Prisma
- MySQL database using Planetscale

### Prerequisites

**Node version 18.x.x**

## Installation and Usage

To get started with this project, follow these steps:
### 1. Cloning the repository

```bash
git clone https://github.com/DmitriyAngve/lms-project.git
```

### 2. Install the required dependencies using

```bash
npm i
```

### 3. Setup .env file


```js
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=

DATABASE_URL=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

STRIPE_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_TEACHER_ID=
```

### 4. Setup Prisma

Add MySQL Database

```bash
npx prisma generate
npx prisma db push

```

### 5. Start the app

```bash
npm run dev
```

### 6. Open your browser and navigate to
```bash
http://localhost:3000
```
to access the application.

## 7. Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |

