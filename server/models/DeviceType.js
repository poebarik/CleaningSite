const db = require('../config/db');

class DeviceType {
  static async getAll() {
    const { rows } = await db.query('SELECT * FROM device_types');
    return rows;
  }

  static async getById(id) {
    const { rows } = await db.query('SELECT * FROM device_types WHERE id = $1', [id]);
    return rows[0];
  }
}

module.exports = DeviceType;