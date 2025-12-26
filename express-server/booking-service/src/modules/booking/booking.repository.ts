import { query } from '../../database/postgresql.connection';
import { Booking, CreateBookingDto, UpdateBookingDto } from './booking.entity';

export class BookingRepository {
  async findAll(): Promise<Booking[]> {
    const result = await query('SELECT * FROM bookings ORDER BY booking_date DESC');
    return result.rows;
  }

  async findById(id: number): Promise<Booking | null> {
    const result = await query('SELECT * FROM bookings WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const result = await query('SELECT * FROM bookings WHERE user_id = $1 ORDER BY booking_date DESC', [
      userId,
    ]);
    return result.rows;
  }

  async findByEventId(eventId: number): Promise<Booking[]> {
    const result = await query('SELECT * FROM bookings WHERE event_id = $1 ORDER BY booking_date DESC', [
      eventId,
    ]);
    return result.rows;
  }

  async create(bookingData: CreateBookingDto): Promise<Booking> {
    const result = await query(
      `INSERT INTO bookings (user_id, event_id, seat_id, total_amount, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [bookingData.user_id, bookingData.event_id, bookingData.seat_id, bookingData.total_amount, 'pending']
    );
    return result.rows[0];
  }

  async update(id: number, bookingData: UpdateBookingDto): Promise<Booking | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (bookingData.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(bookingData.status);
    }
    if (bookingData.total_amount !== undefined) {
      fields.push(`total_amount = $${paramCount++}`);
      values.push(bookingData.total_amount);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE bookings SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM bookings WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

