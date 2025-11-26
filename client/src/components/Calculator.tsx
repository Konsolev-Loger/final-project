import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setMaterial, setArea, materials } from '@/store/calculatorSlice';
import { Calculator as CalcIcon } from 'lucide-react';

export default function Calculator(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { selectedMaterial, area, totalPrice } = useAppSelector((state) => state.calculator);

  const currentMaterial = materials.find((m) => m.id === selectedMaterial);

  return (
    <section id="calculator" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Калькулятор Стоимости
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Рассчитайте предварительную стоимость отделочных работ онлайн
          </p>
        </div>

        <Card className="max-w-2xl mx-auto shadow-strong border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CalcIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl text-foreground">Онлайн расчет</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Выберите материал и укажите площадь помещения
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className=" space-y-6 ">
            <div className="space-y-2">
              <Label htmlFor="material" className="flex gap-5 text-foreground">
                Выберите материал
              </Label>
              <Select
                value={selectedMaterial}
                onValueChange={(value) => dispatch(setMaterial(value))}
              >
                <SelectTrigger
                  id="material"
                  className="border-border bg-background text-foreground"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.name} - {material.pricePerSqm} ₽/м²
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area" className="flex gap-5 text-foreground">
                Площадь помещения (м²)
              </Label>
              <Input
                id="area"
                type="number"
                min="0"
                step="0.1"
                placeholder="Введите площадь"
                value={area || ''}
                onChange={(e) => dispatch(setArea(parseFloat(e.target.value) || 0))}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {currentMaterial && (
              <div className="p-6 rounded-lg bg-linear-to-br from-primary/10 to-accent/10 border border-primary/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Цена за м²:</span>
                  <span className="text-xl font-semibold text-foreground">
                    {currentMaterial.pricePerSqm} ₽
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Площадь:</span>
                  <span className="text-xl font-semibold text-foreground">{area || 0} м²</span>
                </div>
                <div className="pt-4 border-t border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-foreground">Итого:</span>
                    <span className="text-3xl font-bold text-primary">
                      {totalPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground text-center">
              * Окончательная стоимость определяется после осмотра объекта
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
