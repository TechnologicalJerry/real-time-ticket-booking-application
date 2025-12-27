export type SeatStatus = 'available' | 'reserved' | 'booked' | 'blocked';

export interface Seat {
  id?: number;
  event_id: number;
  seat_number: string;
  row_number?: string;
  section?: string;
  status: SeatStatus;
  price?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateSeatDto {
  event_id: number;
  seat_number: string;
  row_number?: string;
  section?: string;
  status?: SeatStatus;
  price?: number;
}

export interface UpdateSeatDto {
  event_id?: number;
  seat_number?: string;
  row_number?: string;
  section?: string;
  status?: SeatStatus;
  price?: number;
}

export interface ReserveSeatDto {
  seat_id: number;
  user_id: string;
  expires_in?: number;
}

