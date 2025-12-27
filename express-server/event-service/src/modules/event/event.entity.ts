export interface Event {
  id?: number;
  title: string;
  description?: string;
  venue?: string;
  date: Date;
  price: number;
  total_seats: number;
  available_seats: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateEventDto {
  title: string;
  description?: string;
  venue?: string;
  date: Date;
  price: number;
  total_seats: number;
  available_seats: number;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  venue?: string;
  date?: Date;
  price?: number;
  total_seats?: number;
  available_seats?: number;
}

