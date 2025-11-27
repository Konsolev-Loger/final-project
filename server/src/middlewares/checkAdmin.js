const { User } = require('../../db/models');

const checkAdmin = async (req, res, next) => {
  try {
    const { user } = res.locals;
    
    const userFromDb = await User.findByPk(user.id);
    if (!userFromDb || !userFromDb.is_admin) {
      return res.status(403).json({ 
        message: 'Доступ запрещен. Требуются права администратора.' 
      });
    }
    
    next();
  } catch (error) {
    console.log('Admin check error:', error);
    return res.status(500).json({ message: 'Ошибка проверки прав доступа' });
  }
  return next(); // вомзможно нужно удалить
};

module.exports = { checkAdmin };