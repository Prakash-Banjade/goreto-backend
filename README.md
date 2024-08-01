# Goreto - A Meat Shop - E-commerce Backend System Documentation

## Overview

Welcome to the documentation for the backend system of Goreto, an e-commerce platform for a meat shop. This backend is developed using NestJS, TypeORM, and MySQL, designed to provide robust and scalable support for the application's features.

## Features

### 1. Authentication and Authorization

- **User Roles**: Supports multiple roles, including customers, moderators, and admins.
- **JWT**: Implements JSON Web Tokens for secure authentication, including access and refresh tokens.
- **Refresh Token Rotation**: Ensures security by rotating refresh tokens and detecting token reuse.
- **Multiple Device Login**: Supports login from multiple devices.
- **Password Management**: Includes functionalities for password recovery and changes with OTP and email verification.

### 2. Products and Variants

- **Product Management**: Comprehensive CRUD operations for products.
- **Variants**: Supports product variants, including different weights, packaging, etc.
- **Attributes and Options**: Customizable product attributes and options.

### 3. Categories

- **Nested Set Model**: Efficiently manages hierarchical category structures.
- **Tree Architecture**: Supports recursive relations for category trees.

### 4. SKU and Inventory Management

- **SKU Management**: Assigns unique identifiers to products for inventory tracking.
- **Inventory Control**: Monitors stock levels and updates inventory dynamically.

### 5. Cart and Order Management

- **Cart System**: Manages customer carts, including items, quantities, and calculations.
- **Order Processing**: Handles order creation, updates, and tracking.
- **Payment Integration**: Supports cash on delivery and Stripe payment gateways.

### 6. Google OAuth

- **Social Login**: Facilitates user login via Google accounts for convenience and security.

### 7. Caching and Performance

- **Redis Caching**: Enhances performance through efficient data caching mechanisms.

### 8. Data Validation and Security

- **Class-Validator**: Ensures data integrity and sanitization.
- **Security**: Employs NestJS Guards, interceptors, and TypeORM transactions to secure APIs.

### 9. API Features

- **Pagination**: Implements efficient pagination for handling large datasets.
- **Advanced Query Filters**: Provides flexible filtering options for data retrieval.
- **Secure APIs**: Ensures secure data transmission and access control.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeORM**: An ORM for TypeScript and JavaScript (ES7, ES6, ES5) that can be used with TypeScript or JavaScript (ES7, ES6, ES5).
- **MySQL**: A relational database management system.
- **Redis**: An in-memory data structure store, used as a database, cache, and message broker.

## Environment setup

```bash
PORT=

DATABASE_URL=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRATION=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRATION=
REFRESH_HEADER_KEY=

MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=

REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

BACKEND_URL=
CLIENT_URL=

STRIPE_API_KEY=
STRIPE_PUBLISHABLE_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
```

## Conclusion

The backend system of Goreto is designed to provide a secure, efficient, and scalable solution for managing an e-commerce platform. It integrates various advanced features and technologies to ensure a smooth and secure user experience.