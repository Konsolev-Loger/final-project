// services/roomService.js (стандартные комнаты — справочник)
const { Room } = require('../../db/models');

class RoomService {
  static async getAll() {
    return Room.findAll();
  }

  static async create(data) {
    return Room.create(data);
  }

  static async update(id, data) {
    const room = await Room.findByPk(id);
    if (!room) throw new Error('Комната не найдена');
    return room.update(data);
  }

  static async delete(id) {
    const room = await Room.findByPk(id);
    if (!room) throw new Error('Комната не найдена');
    await room.destroy();
    return { message: 'Комната удалена' };
  }
}

module.exports = RoomService
