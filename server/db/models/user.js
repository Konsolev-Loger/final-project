const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Order, { foreignKey: 'user_id', as: 'orders' });
    }

    // =================================================
    static validateEmail(email) {
      // const emailPattern = /^[A-z0-9!-_%.]+@[A-z0-9.-]+\.[A-z]{2,}$/;aaa
      const emailPattern = /^\S+@\S+\.\S+$/;
      return emailPattern.test(email);
    }

    // =================================================
    static validatePassword(password) {
      const hasUpperCase = /[A-Z]/;
      const hasLowerCase = /[a-z]/;
      const hasDigits = /[0-9]/;
      const hasSpecialCharacters = /[!@#$%^&*(),.:"{}|<>]/;
      const isValidLength = password.length >= 6;

      if (
        !hasUpperCase.test(password) ||
        !hasLowerCase.test(password) ||
        !hasDigits.test(password) ||
        !hasSpecialCharacters.test(password) ||
        !isValidLength
      ) {
        return false;
      }
      return true;
    }

    // =================================================
    static validateSignUpData(data) {
      const { name, email, password } = data;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return { isValid: false, err: 'Неверное имя пользователя' };
      }

      if (
        !email ||
        typeof email !== 'string' ||
        email.trim().length === 0 ||
        !this.validateEmail(email)
      ) {
        return { isValid: false, err: 'Неверный адрес электронной почты' };
      }

      if (
        !password ||
        typeof password !== 'string' ||
        password.trim().length === 0 ||
        !this.validatePassword(password)
      ) {
        return {
          isValid: false,
          err: 'Пароль не соответствует критериям валидации',
        };
      }

      return { isValid: true, err: null };
    }

    // =================================================
    static validateSignInData(data) {
      const { email, password } = data;

      if (!email || typeof email !== 'string' || email.trim().length === 0) {
        return { isValid: false, err: 'Неверный адрес электронной почты' };
      }

      if (!password || typeof password !== 'string' || password.trim().length === 0) {
        return {
          isValid: false,
          err: 'Пароль не соответствует критериям валидации',
        };
      }

      return { isValid: true, err: null };
    }
  }
  // =================================================

  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      is_admin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
