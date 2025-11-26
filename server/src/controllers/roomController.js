const RoomService = require('../services/roomService');
const formatResponse = require('../utils/formatResponse');

class RoomController {
  static async getAll(req, res) {
    try {
      const rooms = await RoomService.getAll();
      if (!rooms)
        return res
          .status(404)
          .json(formatResponse(404, 'Комнаты не найдены', null, 'Комнаты не найдены'));
      return res.status(200).json(formatResponse(200, 'Комнаты получены', rooms, null));
    } catch (error) {
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error));
    }
  }

  static async create(req, res) {
    const { name, area } = req.body;
    try {
      const room = await RoomService.create({ name, area });
      return res.status(201).json(formatResponse(201, 'Комната создана', room, null));
    } catch (error) {
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error));
    }
  }

  static async delete(req, res) {
    const { id } = req.params;
    try {
      const room = await RoomService.delete({ id });
      return res.status(200).json(formatResponse(200, 'Комната удалена', room, null));
    } catch (error) {
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error));
    }
  }

  static async update(req, res) {
    const { name, area } = req.body;
    const { id } = req.params;
    try {
      const room = await RoomService.update({ id }, { name, area });
      return res.status(200).json(formatResponse(200, 'Комната обновлена', room, null));
    } catch (error) {
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error));
    }
  }
}

module.exports = RoomController;
