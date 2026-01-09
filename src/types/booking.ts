/**
 * Types for Booking API
 */

export interface CreateBookingDto {
  tourId: string;
  startDate: string;
  numberOfPeople: number;
  paymentMethod: 'vnpay' | 'momo' | 'stripe' | 'cash';
  specialRequests?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  voucherCode?: string;
}

export interface UpdateBookingDto {
  startDate?: string;
  numberOfPeople?: number;
  paymentMethod?: 'vnpay' | 'momo' | 'stripe' | 'cash';
  specialRequests?: string;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus?: 'unpaid' | 'deposit_paid' | 'fully_paid';
  transactionId?: string;
  voucherCode?: string;
}

export interface FilterBookingDto {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus?: 'unpaid' | 'deposit_paid' | 'fully_paid';
  userId?: string;
  tourId?: string;
  fromDate?: string;
  toDate?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface Booking {
  id: string;
  tour: any; // Tour type
  tourId: string;
  user: any; // User type
  userId: string;
  startDate: Date;
  numberOfPeople: number;
  totalPrice: number;
  depositPaid: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentMethod: 'vnpay' | 'momo' | 'stripe' | 'cash';
  paymentStatus: 'unpaid' | 'deposit_paid' | 'fully_paid';
  specialRequests?: string;
  customerInfo: string; // JSON string
  transactionId?: string;
  voucherCode?: string;
  discountAmount: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  booking: Booking;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: 'pending' | 'processing' | 'success' | 'failed' | 'refunded';
  gatewayResponse?: any;
  errorMessage?: string;
  createdAt: Date;
}

export interface BookingListResponse {
  data: Booking[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
