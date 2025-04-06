const Device = require('../models/Device');
const DeviceType = require('../models/DeviceType');

exports.getTypes = async (req, res) => {
  try {
    const types = await DeviceType.getAll();
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDevicesByType = async (req, res) => {
  try {
    const devices = await Device.getByType(req.params.typeId);
    const devicesWithInfo = await Promise.all(
      devices.map(async device => {
        const info = await Device.getInfo(device.id);
        return { ...device, info };
      })
    );
    res.json(devicesWithInfo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};