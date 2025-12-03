import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, CheckCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getAllOrdersThunk, deleteOrderThunk, updateOrderStatusThunk } from '@/app/api/OrderApi';
import { OrderType } from '@/app/type/OrderType';

export const OrdersTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.order);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(getAllOrdersThunk());
  }, [dispatch]);

  const handleStatusToggle = async (order: OrderType) => {
    const result = await dispatch(updateOrderStatusThunk({ id: order.id, status: !order.status }));

    if (updateOrderStatusThunk.fulfilled.match(result)) {
      toast({
        title: 'Статус обновлён',
        description: `Заказ #${order.id} теперь ${result.payload.status ? 'Выполнен' : 'Ожидает'}`,
      });
    } else {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус заказа',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (orderId: number) => {
    const result = await dispatch(deleteOrderThunk(orderId));

    if (deleteOrderThunk.fulfilled.match(result)) {
      toast({
        title: 'Заказ удалён',
        description: `Заказ #${orderId} успешно удалён`,
      });
    } else {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить заказ',
        variant: 'destructive',
      });
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">Заказов пока нет</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {orders.map((order: OrderType) => (
        <Card
          key={order.id}
          className="backdrop-blur-md bg-white/80 hover:bg-white/95 border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <CardContent className="p-6">
            {/* Заголовок + статус + цена + действия */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <div>
                <div className="font-bold text-2xl text-primary mb-1">Заказ #{order.id}</div>
                <div className="text-sm text-muted-foreground">
                  Почта пользователя: {order.user?.email || 'Неизвестно'}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Badge
                  className={`px-4 py-2 font-semibold rounded-full ${
                    order.status ? 'bg-emerald-500' : 'bg-orange-500'
                  } text-white shadow-lg`}
                >
                  {order.status ? 'Выполнен' : 'Ожидает'}
                </Badge>

                <span className="text-2xl font-bold text-primary">{order.total_price} ₽</span>

                {/* Кнопки действий */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={order.status ? 'outline' : 'default'}
                    onClick={() => handleStatusToggle(order)}
                  >
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Выполнить
                    </>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить заказ #{order.id}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие нельзя отменить. Заказ будет удалён навсегда.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(order.id)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>

            {/* Остальная часть карточки (комментарий, товары и т.д.) — без изменений */}
            {order.comment && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>Комментарий:</strong> {order.comment}
                </p>
              </div>
            )}

            {/* Товары в заказе — оставляем как было */}
            {order.items && order.items.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Товары в заказе:</h4>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-start"
                    >
                      {item.material?.img && (
                        <div className="flex-shrink-0">
                          <img
                            src={`http://localhost:3000/material/${item.material.img}`}
                            alt={item.material.name}
                            className="w-32 h-32 object-cover rounded-lg"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        {item.material ? (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <p className="font-medium text-lg">{item.material.name}</p>
                                <p className="text-sm text-gray-600">{item.material.title}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-primary">
                                  {item.price_at || item.material.price} ₽
                                </p>
                                <p className="text-sm text-gray-500">Количество: {item.quantity}</p>
                              </div>
                            </div>
                            {/* Остальные детали материала */}
                          </>
                        ) : (
                          <div>Товар удалён или недоступен</div>
                        )}
                        {item.castom_room_id && (
                          <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                            <p className="text-sm text-blue-700">
                              <strong>Кастомная комната ID:</strong> {item.castom_room_id}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!order.items || order.items.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>В этом заказе нет товаров</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
