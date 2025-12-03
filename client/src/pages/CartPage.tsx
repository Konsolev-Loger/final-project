// pages/CartPage.tsx
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getCartThunk, deleteOneItemThink, createOrderCart } from '@/app/api/CartApi';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { OrderCommentModal } from './ModalForCart/modal';
import { getOrderByUserThunk } from '@/app/api/OrderApi';

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart, error } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getCartThunk());
  }, [dispatch]);

  const handleRemove = async (id: number) => {
    dispatch(deleteOneItemThink(id));
  };

  const handleOpenCheckout = () => {
    setIsModalOpen(true);
  };

  const handleCheckout = (comment: string) => {
    setIsModalOpen(false);

    dispatch(createOrderCart({ comment: comment.trim() || '' }))
      .unwrap()
      .then(() => {
        toast.success(
          <div className="flex flex-col gap-2">
            <span className="font-semibold">✅ Заказ успешно оформлен!</span>
            <span className="text-sm text-muted-foreground">
              Ваш заказ №{Date.now().toString().slice(-6)} принят в обработку
            </span>
          </div>,
          {
            duration: 9000,
            position: 'top-right',
          },
        );

        // Дополнительное уведомление через 1 секунду
        setTimeout(() => {
          toast.info(
            <div className="flex flex-col gap-1">
              <span className="font-semibold">📋 Статус заказа</span>
              <span className="text-sm">Заказ обрабатывается менеджером</span>
              <span className="text-xs text-muted-foreground mt-1">
                Мы свяжемся с вами для уточнения деталей
              </span>
            </div>,
            {
              duration: 9000,
              position: 'top-right',
            },
          );
        }, 3000);
        dispatch(getOrderByUserThunk(user!.id));

        dispatch(getCartThunk());
      })
      .catch(() => {
        toast.error(
          <div className="flex flex-col gap-1">
            <span className="font-semibold">❌ Ошибка при оформлении заказа</span>
            <span className="text-sm">Пожалуйста, попробуйте еще раз</span>
          </div>,
        );
      });
  };

  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2>
        <p className="text-muted-foreground mb-6">
          Все оформленные заказы можно посмотреть в "Профиле"
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link to="/">Перейти на главную</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/profile">Профиль</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-10">Корзина</h1>
        <div className="space-y-4 max-w-4xl mx-auto">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-6 border rounded-lg bg-card"
            >
              <img
                src={`http://localhost:3000/material/${item?.material?.img}`}
                alt={item.material?.name}
                className="w-20 h-20 object-cover rounded-lg mr-4"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.material?.name}</h3>
                <p className="text-muted-foreground">
                  {item.quantity} м² × {item.price_at} ₽/м²
                </p>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-xl font-bold">
                  {(item.quantity * item.price_at).toLocaleString('ru-RU')} ₽
                </span>

                <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id!)}>
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}

          <div className="border-t pt-6 mt-8">
            <div className="flex justify-between text-2xl font-bold mb-8">
              <span>Итого:</span>
              <span className="text-primary">{cart.total_price.toLocaleString('ru-RU')} ₽</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-blue-500 mt-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Информация о заказе</p>
                  <p className="text-sm text-blue-600 mt-1">
                    После оформления заказ будет обработан менеджером в течение 24 часов. Мы
                    свяжемся с вами для подтверждения деталей.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                className="text-lg text-primary hover:underline"
                onClick={() => navigate('/')}
              >
                ← Вернуться на главную
              </button>
              <Button size="lg" onClick={handleOpenCheckout}>
                Оформить заказ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <OrderCommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCheckout}
      />
    </>
  );
}
