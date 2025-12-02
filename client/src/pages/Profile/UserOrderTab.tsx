// src/components/UserOrdersTab.tsx
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useReduxHook';
import { getOrderByUserThunk } from '@/app/api/OrderApi';

export const UserOrdersTab = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { userOrders, error } = useAppSelector((state) => state.order);

  useEffect(() => {
    if (user?.id) {
      dispatch(getOrderByUserThunk(user.id));
    }
  }, [dispatch, user?.id]);

  if (error) {
    return <div className="text-center py-12 text-destructive">Ошибка: {error}</div>;
  }

  if (!userOrders || userOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">У вас пока нет заказов</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {userOrders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Заказ #{order.id}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={order.status ? 'default' : 'secondary'} className="text-lg px-4">
                  {order.status ? 'Выполнен' : 'В обработке'}
                </Badge>
                <span className="text-2xl font-bold">{order.total_price} ₽</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {order.comment && (
              <div className="p-4 bg-muted rounded-lg text-sm">
                <strong>Комментарий:</strong> {order.comment}
              </div>
            )}

              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    {item.material?.img && (
                      <img
                        src={`http://localhost:3000/material/${item.material.img}`}
                        alt={item.material.name}
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => (e.currentTarget.src = '/placeholder.jpg')}
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.material?.name || 'Товар удалён'}</h4>
                      <p className="text-sm text-muted-foreground">{item.material?.title}</p>
                      <div className="mt-2 flex justify-between">
                        <span className="text-sm">
                          {item.quantity} × {item.price_at || item.material?.price} ₽
                        </span>
                        <span className="font-semibold">
                          {(item.price_at ) * item.quantity} ₽
                        </span>
                      </div>
                      {item.castom_room_id && (
                        <Badge variant="outline" className="mt-2">
                          Кастомная комната #{item.castom_room_id}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
