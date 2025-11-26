import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-finishing.jpg';

export default function Hero(): React.JSX.Element {
  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* <div className="absolute inset-0 opacity-95" style={{ background: `url(${heroImage})` }} /> */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-primary/90 to-primary/70" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="text-white/95 hover:text-white/100 border-white/30"
          >
            <Link to="/login">Войти</Link>
          </Button>
          <Button asChild size="sm" className="bg-white text-secondary hover:bg-white/95 h-10 px-4">
            <Link to="/register">Регистрация</Link>
          </Button>
        </div>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Трендовые Отделочные Решения
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 font-light">
            Воплощаем современные идеи в реальность. Премиум качество по честной цене.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={scrollToCalculator}
              className="bg-white text-secondary hover:bg-white/90 shadow-strong text-lg px-8 h-14"
            >
              Рассчитать стоимость
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-secondary bg-transparent text-lg px-8 h-14"
            >
              Наши работы
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
