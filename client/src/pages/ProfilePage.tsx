import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/shared/hooks/useReduxHook';
import {
  getOrderByUserThunk,
  getAllOrdersThunk,
  updateOrderCommentThunk,
  deleteOrderThunk,
} from '@/app/api/OrderApi';
import { updateUserThunk } from '@/entities/user/api/UserApi';
import type { OrderType } from '@/app/type/OrderType';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { user, status, isLoading: userLoading } = useAppSelector((state) => state.user);
  const orders = useAppSelector((state) => state.order.orders);
  // const isLoadingOrders = useAppSelector((state) => state.order.isLoading);
  const error = useAppSelector((state) => state.order.error);
  const dispatch = useAppDispatch();

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

  console.log('ProfilePage debug:', {
    user,
    status,
    isLoading: userLoading,
    hasUser: !!user,
  });

  // if (status === 'guest') {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-muted">
  //       <div className="text-center">
  //         <div className="text-lg">Пожалуйста, войдите в систему</div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!user || userLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-muted">
  //       <div className="text-center">
  //         <div className="text-lg">Загрузка...</div>
  //       </div>
  //     </div>
  //   );
  // }

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
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
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
            {/* {isLoadingOrders && (
              <div className="text-center text-muted-foreground py-8">Загрузка заказов...</div>
            )}

            {error && (
              <div className="text-center text-destructive bg-destructive/10 p-3 rounded-lg">
                {error}
              </div>
            )}

            {!isLoadingOrders && !error && orders.length === 0 && (
              <div className="text-center text-muted-foreground py-8">Нет заказов</div>
            )} */}

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
