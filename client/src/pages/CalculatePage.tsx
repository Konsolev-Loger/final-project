import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setArea } from '@/store/calculatorSlice';
import { useEffect } from 'react';
import Calculator from '@/components/Calculator';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-finishing.jpg';

export default function CalculatePage() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); 

  useEffect(() => {
    if (location.state?.area) {
      dispatch(setArea(location.state.area));
    }
  }, [location, dispatch]);

  const handleAddToCart = () => {
    navigate('/card'); 
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
     
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-primary/90 to-primary/70" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center">
          <Calculator />
          <Button
            size="lg"
            onClick={handleAddToCart} 
            className="bg-primary/80 hover:bg-primary text-white text-lg px-8 h-14 -mt-17 border-none"
          >
            Добавить в корзину
          </Button>
        </div>
      </div>
    </section>
  );
}