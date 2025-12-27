import { query } from '../../database/postgresql.connection';
import { Payment, CreatePaymentDto, ProcessPaymentDto } from './payment.entity';

export class PaymentRepository {
  async findAll(): Promise<Payment[]> {
    const result = await query('SELECT * FROM payments ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id: number): Promise<Payment | null> {
    const result = await query('SELECT * FROM payments WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByBookingId(bookingId: number): Promise<Payment | null> {
    const result = await query('SELECT * FROM payments WHERE booking_id = $1', [bookingId]);
    return result.rows[0] || null;
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    const result = await query('SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC', [
      userId,
    ]);
    return result.rows;
  }

  async create(paymentData: CreatePaymentDto): Promise<Payment> {
    const result = await query(
      `INSERT INTO payments (booking_id, user_id, amount, currency, payment_method, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        paymentData.booking_id,
        paymentData.user_id,
        paymentData.amount,
        paymentData.currency || 'USD',
        paymentData.payment_method,
        'pending',
      ]
    );
    return result.rows[0];
  }

  async update(id: number, updateData: Partial<Payment>): Promise<Payment | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updateData.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(updateData.status);
    }
    if (updateData.transaction_id !== undefined) {
      fields.push(`transaction_id = $${paramCount++}`);
      values.push(updateData.transaction_id);
    }
    if (updateData.payment_date !== undefined) {
      fields.push(`payment_date = $${paramCount++}`);
      values.push(updateData.payment_date);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE payments SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM payments WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

