// import { useLocation } from 'react-router-dom';
// import { useAppDispatch } from '@/store/hooks';
// import { setArea } from '@/store/calculatorSlice';
// import { useEffect } from 'react';
// import Calculator from '@/components/Calculator';
// import heroImage from '@/assets/hero-finishing.jpg';

import CalculatorOverlay from "@/components/Calculator";

// src/components/CalculatorPage.tsx

export default function CalculatorPage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/src/assets/hero-finishing.jpg)` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center py-10">
          {/* Просто переиспользуем Overlay-версию — она уже с белым текстом */}
          <CalculatorOverlay />
        </div>
      </div>
    </section>
  );
}