import { Button } from '@/components/ui/button';
import { ArrowRight, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-finishing.jpg';
import { LogIn } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

export default function Hero(): React.JSX.Element {
  const navigate = useNavigate();
  const { user, status } = useAppSelector((state) => state.user);

  const isLoggedIn = status === 'logged' && user;
  const scrollToCalculator = (): void => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute top-4 right-6 z-20 flex flex-col items-end gap-7">
        {isLoggedIn ? (
          <Link className="text-white hover:text-white/80 transition-colors" to="/profile">
            <User className="h-5 w-5" />
          </Link>
        ) : (
          <Link className="text-white hover:text-white/80 transition-colors" to="/login">
            <LogIn className="h-5 w-5" />
          </Link>
        )}
      </div>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-primary/90 to-primary/70" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
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
              className="border-1 border-white text-white hover:bg-white hover:text-primary bg-transparent text-lg px-8 h-14"
            >
              Рассчитать стоимость
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const element = document.getElementById('portfolio');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-1 border-white text-white hover:bg-white hover:text-primary bg-transparent text-lg px-8 h-14"
            >
              Наши проекты
            </Button>
            <Button
              onClick={() => navigate('/category')}
              className="border-1 border-white text-white hover:bg-white hover:text-primary bg-transparent text-lg px-8 h-14"
            >
              ДЛЯ ТЕСТА
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
