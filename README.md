# Notes App Frontend

A modern, responsive note-taking application frontend built with React, TypeScript, and Vite. This frontend connects to the Notes App Backend API to provide a complete note-taking experience.

## Features

- **Modern UI/UX**: Clean, responsive design that works on desktop and mobile
- **Authentication**: 
  - Email/Password registration with OTP verification
  - Google OAuth 2.0 integration
  - JWT-based authentication
- **Notes Management**: Create, search, and delete notes
- **Real-time Validation**: Form validation with error handling
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Toast Notifications**: User-friendly success/error messages

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notes-app-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   Edit `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

## Development

1. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Preview production build**
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── GoogleSignIn.tsx
│   ├── LoadingSpinner.tsx
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── pages/             # Page components
│   ├── Dashboard.tsx
│   ├── SignIn.tsx
│   └── SignUp.tsx
├── utils/             # Utility functions
│   ├── api.ts
│   └── validation.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Features Overview

### Authentication
- **Sign Up**: User registration with email verification via OTP
- **Sign In**: Login with email/password or Google OAuth
- **Google OAuth**: One-click sign in with Google account
- **Protected Routes**: JWT-based route protection

### Dashboard
- **Welcome Section**: Displays user information
- **Create Notes**: Modal form for creating new notes
- **Notes List**: Display all user notes with delete functionality
- **Search**: Real-time search through notes
- **Responsive Design**: Works seamlessly on mobile and desktop

### Form Validation
- **Zod Schema**: Type-safe validation schemas
- **Real-time Validation**: Instant feedback on form inputs
- **Error Handling**: Comprehensive error messages

## API Integration

The frontend integrates with the backend API through:

- **Authentication Endpoints**: `/auth/register`, `/auth/login`, `/auth/google`
- **Notes Endpoints**: `/notes` (CRUD operations)
- **Search Endpoint**: `/notes/search`
- **JWT Token Management**: Automatic token attachment to requests

## Responsive Design

The application is fully responsive with:
- **Mobile-first approach**: Optimized for mobile devices
- **Desktop enhancement**: Enhanced UI for larger screens
- **Flexible layouts**: Adapts to different screen sizes
- **Touch-friendly**: Optimized for touch interactions

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | `your-google-client-id` |

## Error Handling

- **Network Errors**: Handled with toast notifications
- **Validation Errors**: Real-time form validation
- **Authentication Errors**: Automatic redirect to login
- **API Errors**: User-friendly error messages