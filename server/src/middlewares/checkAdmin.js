const { User } = require('../../db/models'); 

// eslint-disable-next-line consistent-return
const checkAdmin = async (req, res, next) => {
  try {
    const { user } = res.locals;
    
    if (!user || !user.id) {
      return res.status(401).json({ 
        message: 'Необходима авторизация' 
      });
    }
    
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
};

module.exports = { checkAdmin };