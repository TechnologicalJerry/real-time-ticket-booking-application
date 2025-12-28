import { query } from '../../database/postgresql.connection';
import { User, CreateUserDto, UpdateUserDto } from './user.entity';

export class UserRepository {
  async findAll(): Promise<User[]> {
    const result = await query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id: number): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  async create(userData: CreateUserDto): Promise<User> {
    const result = await query(
      `INSERT INTO users (email, first_name, last_name, phone, address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userData.email, userData.first_name, userData.last_name, userData.phone, userData.address]
    );
    return result.rows[0];
  }

  async update(id: number, userData: UpdateUserDto): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (userData.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(userData.email);
    }
    if (userData.first_name !== undefined) {
      fields.push(`first_name = $${paramCount++}`);
      values.push(userData.first_name);
    }
    if (userData.last_name !== undefined) {
      fields.push(`last_name = $${paramCount++}`);
      values.push(userData.last_name);
    }
    if (userData.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(userData.phone);
    }
    if (userData.address !== undefined) {
      fields.push(`address = $${paramCount++}`);
      values.push(userData.address);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM users WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

