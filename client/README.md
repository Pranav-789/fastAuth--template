# BlogApp Client

A modern React application built with Vite, TailwindCSS, and Axios, featuring a Notion-inspired UI.

## Features

- 🔐 Authentication (Login/Register)
- ✅ Todo Management
- 🎨 Notion-inspired clean UI
- 📱 Responsive design
- 🔄 Automatic token refresh

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router** - Client-side routing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the client directory:
```bash
cp .env.example .env
```

3. Update the `.env` file with your API URL:
```
VITE_API_URL=http://localhost:8000
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in terminal).

### Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
client/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Layout.tsx   # Main layout with sidebar
│   │   ├── Sidebar.tsx  # Navigation sidebar
│   │   └── ProtectedRoute.tsx  # Route protection
│   ├── pages/           # Page components
│   │   ├── Login.tsx    # Login page
│   │   ├── Register.tsx # Registration page
│   │   ├── Dashboard.tsx # Dashboard page
│   │   └── Todos.tsx    # Todo management page
│   ├── lib/             # Utilities and API client
│   │   └── api.ts       # Axios API client configuration
│   ├── App.tsx          # Main app component with routing
│   └── main.tsx         # Entry point
├── public/              # Static assets
└── index.html           # HTML template
```

## API Integration

The app communicates with the backend server through the API client configured in `src/lib/api.ts`. The client includes:

- Automatic token injection in requests
- Token refresh on 401 errors
- Cookie support for authentication
- Centralized error handling

## UI Design

The UI is inspired by Notion, featuring:
- Clean, minimal design
- Collapsible sidebar navigation
- Smooth transitions and hover effects
- Consistent spacing and typography
- Light color scheme with subtle borders

## Notes

- Make sure your backend server is running on the configured port (default: 8000)
- The app uses httpOnly cookies for authentication tokens
- Protected routes automatically redirect to login if not authenticated
