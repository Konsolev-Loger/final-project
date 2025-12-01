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
import { setMaterial, setCategory, setArea } from '@/store/calculatorSlice';
import { Calculator as CalcIcon } from 'lucide-react';

export default function Calculator(): React.JSX.Element {
  const dispatch = useAppDispatch();
  
  const { selectedMaterialId, selectedCategoryId, area } = useAppSelector((state) => state.calculator);
  const { categories } = useAppSelector((state) => state.category);

  // Все материалы из выбранной категории (или все, если категория не выбрана)
  const materialsInCategory = selectedCategoryId
    ? categories.find(cat => cat.id === selectedCategoryId)?.materials || []
    : categories.flatMap(cat => cat.materials || []);

  // Находим выбранный материал
  const selectedMaterial = materialsInCategory.find(m => m.id === selectedMaterialId);

  // Считаем цену
  const pricePerSqm = selectedMaterial ? parseFloat(selectedMaterial.price) : 0;
  const totalPrice = pricePerSqm && area > 0 ? pricePerSqm * area : 0;

  return (
    <section id="calculator" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Калькулятор Стоимости
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Рассчитайте предварительную стоимость с нашими материалами
          </p>
        </div>

        <Card className="max-w-2xl mx-auto shadow-strong border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CalcIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl text-foreground">Онлайн-калькулятор</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Выберите материал из каталога и укажите площадь
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Выбор категории */}
            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Select
                value={selectedCategoryId?.toString() || ''}
                onValueChange={(value) => dispatch(setCategory(Number(value)))}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Выбор материала */}
            <div className="space-y-2">
              <Label htmlFor="material">Материал</Label>
              <Select
                value={selectedMaterialId?.toString() || ''}
                onValueChange={(value) => dispatch(setMaterial(Number(value)))}
                disabled={!selectedCategoryId && categories.length > 1}
              >
                <SelectTrigger id="material">
                  <SelectValue placeholder="Сначала выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {materialsInCategory.map((material) => (
                    <SelectItem key={material.id} value={material.id.toString()}>
                      <div className="flex justify-between items-center w-full">
                        <span>{material.name}</span>
                        <span className="text-muted-foreground ml-4">
                          {parseFloat(material.price).toLocaleString('ru-RU')} ₽/м²
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Площадь */}
            <div className="space-y-2">
              <Label htmlFor="area">Площадь помещения (м²)</Label>
              <Input
                id="area"
                type="number"
                min="1"
                step="0.1"
                placeholder="Например: 25.5"
                value={area || ''}
                onChange={(e) => dispatch(setArea(parseFloat(e.target.value) || 0))}
              />
            </div>

            {/* Результат */}
            {selectedMaterial && area > 0 && (
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-primary/20">
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground">Материал:</span>
                    <span className="font-medium">{selectedMaterial.name}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground">Цена за м²:</span>
                    <span className="font-semibold">{pricePerSqm.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground">Площадь:</span>
                    <span className="font-semibold">{area} м²</span>
                  </div>

                  <div className="pt-6 border-t border-primary/30">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">Итого:</span>
                      <span className="text-4xl font-bold text-primary">
                        {Math.round(totalPrice).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground text-center pt-6">
              * Цена указана ориентировочно. Точная стоимость — после замера и консультации
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}