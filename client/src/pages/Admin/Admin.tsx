import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-finishing.jpg';

interface AdminLayoutProps {
  children: React.ReactNode;
  loading: boolean;
  title?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, loading, title = 'Админ-панель' }) => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/75 to-primary/90" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background/95 via-background/90 to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-20 w-full max-w-7xl">
        <div className="flex items-center justify-between mb-12 text-white">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent drop-shadow-2xl mb-4">
              {title}
            </h1>
            <p className="text-xl text-white/90 font-light max-w-md">
              Управляйте материалами, заказами и пользователями
            </p>
          </div>
          {loading && (
            <div className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
              <span className="text-white font-medium">Загрузка...</span>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/')}
          className="fixed top-4 right-4 z-50 px-6 py-3 bg-white/80 backdrop-blur-md border border-primary rounded-2xl text-primary font-semibold shadow-lg hover:bg-primary/90 hover:text-white transition-all duration-300"
        >
          ← На главную
        </button>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50">
          {children}
        </div>
      </div>
    </section>
  );
};