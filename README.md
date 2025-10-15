# Parcel Delivery System API

A comprehensive Node.js/Express.js REST API for managing parcel delivery operations with user authentication, booking management, and tracking functionality.

## 🚀 Features

- **User Management**: Complete user registration, authentication, and role-based access control
- **Parcel Booking**: Create, update, and manage parcel delivery bookings
- **Tracking System**: Real-time tracking with status updates and location tracking
- **Authentication**: JWT-based authentication with refresh tokens and cookie management
- **Role-Based Access**: Three-tier role system (User, Admin, SuperAdmin)
- **Data Validation**: Comprehensive input validation using Zod schemas
- **Error Handling**: Centralized error handling with detailed error responses
- **Database Integration**: MongoDB with Mongoose ODM

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **Development**: ts-node-dev

## 📁 Project Structure

```
src/
├── app/
│   ├── config/
│   │   └── passport.ts          # Passport.js configuration
│   ├── errorHelpers/
│   │   └── customError.ts       # Custom error class
│   ├── middlewares/
│   │   ├── checkAuth.ts         # Authentication middleware
│   │   ├── globalErrorHandler.ts # Global error handling
│   │   └── inputDataValidation.ts # Input validation middleware
│   ├── modules/
│   │   ├── Auth/               # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   ├── Booking/            # Booking management module
│   │   │   ├── booking.controller.ts
│   │   │   ├── booking.interface.ts
│   │   │   ├── booking.model.ts
│   │   │   ├── booking.route.ts
│   │   │   ├── booking.service.ts
│   │   │   └── booking.validation.ts
│   │   └── User/               # User management module
│   │       ├── user.controller.ts
│   │       ├── user.interface.ts
│   │       ├── user.model.ts
│   │       ├── user.route.ts
│   │       ├── user.service.ts
│   │       └── user.validation.ts
│   └── utils/                  # Utility functions
│       ├── asyncWrapper.ts     # Async error wrapper
│       ├── calculateParcelFee.ts # Fee calculation logic
│       ├── createSuperAdmin.ts  # Super admin creation
│       ├── generateToken.ts     # JWT token generation
│       ├── generateTrackingID.ts # Tracking ID generation
│       ├── jwt.ts              # JWT utilities
│       └── setCookie.ts        # Cookie management
├── types/
│   └── express.d.ts           # Express type extensions
├── app.ts                     # Express app configuration
└── server.ts                  # Server startup and MongoDB connection
```

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd assignment-5
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/parcel-delivery
   JWT_ACCESS_SECRET=your-access-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   JWT_ACCESS_EXPIRY=12h
   JWT_REFRESH_EXPIRY=7d
   SALT_ROUND=12
   SUPER_ADMIN_EMAIL=admin@example.com
   SUPER_ADMIN_PASSWORD=Admin123!
   NODE_ENV=development
   ```

4. **Start the application**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start

   # Build TypeScript
   npm run build
   ```

## 📚 API Endpoints

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint  | Description | Access |
| ------ | --------- | ----------- | ------ |
| POST   | `/login`  | User login  | Public |
| POST   | `/logout` | User logout | Public |

### User Routes (`/api/v1/user`)

| Method | Endpoint          | Description         | Access           |
| ------ | ----------------- | ------------------- | ---------------- |
| POST   | `/create-user`    | Create new user     | Public           |
| PATCH  | `/update/:userId` | Update user profile | Authenticated    |
| GET    | `/all-users`      | Get all users       | SuperAdmin only  |
| GET    | `/:userId`        | Get single user     | Authenticated    |
| DELETE | `/delete/:userId` | Delete user         | SuperAdmin, User |

### Booking Routes (`/api/v1/booking`)

| Method | Endpoint                | Description                | Access            |
| ------ | ----------------------- | -------------------------- | ----------------- |
| POST   | `/create-booking`       | Create new booking         | Authenticated     |
| POST   | `/:bookingId/tracking`  | Add tracking event         | Admin, SuperAdmin |
| PATCH  | `/update/:bookingId`    | Update booking             | Authenticated     |
| DELETE | `/delete/:bookingId`    | Delete booking             | SuperAdmin        |
| GET    | `/all-bookings`         | Get all bookings           | Admin, SuperAdmin |
| GET    | `/tracking/:trackingId` | Get booking by tracking ID | Public            |
| GET    | `/user/:userId`         | Get user bookings          | Authenticated     |
| GET    | `/stats`                | Get booking statistics     | Admin, SuperAdmin |

## 🔐 Authentication & Authorization

### User Roles

- **User**: Can create bookings, view own bookings, update own profile
- **Admin**: Can manage bookings, add tracking events, view all bookings
- **SuperAdmin**: Full system access, user management, booking deletion

### Authentication Flow

1. User logs in with email/password
2. System validates credentials and generates JWT tokens
3. Access token (12h expiry) and refresh token (7d expiry) are set as HTTP-only cookies
4. Subsequent requests include Bearer token in Authorization header
5. Middleware validates token and attaches user info to request

## 📦 Data Models

### User Model

```typescript
interface IUser {
  _id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  role: Role; // User, Admin, SuperAdmin
  isActive: ActiveStatus; // Active, Inactive, Blocked, Deleted
  email: string;
  password: string;
  phone?: string;
  address: string;
  bookings: Types.ObjectId[];
}
```

### Booking Model

```typescript
interface IBooking {
  _id?: Types.ObjectId;
  trackingId: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  parcelType: ParcelType; // Document, Package, Fragile
  weight: number;
  fee: number;
  isBlocked?: boolean;
  isCancelled?: boolean;
  trackingEvents: TrackingEvent[];
}
```

### Tracking Event

```typescript
interface TrackingEvent {
  status: ParcelStatus; // Requested, Confirmed, Dispatched, InTransit, OutForDelivery, Delivered
  location: string;
  note?: string;
}
```

## 💰 Pricing System

The system automatically calculates delivery fees based on:

- **Parcel Type**: Document (120), Package (150), Fragile (200)
- **Weight**: Base fee for first kg, additional charges for extra weight
- **Additional Rates**: Document (10%), Package (20%), Fragile (30%)

## 🔒 Security Features

- **Password Hashing**: bcryptjs with configurable salt rounds
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Input Validation**: Zod schema validation for all inputs
- **Role-Based Access**: Granular permission system
- **Error Handling**: Secure error responses without sensitive data exposure

## 🚦 Error Handling

The API implements comprehensive error handling:

- **Custom Error Class**: Structured error responses
- **Validation Errors**: Detailed field-level validation messages
- **Database Errors**: Mongoose validation and cast errors
- **Authentication Errors**: Token expiration and invalid token handling
- **Global Error Handler**: Centralized error processing

## 📊 Tracking System

- **Unique Tracking IDs**: Format: `TRK-YYYYMMDD-XXXXXX`
- **Status Progression**: Requested → Confirmed → Dispatched → In Transit → Out for Delivery → Delivered
- **Location Tracking**: Real-time location updates
- **Event History**: Complete audit trail of parcel journey

## 🛡️ Middleware

- **checkAuth**: JWT token validation and role-based authorization
- **inputDataValidation**: Zod schema validation for request bodies
- **asyncWrapper**: Error handling for async route handlers
- **globalErrorHandlers**: Centralized error response formatting

## 🔧 Development

### Scripts

- `npm run dev`: Start development server with hot reload
- `npm start`: Start production server
- `npm run build`: Compile TypeScript to JavaScript

### Database

- MongoDB connection with Mongoose ODM
- Automatic super admin creation on startup
- Transaction support for data consistency

## 📝 Environment Variables

| Variable               | Description               | Required                  |
| ---------------------- | ------------------------- | ------------------------- |
| `PORT`                 | Server port               | No (default: 3000)        |
| `MONGO_URI`            | MongoDB connection string | Yes                       |
| `JWT_ACCESS_SECRET`    | JWT access token secret   | Yes                       |
| `JWT_REFRESH_SECRET`   | JWT refresh token secret  | Yes                       |
| `JWT_ACCESS_EXPIRY`    | Access token expiry       | No (default: 12h)         |
| `JWT_REFRESH_EXPIRY`   | Refresh token expiry      | No (default: 7d)          |
| `SALT_ROUND`           | bcrypt salt rounds        | No (default: 12)          |
| `SUPER_ADMIN_EMAIL`    | Super admin email         | Yes                       |
| `SUPER_ADMIN_PASSWORD` | Super admin password      | Yes                       |
| `NODE_ENV`             | Environment mode          | No (default: development) |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This API is designed for educational purposes and demonstrates best practices in Node.js/Express.js development with TypeScript, MongoDB, and JWT authentication.
