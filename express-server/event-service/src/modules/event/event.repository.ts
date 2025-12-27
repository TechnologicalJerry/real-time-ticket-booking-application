import { query } from '../../database/mysql.connection';
import { Event, CreateEventDto, UpdateEventDto } from './event.entity';

export class EventRepository {
  async findAll(): Promise<Event[]> {
    const results = await query('SELECT * FROM events ORDER BY date ASC');
    return results as Event[];
  }

  async findById(id: number): Promise<Event | null> {
    const results = await query('SELECT * FROM events WHERE id = ?', [id]);
    return (results as Event[])[0] || null;
  }

  async create(eventData: CreateEventDto): Promise<Event> {
    const result = await query(
      `INSERT INTO events (title, description, venue, date, price, total_seats, available_seats)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        eventData.title,
        eventData.description,
        eventData.venue,
        eventData.date,
        eventData.price,
        eventData.total_seats,
        eventData.available_seats,
      ]
    );
    const insertedId = (result as any).insertId;
    return this.findById(insertedId) as Promise<Event>;
  }

  async update(id: number, eventData: UpdateEventDto): Promise<Event | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (eventData.title !== undefined) {
      fields.push('title = ?');
      values.push(eventData.title);
    }
    if (eventData.description !== undefined) {
      fields.push('description = ?');
      values.push(eventData.description);
    }
    if (eventData.venue !== undefined) {
      fields.push('venue = ?');
      values.push(eventData.venue);
    }
    if (eventData.date !== undefined) {
      fields.push('date = ?');
      values.push(eventData.date);
    }
    if (eventData.price !== undefined) {
      fields.push('price = ?');
      values.push(eventData.price);
    }
    if (eventData.total_seats !== undefined) {
      fields.push('total_seats = ?');
      values.push(eventData.total_seats);
    }
    if (eventData.available_seats !== undefined) {
      fields.push('available_seats = ?');
      values.push(eventData.available_seats);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    await query(`UPDATE events SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM events WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }

  async updateAvailableSeats(id: number, quantity: number): Promise<boolean> {
    const result = await query(
      'UPDATE events SET available_seats = available_seats + ? WHERE id = ?',
      [quantity, id]
    );
    return (result as any).affectedRows > 0;
  }
}

