import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Room {
  id: number;
  img: string;
  name: string;
  area: number;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  console.log(rooms);
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
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Стандартные размеры комнат </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            Выберите тип комнаты — можно рассчитать материалы и стоимость на основании заданной площади.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((el) => (
            <article
              key={el.id}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-elegant transition-shadow duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={`http://localhost:3000/flats/${el.img}`}
                  alt={el.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute left-4 bottom-4 text-primary-foreground z-10">
                  <p className="text-sm font-medium opacity-90">Площадь: {el.area} м²</p>
                  <h3 className="text-xl font-bold">{el.name}</h3>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Тип комнаты</p>
                  <div className="font-semibold text-foreground">{el.name}</div>
                </div>
                <div>
                  <Button size="sm" variant="default" className="whitespace-nowrap">
                    Рассчитать
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
