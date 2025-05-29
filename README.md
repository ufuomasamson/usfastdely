# Shipping Tracking Application

A full-stack shipping tracking application with an admin dashboard and public tracking interface.

## Project Structure

- `client/` - Frontend React application
- `backend/` - Backend Express.js server

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your environment variables:
```
PORT=5000
DATABASE_URL=your_database_url
```

4. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your environment variables:
```
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

## Features

- Public tracking page for shipment status
- Admin dashboard for shipment management
- Real-time shipment updates
- Responsive design

## Technologies Used

- Frontend:
  - React
  - CoreUI Components
  - Vite
  
- Backend:
  - Node.js
  - Express
  - Supabase

## Deployment

- Frontend is deployed on Netlify
- Backend is deployed on [your backend hosting platform] 