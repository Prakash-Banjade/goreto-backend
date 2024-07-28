export enum Roles {
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    USER = 'user',
}

export interface AuthUser {
    userId: string;
    accountId: string;
    name: string;
    email: string;
    role: Roles;
}

export enum Action {
    MANAGE = 'manage',
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    RESTORE = 'restore',
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum PaymentMethod {
    CASH_ON_DELIVERY = 'cashOnDelivery',
    CASH = 'cash',
    CREDIT = 'credit',
    PAYPAL = 'paypal',
    STRIPE = 'stripe',
}

export enum PaymentStatus {
    PENDING = 'pending',
    AWATING_PAYMENT = 'awaitingPayment',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export enum ProductType {
    SIMPLE = 'simple',
    VARIABLE = 'variable',
}

export enum ReportPeriod {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year'
}

export enum AuthProvider {
    GOOGLE = 'google',
    CREDENTIALS = 'credentials',
}