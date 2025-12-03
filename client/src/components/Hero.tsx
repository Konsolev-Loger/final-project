import { Button } from '@/components/ui/button';
import { ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { ShoppingCart } from 'lucide-react';
import { Crown } from 'lucide-react';
import heroImage from '@/assets/hero-finishing.jpg';

export default function Hero(): React.JSX.Element {
  const { user, status } = useAppSelector((state) => state.user);

  const isLoggedIn = status === 'logged' && user;
  const scrollToCalculator = (): void => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  };
  if (user?.is_admin === true) {
  }

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      id="hero"
    >
      {/* Навигационная панель */}
      <div className="absolute top-0 left-0 right-0 z-30 py-4">
        <div className="container mx-auto px-4">
          {/* Надписи вверху */}
          <div className="flex justify-between items-center px-2 mb-3">
            <div className="flex gap-8 text-white/90 text-sl font-light">
              <div
                className="hover:text-white transition-colors duration-200"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const element = document.getElementById('materials');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Материалы
              </div>

              {/* <div
                className="hover:text-white transition-colors duration-200"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/admin')}
              >
                Админка
              </div> */}

              <div
                className="hover:text-white transition-colors duration-200"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const element = document.getElementById('footer');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Контакты
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Иконка корзины */}
              <Link
                to="/cart"
                className="flex items-center gap-2 text-white hover:text-white/80 transition-colors duration-200 relative"
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>

              {isLoggedIn ? (
                <Link
                  to={user?.is_admin ? '/admin' : '/profile'}
                  className="flex items-center gap-2 text-white hover:text-white/80 transition-colors duration-200 font-medium"
                >
                  {user?.is_admin ? (
                    <>
                      <Crown className="h-5 w-5" />
                      <span className="text-sm font-light">Админ</span>
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4" />
                      <span className="text-sm font-light">Профиль</span>
                    </>
                  )}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-white hover:text-white/80 transition-colors duration-200"
                >
                  <LogIn className="h-5 w-5" />
                  <span className="text-sm font-light">Войти</span>
                </Link>
              )}
            </div>
          </div>

          {/* Линия под надписями - разделитель */}
          <div className="h-[1px] bg-white/30 w-full" />
        </div>
      </div>

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-primary/70 to-primary/70" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Трендовые Отделочные Решения
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 font-light">
            Вополагаем современные идеи в реальность. Премиум качество по честной цене.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={scrollToCalculator}
              className=" border-white text-white hover:bg-white hover:text-primary bg-transparent text-lg px-8 h-14"
            >
              Рассчитать стоимость
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              onClick={() => {
                const element = document.getElementById('portfolio');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="  text-white hover:bg-white hover:text-primary bg-transparent text-lg px-8 h-14"
              style={{ backgroundColor: 'fff' }}
            >
              Наши проекты
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  );
}
