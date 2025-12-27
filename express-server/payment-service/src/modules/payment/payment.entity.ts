export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id?: number;
  booking_id: number;
  user_id: string;
  amount: number;
  currency: string;
  payment_method?: string;
  status: PaymentStatus;
  transaction_id?: string;
  payment_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreatePaymentDto {
  booking_id: number;
  user_id: string;
  amount: number;
  currency?: string;
  payment_method?: string;
}

export interface ProcessPaymentDto {
  payment_id: number;
  transaction_id: string;
}

export interface RefundPaymentDto {
  payment_id: number;
  reason?: string;
}

