const db = require('../config/db');

class Device {
  static async getByType(typeId) {
    const { rows } = await db.query(`
      SELECT d.*, b.name as brand_name 
      FROM devices d
      JOIN brands b ON d.brand_id = b.id
      WHERE d.type_id = $1
    `, [typeId]);
    return rows;
  }

  static async getInfo(deviceId) {
    const { rows } = await db.query('SELECT * FROM device_info WHERE device_id = $1', [deviceId]);
    return rows;
  }
}

module.exports = Device;