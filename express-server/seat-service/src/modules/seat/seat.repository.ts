import { query } from '../../database/postgresql.connection';
import { Seat, CreateSeatDto, UpdateSeatDto } from './seat.entity';

export class SeatRepository {
  async findAll(): Promise<Seat[]> {
    const result = await query('SELECT * FROM seats ORDER BY event_id, seat_number');
    return result.rows;
  }

  async findById(id: number): Promise<Seat | null> {
    const result = await query('SELECT * FROM seats WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByEventId(eventId: number): Promise<Seat[]> {
    const result = await query('SELECT * FROM seats WHERE event_id = $1 ORDER BY seat_number', [
      eventId,
    ]);
    return result.rows;
  }

  async findAvailableByEventId(eventId: number): Promise<Seat[]> {
    const result = await query(
      'SELECT * FROM seats WHERE event_id = $1 AND status = $2 ORDER BY seat_number',
      [eventId, 'available']
    );
    return result.rows;
  }

  async create(seatData: CreateSeatDto): Promise<Seat> {
    const result = await query(
      `INSERT INTO seats (event_id, seat_number, row_number, section, status, price)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        seatData.event_id,
        seatData.seat_number,
        seatData.row_number,
        seatData.section,
        seatData.status || 'available',
        seatData.price,
      ]
    );
    return result.rows[0];
  }

  async update(id: number, seatData: UpdateSeatDto): Promise<Seat | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (seatData.event_id !== undefined) {
      fields.push(`event_id = $${paramCount++}`);
      values.push(seatData.event_id);
    }
    if (seatData.seat_number !== undefined) {
      fields.push(`seat_number = $${paramCount++}`);
      values.push(seatData.seat_number);
    }
    if (seatData.row_number !== undefined) {
      fields.push(`row_number = $${paramCount++}`);
      values.push(seatData.row_number);
    }
    if (seatData.section !== undefined) {
      fields.push(`section = $${paramCount++}`);
      values.push(seatData.section);
    }
    if (seatData.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(seatData.status);
    }
    if (seatData.price !== undefined) {
      fields.push(`price = $${paramCount++}`);
      values.push(seatData.price);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE seats SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM seats WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  async updateStatus(id: number, status: string): Promise<Seat | null> {
    const result = await query(
      'UPDATE seats SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0] || null;
  }
}

