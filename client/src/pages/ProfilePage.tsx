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
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, status, isLoading: userLoading } = useAppSelector((state) => state.user);
  const orders = useAppSelector((state) => state.order.orders);
  const error = useAppSelector((state) => state.order.error);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Профиль пользователя</CardTitle>
            {isAdmin && (
              <Badge variant="default" className="ml-2">
                Администратор
              </Badge>
            )}
            <Button
              onClick={() => {
                dispatch(signOutThunk());
                navigate('/', { replace: true });
              }}
              variant="outline"
              size="sm"
              className=""
            >
              Выйти
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {!editMode ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Имя:</span>
                  <span>{user?.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Email:</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Телефон:</span>
                  <span>{user?.phone || 'Не указан'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">ID:</span>
                  <span className="text-muted-foreground">#{user?.id}</span>
                </div>
                <Button onClick={() => setEditMode(true)} className="w-full">
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
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    placeholder="your@email.com"
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
                <div className="flex gap-3">
                  <Button onClick={handleProfileSave} className="flex-1">
                    Сохранить
                  </Button>
                  <Button onClick={() => setEditMode(false)} variant="outline">
                    Отмена
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Заказ #{order.id}</span>
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Создан: {new Date(order.createdAt).toLocaleString('ru-RU')}
                          </div>
                        </div>
                        <div className="text-lg font-bold">{order.total_price} ₽</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Комментарий:</span>
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
