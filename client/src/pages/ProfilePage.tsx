import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/shared/hooks/useReduxHook';
import {
  getOrderByUserThunk,
  getAllOrdersThunk,
  updateOrderCommentThunk,
  deleteOrderThunk,
} from '@/app/api/OrderApi';
import { signOutThunk, updateUserThunk } from '@/entities/user/api/UserApi';
import type { OrderType } from '@/app/type/OrderType';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmailChangeModal } from '@/components/EmailChangeModal';
import { useNavigate } from 'react-router-dom';
import { Pencil, Home } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoading: userLoading } = useAppSelector((state) => state.user);
  const orders = useAppSelector((state) => state.order.orders);
  const error = useAppSelector((state) => state.order.error);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name,
    email: '',
    phone: '',
  });
  const [commentEdits, setCommentEdits] = useState<Record<number, string>>({});

  const isAdmin = user?.is_admin;

  useEffect(() => {
    if (!user) return;

    setEditData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    });

    if (isAdmin) {
      dispatch(getAllOrdersThunk());
    } else {
      dispatch(getOrderByUserThunk());
    }
  }, [user, dispatch, isAdmin]);

  const handleProfileSave = async () => {
    if (!editData.name || !editData.email) {
      return;
    }

    try {
      await dispatch(
        updateUserThunk({
          id: user?.id,
          data: editData,
        }),
      ).unwrap();
      setEditMode(false);
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 11);

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

  const [formattedPhone, setFormattedPhone] = useState('');

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);

    setFormattedPhone(formatted);

    const cleanPhone = value.replace(/\D/g, '');
    setEditData({ ...editData, phone: cleanPhone });
  };

  const handleCommentChange = (orderId: number, comment: string) => {
    setCommentEdits((prev) => ({ ...prev, [orderId]: comment }));
  };

  const handleCommentSave = (orderId: number) => {
    const comment = commentEdits[orderId];
    if (comment !== undefined) {
      dispatch(updateOrderCommentThunk({ id: orderId, comment }));
      setCommentEdits((prev) => {
        const newEdits = { ...prev };
        delete newEdits[orderId];
        return newEdits;
      });
    }
  };

  const handleOrderDelete = (orderId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить заказ?')) {
      dispatch(deleteOrderThunk(orderId));
    }
  };

  const getStatusBadge = (status: boolean | string) => {
    if (typeof status === 'boolean') {
      return status ? (
        <Badge variant="default">Подтвержден</Badge>
      ) : (
        <Badge variant="secondary">Ожидание</Badge>
      );
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-muted py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Карточка профиля */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <CardTitle>Профиль пользователя</CardTitle>
              {isAdmin && (
                <Badge variant="default" className="w-fit">
                  Администратор
                </Badge>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                onClick={() => navigate('/', { replace: true })}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 justify-center"
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
                className="justify-center"
              >
                Выйти
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!editMode ? (
              <div className="space-y-4">
                {/* Имя */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b gap-2">
                  <span className="font-medium min-w-24">Имя:</span>
                  <span className="text-right flex-1">{user?.name || 'Не указано'}</span>
                </div>

                {/* Email - исправленная версия */}
                <div className="py-2 border-b">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span className="font-medium min-w-24">Email:</span>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-end">
                      <div className="order-2 sm:order-1 text-right flex-1 sm:flex-none">
                        {user?.email || 'Не указан'}
                      </div>
                      <div className="order-1 sm:order-2">
                        <Button
                          onClick={() => setShowEmailModal(true)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Pencil className="h-3 w-3" />
                          Сменить email
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Телефон */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b gap-2">
                  <span className="font-medium min-w-24">Телефон:</span>
                  <span className="text-right flex-1">{user?.phone || 'Не указан'}</span>
                </div>

                <Button onClick={() => setEditMode(true)} className="w-full mt-4">
                  Редактировать профиль
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Имя</label>
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Телефон</label>
                  <Input
                    value={formattedPhone}
                    onChange={handlePhoneChange}
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleProfileSave} className="flex-1">
                    Сохранить
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

        {/* Карточка заказов */}
        <Card>
          <CardHeader>
            <CardTitle>Заказы {isAdmin && '(все пользователи)'}</CardTitle>
          </CardHeader>
          <CardContent>
            {!error && orders.length > 0 && (
              <div className="space-y-4">
                {orders.map((order: OrderType) => (
                  <Card key={order.id} className="bg-background">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="font-medium">Заказ #{order.id}</span>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Создан: {new Date(order.createdAt).toLocaleString('ru-RU')}
                          </div>
                        </div>
                        <div className="text-lg font-bold self-end sm:self-center">
                          {order.total_price} ₽
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <span className="text-sm font-medium min-w-24">Комментарий:</span>
                        <Input
                          className="flex-1"
                          defaultValue={order.comment || ''}
                          onChange={(e) => handleCommentChange(order.id, e.target.value)}
                          onBlur={() => handleCommentSave(order.id)}
                          placeholder="Добавить комментарий..."
                          disabled={!isAdmin && order.user_id !== user?.id}
                        />
                      </div>

                      {(isAdmin || order.user_id === user?.id) && (
                        <div className="flex justify-end">
                          <Button
                            onClick={() => handleOrderDelete(order.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Удалить заказ
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
