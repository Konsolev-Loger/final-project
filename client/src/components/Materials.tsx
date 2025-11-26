import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Paintbrush, Wallpaper, Grid3x3, Package, Sparkles, Layers } from 'lucide-react';
import { materials } from '@/store/calculatorSlice';

const iconMap: Record<string, any> = {
  //! Тут any ребятки, нужно проверить будет
  paint: Paintbrush,
  wallpaper: Wallpaper,
  laminate: Grid3x3,
  parquet: Layers,
  tiles: Package,
  decorative: Sparkles,
};

export default function Materials(): React.JSX.Element {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Наши Материалы</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Работаем только с проверенными материалами премиум качества
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => {
            const Icon = iconMap[material.id];
            return (
              <Card
                key={material.id}
                className="hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border-border bg-card"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">{material.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {material.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {material.pricePerSqm} ₽
                    <span className="text-sm font-normal text-muted-foreground ml-2">/ м²</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
