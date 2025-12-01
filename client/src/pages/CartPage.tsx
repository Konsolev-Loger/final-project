// pages/CartPage.tsx
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getCartThunk, deleteOneItemThink, createOrderCart } from '@/app/api/CartApi';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { cart, error } = useAppSelector((state) => state.cart);
  console.log(cart);

  useEffect(() => {
    dispatch(getCartThunk());
  }, [dispatch]);

  const  handleRemove =  async(id: number) => {
    dispatch(deleteOneItemThink(id));
  };

  const handleCheckout = () => {
    dispatch(createOrderCart({ comment: '' }))
      .unwrap()
      .then(() => {
        toast.success('Заказ успешно оформлен!');
      })
      .catch(() => {
        toast.error('Ошибка при оформлении заказа');
      });
  };

  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2>
        <Button asChild>
          <Link to="/">Перейти в каталог</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Корзина</h1>

      <div className="space-y-4 max-w-4xl mx-auto">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-6 border rounded-lg bg-card"
          >
            <div>
              <h3 className="font-semibold text-lg">{item.material?.name}</h3>
              <p className="text-muted-foreground">
                {item.quantity} м² × {item.price_at.toLocaleString('ru-RU')} ₽/м²
              </p>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-xl font-bold">
                {(item.quantity * item.price_at).toLocaleString('ru-RU')} ₽
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(item.id!)}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}

        <div className="border-t pt-6 mt-8">
          <div className="flex justify-between text-2xl font-bold">
            <span>Итого:</span>
            <span className="text-primary">{cart.total_price.toLocaleString('ru-RU')} ₽</span>
          </div>

          <div className="mt-8 text-right">
            <Button size="lg" onClick={handleCheckout}>
              Оформить заказ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
