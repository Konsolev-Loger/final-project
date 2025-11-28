import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useReduxHook';
import { signUpThunk } from '@/entities/user/api/UserApi';

export default function Register(): React.JSX.Element {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { status, user } = useAppSelector((state) => state.user);
  console.log(user);
  useEffect(() => {
    if (status === 'logged') navigate('/');
  }, [status, navigate]);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 11); //only ru

    if (limited.length === 0) return '';
    if (limited.length <= 1) return `+7 (${limited.slice(1)}`;
    if (limited.length <= 4) return `+7 (${limited.slice(1, 4)}`;
    if (limited.length <= 7) return `+7 (${limited.slice(1, 4)}) ${limited.slice(4, 7)}`;
    if (limited.length <= 9)
      return `+7 (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7, 9)}`;

    return `+7 (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(
      7,
      9,
    )}-${limited.slice(9, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setFormattedPhone(formatted);

    const cleanPhone = value.replace(/\D/g, '');
    setPhone(cleanPhone);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await dispatch(
        signUpThunk({
          name,
          email,
          password,
          phone: phone || '',
        }),
      ).unwrap();
    } catch (err: any) {
      setError(err?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md bg-background rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Регистрация</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Имя</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иван Иванов"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Телефон (необязательно)</label>
            <Input
              value={formattedPhone}
              onChange={handlePhoneChange}
              placeholder="+7 (___) ___-__-__"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Пароль</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}

          <div className="flex items-center justify-between">
            <Link to="/login" className="text-sm text-primary underline">
              Уже есть аккаунт?
            </Link>
            <Link to="/" className="text-sm text-primary underline">
              На главную
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? 'Создание...' : 'Зарегистрироваться'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
