import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowRight } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { setArea } from '@/store/calculatorSlice';

interface Room {
  id: number;
  img: string;
  name: string;
  area: number;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  async function getAllRooms(): Promise<void> {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/rooms');
      const data: any = await response.json();
      if (response.status === 200) setRooms(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllRooms();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-5">
            <Home className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Стандартные размеры комнат
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Выберите тип комнаты — мы автоматически подставим площадь в калькулятор
          </p>
        </div>

        {/* Сетка с парящими карточками */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {rooms.map((el) => (
            <article
              key={el.id}
              onClick={() => {
                dispatch(setArea(el.area));
                navigate('/calculate', { replace: true });
              }}
              className="
                group relative bg-card rounded-2xl overflow-hidden shadow-lg border border-border/60 cursor-pointer
                transition-all duration-500 ease-out
                hover:shadow-2xl hover:-translate-y-4 hover:rotate-1
                hover:[transform:perspective(1000px)_rotateX(8deg)_rotateY(8deg)]
                origin-bottom
              "
              style={{
                transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
              }}
            >
              {/* Изображение */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={`http://localhost:3000/flats/${el.img}`}
                  alt={el.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Бейдж с площадью */}
                <div
                  className="absolute top-4 right-4  text-primary-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                  style={{ backgroundColor: '#85858588' }}
                >
                  {el.area} м²
                </div>

                {/* Название на фото */}
                <div className="absolute bottom-5 left-5 text-white">
                  <h3 className="text-2xl font-bold tracking-wide drop-shadow-lg">{el.name}</h3>
                </div>
              </div>

              {/* Нижняя часть */}
              <div className="p-5 bg-card/95 backdrop-blur-sm border-t border-border/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Тип помещения
                    </p>
                    <p className="font-medium text-foreground mt-0.5">{el.name}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="default"
                    className="font-medium transition-all"
                    style={{ backgroundColor: '#6d3100b8' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(setArea(el.area));
                      navigate('/calculate', { replace: true });
                    }}
                  >
                    Рассчитать
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Парящий эффект + свечение */}
              <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/0 group-hover:ring-primary/30 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
              <div className="absolute -inset-1 bg-primary/10 blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 -z-10" />
            </article>
          ))}
        </div>

        {/* Заглушка */}
        {rooms.length === 0 && (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg">Загружаем планировки...</p>
          </div>
        )}
      </div>
    </section>
  );
}
