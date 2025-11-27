import type { UserSignInDataType, UserSignUpDataType } from '../model';

export class UserValidator {
  static validateEmail(email: string) {
    const emailPattern = /^[A-z0-9!-_%.]+@[A-z0-9.-]+\.[A-z]{2,}$/;
    return emailPattern.test(email);
  }

  static validatePassword(password: string) {
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasDigits = /[0-9]/;
    const hasSpecialCharacters = /[!@#$%^&*(),.:"{}|<>]/;
    const isValidLength = password.length >= 8;

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

  static validateSignUpData(data: UserSignUpDataType) {
    const { username, email, password } = data;

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return { isValid: false, error: 'Неверное имя пользователя' };
    }

    if (
      !email ||
      typeof email !== 'string' ||
      email.trim().length === 0 ||
      !this.validateEmail(email)
    ) {
      return { isValid: false, error: 'Неверный адрес электронной почты' };
    }

    if (
      !password ||
      typeof password !== 'string' ||
      password.trim().length === 0 ||
      !this.validatePassword(password)
    ) {
      return {
        isValid: false,
        error: 'Пароль не соответствует критериям валидации',
      };
    }

    return { isValid: true, error: null };
  }

  static validateSignInData(data: UserSignInDataType) {
    const { email, password } = data;

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return { isValid: false, error: 'Неверный адрес электронной почты' };
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      return {
        isValid: false,
        error: 'Пароль не соответствует критериям валидации',
      };
    }

    return { isValid: true, error: null };
  }
}
