import { Phone, Mail, MapPin } from 'lucide-react';
import { ArrowUp } from 'lucide-react';

export default function Footer(): React.JSX.Element {
  return (
    <footer className="text-white py-6" id="footer"
    style={{backgroundColor: '#783e008e'}}>
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Трендовые Отделочные Решения</h3>
            <p className="text-white/80">
              Создаем современные и стильные пространства для комфортной жизни
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4 ml-6">Контакты</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                <span>+7 (999) 123-45-67</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <span>info@trendy-finish.ru</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>г. Москва, ул. Примерная, д. 1</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Режим работы</h4>
            <div className="space-y-2 text-white/80">
              <p>Пн-Пт: 9:00 - 20:00</p>
              <p>Сб-Вс: 10:00 - 18:00</p>
              <p className="mt-2 text-secondary font-semibold">Консультация бесплатно!</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-4 pt-4 text-center text-white/60">
          <p>&copy; 2024 Трендовые Отделочные Решения. Все права защищены.</p>
        </div>

        {/* Анимированная стрелка */}
        <button
          className="absolute right-6 bottom-35 w-12 h-12 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/90 transition-colors duration-200 animate-bounce"
          onClick={() => {
            const element = document.getElementById('hero');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }}
          aria-label="Пролистать наверх"
        >
          <ArrowUp className="w-6 h-6 text-white" />
        </button>
      </div>
    </footer>
  );
}
