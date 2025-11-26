import Hero from '@/components/Hero';
import Materials from '@/components/Materials';
import Calculator from '@/components/Calculator';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import Portfolio from '@/components/Portfolio';

export default function Index(): React.JSX.Element {
  return (
    <main className="min-h-screen">
      <Hero />
      <Materials />
      <Portfolio />
      <Calculator />
      <Features />
      <Footer />
    </main>
  );
}
