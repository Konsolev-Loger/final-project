// services/customRoomService.js — если нужно отдельно работать с кастомными комнатами
const { CastomRoom } = require('../../db/models');

class CustomRoomService {
  static async delete(id) {
    const room = await CastomRoom.findByPk(id);
    if (!room) throw new Error('Кастомная комната не найдена');
    await room.destroy();
    return { message: 'Кастомная комната удалена' };
  }
}

module.exports = CustomRoomService
