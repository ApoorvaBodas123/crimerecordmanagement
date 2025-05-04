# Civic Eye Guardian System

A web application for managing civic security and monitoring, built with React, Node.js, Express, and MongoDB.

## Features

- User authentication with role-based access control
- Different dashboards for Admin, Police Officers, and Citizens
- Secure API endpoints
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd civic-eye-guardian-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/civic-eye
JWT_SECRET=your-secret-key-here
PORT=5000
```

4. Start the development server:
```bash
npm run dev
```

5. Start the backend server (in a separate terminal):
```bash
npm run start
```

## Project Structure

```
├── server/                 # Backend server code
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── server.js         # Server entry point
├── src/                  # Frontend React code
│   ├── components/       # React components
│   ├── context/         # React context providers
│   └── App.js           # Main application component
├── public/              # Static files
└── package.json         # Project dependencies
```

## Available Scripts

- `npm run dev` - Start the frontend development server
- `npm run start` - Start the backend server
- `npm run build` - Build the frontend for production
- `npm run lint` - Run ESLint

## Authentication

The application supports three types of users:
1. Admin - Full system access
2. Police Officer - Access to police-specific features
3. Citizen - Access to citizen-specific features

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
# crimerecordmanagement
