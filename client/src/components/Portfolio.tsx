import wallImage from '@/assets/wall-finishing.jpg';
import floorImage from '@/assets/floor-finishing.jpg';
import ceilingImage from '@/assets/ceiling-finishing.jpg';

const projects = [
  {
    title: 'Современная квартира',
    category: 'Комплексная отделка',
    image: wallImage,
  },
  {
    title: 'Офисное пространство',
    category: 'Дизайнерские стены',
    image: floorImage,
  },
  {
    title: 'Загородный дом',
    category: 'Премиум материалы',
    image: ceilingImage,
  },
  {
    title: 'Коммерческий объект',
    category: 'Полный ремонт',
    image: wallImage,
  },
  {
    title: 'Частный интерьер',
    category: 'Авторский дизайн',
    image: floorImage,
  },
  {
    title: 'Студия',
    category: 'Минимализм',
    image: ceilingImage,
  },
];

export default function Portfolio(): React.JSX.Element {
  return (
    <section id="portfolio" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Наши Проекты</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Портфолио реализованных проектов с использованием современных материалов
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-soft hover:shadow-elegant transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-sm font-medium mb-1">{project.category}</p>
                <h3 className="text-xl font-bold">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
