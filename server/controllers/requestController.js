const Request = require('../models/Request');

exports.createRequest = async (req, res) => {
  try {
    const { phone, agreed } = req.body;
    
    if (!phone || !agreed) {
      return res.status(400).json({ error: 'Phone and agreement are required' });
    }

    const newRequest = await Request.create(phone, agreed);
    res.status(201).json(newRequest);
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.getAll();
    res.json(requests);
  } catch (err) {
    console.error('Error getting requests:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};