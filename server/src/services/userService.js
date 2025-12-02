const { User } = require('../../db/models');

class UserService {
  static async getUserByEmail(email) {
    if (!email) return null;
    return (await User.findOne({ where: { email } }))?.get();
  }

  static async createUser(userData) {
    return (await User.create(userData))?.get();
  }

  static async getUserById(id) {
    return (await User.findByPk(id, {}))?.get();
  }

  static async updateUser(id, data) {
    try {
      const user = await User.findByPk(id);
      if (!user) return null;

      await user.update(data);
      return user;
    } catch (error) {
      console.log('===UserService.updateUser===', error);
      throw error;
    }
  }
}

module.exports = UserService;
