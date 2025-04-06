const db = require('../config/db');
const Basket = require('../models/Basket');

exports.addToBasket = async (req, res) => {
  try {
    const { deviceId, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Check if device exists
    const device = await db.query('SELECT * FROM devices WHERE id = $1', [deviceId]);
    if (device.rows.length === 0) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Get or create basket for user
    let basket = await Basket.getByUser(userId);
    if (!basket) {
      basket = await Basket.create(userId);
    }

    // Add device to basket
    await Basket.addDevice(basket.id, deviceId, quantity);

    res.status(200).json({ message: 'Device added to basket successfully' });
  } catch (err) {
    console.error('Error adding to basket:', err);
    res.status(500).json({ message: err.message });
  }
};

// Добавим метод для получения содержимого корзины
exports.getBasket = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get basket
    let basket = await Basket.getByUser(userId);
    if (!basket) {
      return res.status(404).json({ message: 'Basket not found' });
    }
    
    // Get basket contents with device details
    const contents = await Basket.getContents(basket.id);
    
    res.status(200).json({ 
      basket: contents 
    });
  } catch (err) {
    console.error('Error getting basket:', err);
    res.status(500).json({ message: err.message });
  }
};








exports.removeFromBasket = async (req, res) => {
    try {
      const { deviceId } = req.params;
      const userId = req.user.id;
  
      // Находим корзину пользователя
      const basket = await Basket.getByUser(userId);
      if (!basket) {
        return res.status(404).json({ message: 'Basket not found' });
      }
  
      // Удаляем устройство из корзины
      const result = await Basket.removeDevice(basket.id, deviceId);
      if (!result) {
        return res.status(404).json({ message: 'Device not found in basket' });
      }
  
      // Получаем обновленное содержимое корзины
      const contents = await Basket.getContents(basket.id);
      
      res.status(200).json({ 
        message: 'Device removed from basket',
        basket: contents
      });
    } catch (err) {
      console.error('Error removing from basket:', err);
      res.status(500).json({ message: err.message });
    }
  };
  
  // Очистка всей корзины
  exports.clearBasket = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Находим корзину пользователя
      const basket = await Basket.getByUser(userId);
      if (!basket) {
        return res.status(404).json({ message: 'Basket not found' });
      }
  
      // Очищаем корзину
      await Basket.clearBasket(basket.id);
      
      res.status(200).json({ 
        message: 'Basket cleared successfully',
        basket: { items: [], totalAmount: 0 }
      });
    } catch (err) {
      console.error('Error clearing basket:', err);
      res.status(500).json({ message: err.message });
    }
  };