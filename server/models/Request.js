const pool = require('../config/db');

class Request {
  static async create(phone, agreed) {
    const query = `
      INSERT INTO requests (phone, agreed) 
      VALUES ($1, $2) 
      RETURNING id, phone, agreed, created_at, status
    `;
    const values = [phone, agreed];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAll() {
    const query = `
      SELECT id, phone, agreed, created_at, status 
      FROM requests 
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  }
}

module.exports = Request;