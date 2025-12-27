# Real-Time Ticket Booking Application - Microservices Backend

A microservices-based ticket booking application built with Node.js, Express.js, and TypeScript.

## Architecture

This application follows a microservices architecture with the following services:

- **API Gateway** (Port 3000) - Routes requests to appropriate microservices
- **Auth Service** (Port 3001) - Handles authentication and authorization (MongoDB)
- **User Service** (Port 3002) - Manages user profiles (PostgreSQL)
- **Event Service** (Port 3003) - Manages events and venues (MySQL)
- **Seat Service** (Port 3004) - Manages seat availability with Redis caching (PostgreSQL + Redis)
- **Booking Service** (Port 3005) - Handles ticket bookings (PostgreSQL)
- **Payment Service** (Port 3006) - Processes payments (PostgreSQL)

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Getting Started

### 1. Start Database Services

```bash
docker-compose up -d
```

This will start:
- MongoDB (Port 27017)
- PostgreSQL instances (Ports 5432, 5433, 5434, 5435)
- MySQL (Port 3306)
- Redis (Port 6379)

### 2. Install Dependencies

Install dependencies for each service:

```bash
cd api-gateway && npm install
cd ../auth-service && npm install
cd ../user-service && npm install
cd ../event-service && npm install
cd ../seat-service && npm install
cd ../booking-service && npm install
cd ../payment-service && npm install
```

### 3. Environment Variables

Create `.env` files in each service directory with appropriate configuration. See `.env.example` for reference.

### 4. Run Services

#### Development Mode

Run each service in development mode:

```bash
# Terminal 1 - API Gateway
cd api-gateway && npm run dev

# Terminal 2 - Auth Service
cd auth-service && npm run dev

# Terminal 3 - User Service
cd user-service && npm run dev

# Terminal 4 - Event Service
cd event-service && npm run dev

# Terminal 5 - Seat Service
cd seat-service && npm run dev

# Terminal 6 - Booking Service
cd booking-service && npm run dev

# Terminal 7 - Payment Service
cd payment-service && npm run dev
```

#### Production Mode

Build and run each service:

```bash
# Build
cd api-gateway && npm run build
cd ../auth-service && npm run build
# ... repeat for all services

# Start
cd api-gateway && npm start
cd ../auth-service && npm start
# ... repeat for all services
```

## API Endpoints

### API Gateway (Port 3000)

All requests should go through the API Gateway:

- `GET /health` - Health check
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/users` - Get all users (requires auth)
- `GET /api/events` - Get all events
- `GET /api/seats/event/:eventId` - Get seats for event
- `POST /api/bookings` - Create booking (requires auth)
- `POST /api/payments` - Create payment (requires auth)

## Project Structure

```
express-server/
├── api-gateway/
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── proxy/
│   │   └── routes/
│   ├── package.json
│   └── tsconfig.json
├── auth-service/
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config/
│   │   ├── database/
│   │   └── modules/
│   ├── package.json
│   └── tsconfig.json
├── shared/
│   ├── constants/
│   ├── middlewares/
│   ├── types/
│   └── utils/
├── docker-compose.yml
└── README.md
```

## Technologies

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Databases**: MongoDB, PostgreSQL, MySQL, Redis
- **Authentication**: JWT
- **Security**: Helmet, CORS
- **Logging**: Morgan, Custom Logger

## Development

Each service follows clean architecture principles with:
- Controllers - Handle HTTP requests/responses
- Services - Business logic
- Repositories - Data access layer
- Entities/Models - Data structures

## License

MIT

