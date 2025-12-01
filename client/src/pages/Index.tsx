import Hero from '@/components/Hero';
import Calculator from '@/components/Calculator';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import Portfolio from '@/components/Portfolio';
import MaterialsAccordion from '@/components/Materials';

export default function Index(): React.JSX.Element {
  return (
    <main className="min-h-screen">
      <Hero />
      <MaterialsAccordion />
      <Portfolio />
      <Calculator />
      <Features />
      <Footer />
    </main>
  );
}
