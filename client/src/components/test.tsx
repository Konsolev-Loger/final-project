import { getAllOrdersThunk } from '@/app/api/OrderApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';

export default function TestFunc() {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.order);
  console.log(orders, 'orders');

  useEffect(() => {
    dispatch(getAllOrdersThunk());
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: '1px solid #ccc',
            padding: '15px',
            margin: '10px 0',
            borderRadius: '8px',
          }}
        >
          {/* Основная информация о заказе */}
          <h3>Заказ №{order.id}</h3>
          <p>
            <strong>Статус:</strong> {order.status ? 'Выполнен' : 'В обработке'}
          </p>
          <p>
            <strong>Общая цена:</strong> {order.total_price}
          </p>
          <p>
            <strong>Комментарий:</strong> {order.comment || '—'}
          </p>
          <p>
            <strong>Дата создания:</strong> {new Date(order.createdAt).toLocaleString()}
          </p>

          {order.items && order.items.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <h4>Товары в заказе:</h4>
              {order.items.map((item, index) => (
                <div
                  key={item.id || index}
                  style={{
                    border: '1px solid #eee',
                    padding: '10px',
                    margin: '5px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                  }}
                >
                  {/* Информация о материале */}
                  {item.material && (
                    <>
                      {/* Изображение материала */}
                      {item.material.img && (
                        <img
                          src={`http://localhost:3000/material/${item.material.img}`}
                          alt={item.material.name}
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                          }}
                        />
                      )}

                      <div style={{ flex: 1 }}>
                        <p>
                          <strong>Название:</strong> {item.material.name}
                        </p>
                        <p>
                          <strong>Цена:</strong> {item.material.price}
                        </p>
                        <p>
                          <strong>Описание:</strong> {item.material.title}
                        </p>
                        <p>
                          <strong>ID материала:</strong> {item.material_id}
                        </p>
                        <p>
                          <strong>Количество:</strong> {item.quantity}
                        </p>
                        <p>
                          <strong>Цена на момент заказа:</strong> {item.price_at || 'Не указана'}
                        </p>

                        {/* Дополнительная информация о материале */}
                        <p>
                          <strong>Популярный:</strong> {item.material.is_popular ? 'Да' : 'Нет'}
                        </p>
                        <p>
                          <strong>Категория:</strong> {item.material.category_id}
                        </p>
                        <p>
                          <strong>Создан:</strong>{' '}
                          {new Date(item.material.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}

                  {item.castom_room_id && (
                    <p>
                      <strong>ID кастомной комнаты:</strong> {item.castom_room_id}
                    </p>
                  )}

                  {/* Если материала нет, показываем базовую информацию */}
                  {!item.material && (
                    <div>
                      <p>
                        <strong>ID товара:</strong> {item.id}
                      </p>
                      <p>
                        <strong>Количество:</strong> {item.quantity}
                      </p>
                      <p>
                        <strong>Цена:</strong> {item.price_at}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <hr style={{ margin: '20px 0' }} />
        </div>
      ))}
    </div>
  );
}
