import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer(): React.JSX.Element {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Трендовые Отделочные Решения</h3>
            <p className="text-white/80">
              Создаем современные и стильные пространства для комфортной жизни
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Контакты</h4>
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
              <p className="mt-4 text-primary font-semibold">Консультация бесплатно!</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>&copy; 2024 Трендовые Отделочные Решения. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
