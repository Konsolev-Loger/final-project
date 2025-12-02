import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/shared/hooks/useReduxHook';
import { signOutThunk, updateUserThunk } from '@/entities/user/api/UserApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmailChangeModal } from '@/components/EmailChangeModal';
import { useNavigate } from 'react-router-dom';
import { Pencil, Home } from 'lucide-react';
import { UserOrdersTab } from './UserOrderTab';

export default function ProfilePage() {
  const { user, isLoading: userLoading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [formattedPhone, setFormattedPhone] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: '',
    phone: '',
  });
  const isAdmin = user?.is_admin;
// =====================================================================================
  useEffect(() => {
    if (!user) return;
    setEditData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    });
    if (user.phone) {
      setFormattedPhone(formatPhoneNumber(user.phone));
    }
  }, [user]);
// =====================================================================================
  // Сохранение профиля
  const handleProfileSave = async () => {
    if (!editData.name?.trim()) {
      return;
    }
    try {
      await dispatch(
        updateUserThunk({
          id: user!.id,
          data: {
            name: editData.name,
            phone: editData.phone,
            email: '', // возможно нужно удалить
          },
        }),
      ).unwrap();
      setEditMode(false);
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
    }
  };
// =====================================================================================
  // Форматирование номера телефона
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 11);
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 1) return `+7 (${cleaned.slice(1)}`;
    if (cleaned.length <= 4) return `+7 (${cleaned.slice(1, 4)}`;
    if (cleaned.length <= 7) return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}`;
    if (cleaned.length <= 9)
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}`;
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(
      7,
      9,
    )}-${cleaned.slice(9, 11)}`;
  };
// =====================================================================================
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setFormattedPhone(formatted);

    const cleanPhone = value.replace(/\D/g, '');
    setEditData((prev) => ({ ...prev, phone: cleanPhone.length > 1 ? cleanPhone : '' }));
  };
  if (userLoading) {
    return <div className="text-center py-12">Загрузка профиля...</div>;
  }
  if (!user) {
    navigate('/login');
    return null;
  }
// =====================================================================================
  return (
    <div className="min-h-screen bg-muted py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Карточка профиля */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <CardTitle className="text-2xl">Профиль пользователя</CardTitle>
              {isAdmin && (
                <Badge variant="default" className="w-fit">
                  Администратор
                </Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={() => navigate('/', { replace: true })}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                На главную
              </Button>
              <Button
                onClick={() => {
                  dispatch(signOutThunk());
                  navigate('/', { replace: true });
                }}
                variant="outline"
                size="sm"
              >
                Выйти
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {!editMode ? (
              <div className="space-y-5">
                {/* Имя */}
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium min-w-32">Имя:</span>
                  <span>{user.name || 'Не указано'}</span>
                </div>

                {/* Email */}
                <div className="py-3 border-b">
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-medium min-w-32">Email:</span>
                    <div className="flex items-center gap-3">
                      <span className="text-right">{user.email || 'Не указан'}</span>
                      <Button
                        onClick={() => setShowEmailModal(true)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Сменить
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Телефон */}
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium min-w-32">Телефон:</span>
                  <span>{user.phone ? formatPhoneNumber(user.phone) : 'Не указан'}</span>
                </div>

                <Button onClick={() => setEditMode(true)} className="w-full mt-6">
                  Редактировать профиль
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Имя</label>
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Ваше имя"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Телефон</label>
                  <Input
                    value={formattedPhone}
                    onChange={handlePhoneChange}
                    placeholder="+7 (___) ___-__-_"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleProfileSave} className="flex-1">
                    Сохранить изменения
                  </Button>
                  <Button onClick={() => setEditMode(false)} variant="outline">
                    Отмена
                  </Button>
                </div>
              </div>
            )}

            <EmailChangeModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Мои заказы</CardTitle>
          </CardHeader>
          <CardContent>
            <UserOrdersTab />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
