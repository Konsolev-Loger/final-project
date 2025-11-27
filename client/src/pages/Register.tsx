import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    setError('');
    setLoading(true);
    // Визуальная (фейковая) отправка — сервер вы доделаете сами
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 900);
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
};

export default Register;
