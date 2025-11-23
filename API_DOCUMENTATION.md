# API Documentation for Frontend Integration

## Overview

- **Base URL**: `http://localhost:3001` (or `http://localhost:3002` depending on `.env` configuration)
- **Authentication**: JWT Bearer Token. Add `Authorization: Bearer <token>` header to protected requests.
- **Swagger UI**: `http://localhost:3001/api` (Interactive documentation)

## Authentication (`/auth`)

### Register
- **Endpoint**: `POST /auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123", // Min 6 characters
    "name": "Full Name"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni..."
  }
  ```

### Login
- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni..."
  }
  ```

## Users (`/users`)

### Get All Users
- **Endpoint**: `GET /users`
- **Response**: Array of `User` objects.

### Get User by ID
- **Endpoint**: `GET /users/:id`
- **Response**: `User` object.

### Create User (Admin)
- **Endpoint**: `POST /users`
- **Body**: Same as Register DTO.

### Update User
- **Endpoint**: `PATCH /users/:id`
- **Body**: Partial `User` object.

### Delete User
- **Endpoint**: `DELETE /users/:id`

## Tours (`/tours`)

### Get All Tours
- **Endpoint**: `GET /tours`
- **Response**: Array of `Tour` objects.

### Get Tour by ID
- **Endpoint**: `GET /tours/:id`
- **Response**: `Tour` object.

### Create Tour
- **Endpoint**: `POST /tours`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `title`: string
  - `slug`: string
  - `description`: string
  - `content`: string (HTML)
  - `price_usd`: number
  - `duration`: string
  - `depart_from`: string
  - `routes`: string
  - `type`: string
  - `is_featured`: boolean
  - `thumbnail`: File (Binary)
  - `images`: Array of strings (URLs) - *Note: Multi-file upload for images not yet implemented in this endpoint, currently accepts array of URLs*

## Blog (`/blog`)

### Get All Posts
- **Endpoint**: `GET /blog`
- **Response**: Array of `BlogPost` objects.

### Get Post by ID
- **Endpoint**: `GET /blog/:id`
- **Response**: `BlogPost` object.

## Services (`/services`)

### Get All Services
- **Endpoint**: `GET /services`
- **Response**: Array of `Service` objects.

### Get Service by ID
- **Endpoint**: `GET /services/:id`
- **Response**: `Service` object.

---

## Data Models (TypeScript Interfaces)

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  provider: string | null;
  created_at: string;
}
```

### Tour
```typescript
interface Tour {
  id: string;
  title: string;
  slug: string;
  thumbnail: string; // URL
  images: string[]; // Array of URLs
  description: string;
  content: string; // HTML content
  price_usd: number;
  duration: string;
  depart_from: string;
  routes: string;
  type: string;
  is_featured: boolean;
  created_at: string;
}
```

### BlogPost
```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML content
  thumbnail: string; // URL
  category: string;
  author_name: string;
  tags: string[];
  created_at: string;
}
```

### Service
```typescript
interface Service {
  id: string;
  title: string;
  short_title: string;
  description: string;
  thumbnail: string; // URL
  icon: string; // Icon name or URL
  price_range: string;
  features: string[];
  created_at: string;
}
```
