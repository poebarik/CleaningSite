const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Получение всех типов устройств
router.get('/types', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM device_types');
    
    // Добавляем проверку на пустой результат
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No device types found' });
    }
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching device types:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      details: err.message 
    });
  }
});

// Получение устройств по типу (добавляем к вашему коду)
router.get('/type/:typeId', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT d.*, b.name as brand_name 
       FROM devices d
       JOIN brands b ON d.brand_id = b.id
       WHERE d.type_id = $1`,
      [req.params.typeId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No devices found for this type' });
    }
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching devices by type:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      details: err.message 
    });
  }
});

module.exports = router;