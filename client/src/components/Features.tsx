import { Shield, Clock, Award, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Гарантия качества",
    description: "Даем гарантию на все виды работ до 3 лет"
  },
  {
    icon: Clock,
    title: "Точные сроки",
    description: "Соблюдаем договорные сроки выполнения работ"
  },
  {
    icon: Award,
    title: "Премиум материалы",
    description: "Работаем только с проверенными брендами"
  },
  {
    icon: Users,
    title: "Опытная команда",
    description: "Профессионалы с опытом работы от 10 лет"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Почему Выбирают Нас
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Мы создаем пространства, в которых хочется жить
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-xl hover:shadow-soft transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
