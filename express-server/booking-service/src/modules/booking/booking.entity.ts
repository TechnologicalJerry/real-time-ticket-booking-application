export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id?: number;
  user_id: string;
  event_id: number;
  seat_id: number;
  status: BookingStatus;
  total_amount: number;
  booking_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateBookingDto {
  user_id: string;
  event_id: number;
  seat_id: number;
  total_amount: number;
}

export interface UpdateBookingDto {
  status?: BookingStatus;
  total_amount?: number;
}

