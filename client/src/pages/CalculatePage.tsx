import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setArea } from '@/store/calculatorSlice';
import { useEffect } from 'react';
import Calculator from '@/components/Calculator';
import heroImage from '@/assets/hero-finishing.jpg';

export default function CalculatePage() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (location.state?.area) {
      dispatch(setArea(location.state.area));
    }
  }, [location, dispatch]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden border-radius" >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-primary/90 to-primary/70" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center" >
          <Calculator />
        </div>
      </div>
    </section>
  );
}
