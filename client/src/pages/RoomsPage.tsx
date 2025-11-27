import { useEffect, useState } from 'react';

interface Room {
  id: number;
  img: string;
  name: string;
  area: number;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);

  async function getAllRooms(): Promise<void> {
    try {
      const response = await fetch(import.meta.env.VITE_API + '/rooms');
      const data: Room[] = await response.json();

      if (response.status === 200) setRooms(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllRooms();
  }, []);

  return (
    <div>
      {rooms.map((el) => (
        <div key={el.id}>
          <img src={el.img} alt={el.name} />
          <div>{el.name}</div>
          <div>{el.area}</div>
          <button>Рассчитать стоимость с такой комнатой</button>
        </div>
      ))}
    </div>
  );
}
