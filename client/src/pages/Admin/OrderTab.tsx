import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: number;
  user?: { email: string };
  status: boolean;
  total_price: number;
}

interface OrdersTabProps {
  orders: Order[];
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => {
  return (
    <div className="grid gap-4">
      {orders.map((o) => (
        <Card key={o.id} className="backdrop-blur-md bg-white/80 hover:bg-white/95 border-white/40 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="font-bold text-xl text-primary mb-1">Заказ #{o.id}</div>
              <div className="text-sm text-muted-foreground">{o.user?.email || '—'}</div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={`px-4 py-2 font-semibold rounded-full ${o.status ? 'bg-emerald-500' : 'bg-orange-500'} text-white shadow-lg`}>
                {o.status ? 'Выполнен' : 'Ожидает'}
              </Badge>
              <span className="text-2xl font-bold text-primary">{o.total_price} ₽</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};