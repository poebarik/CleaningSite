const db = require('../config/db');

class Basket {
  static async getByUser(userId) {
    const { rows } = await db.query('SELECT * FROM baskets WHERE user_id = $1', [userId]);
    return rows[0] || null;
  }

  static async create(userId) {
    const { rows } = await db.query(
      'INSERT INTO baskets (user_id) VALUES ($1) RETURNING *',
      [userId]
    );
    return rows[0];
  }

  static async addDevice(basketId, deviceId, quantity) {
    // Check if device already in basket
    const existing = await db.query(
      'SELECT * FROM baskets_devices WHERE basket_id = $1 AND device_id = $2',
      [basketId, deviceId]
    );

    if (existing.rows.length > 0) {
      // Update quantity if already exists
      await db.query(
        'UPDATE baskets_devices SET quantity = quantity + $1 WHERE basket_id = $2 AND device_id = $3',
        [quantity, basketId, deviceId]
      );
    } else {
      // Add new item
      await db.query(
        'INSERT INTO baskets_devices (basket_id, device_id, quantity) VALUES ($1, $2, $3)',
        [basketId, deviceId, quantity]
      );
    }
  }
  
  // Добавим метод для получения содержимого корзины с деталями устройств
  static async getContents(basketId) {
    const { rows } = await db.query(`
      SELECT 
        bd.quantity, 
        d.id, 
        d.name, 
        d.price, 
        d.img,
        d.description,
        (d.price * bd.quantity) as total_price
      FROM 
        baskets_devices bd
      JOIN 
        devices d ON bd.device_id = d.id
      WHERE 
        bd.basket_id = $1
    `, [basketId]);
    
    // Рассчитаем общую сумму
    const totalAmount = rows.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
    
    return {
      items: rows,
      totalAmount
    };
  }

  static async removeDevice(basketId, deviceId) {
    const result = await db.query(
      'DELETE FROM baskets_devices WHERE basket_id = $1 AND device_id = $2 RETURNING *',
      [basketId, deviceId]
    );
    return result.rows[0];
  }

  // Добавим метод для очистки всей корзины
  static async clearBasket(basketId) {
    await db.query(
      'DELETE FROM baskets_devices WHERE basket_id = $1',
      [basketId]
    );
  }


}

module.exports = Basket;
