// components/Calculator.tsx
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setMaterial, setCategory, setArea } from '@/store/calculatorSlice';
import { addCartItemThunk } from '@/app/api/CartApi';
import { getAllCategories } from '@/app/api/CategoryApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Calculator as CalcIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Calculator() {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);
  const { selectedMaterialId, selectedCategoryId, area } = useAppSelector(
    (state) => state.calculator,
  );
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  const materialsInCategory = selectedCategoryId
    ? categories.find((cat) => cat.id === selectedCategoryId)?.materials || []
    : categories.flatMap((cat) => cat.materials || []);

  const selectedMaterial = materialsInCategory.find((m) => m.id === selectedMaterialId);
  const pricePerSqm = selectedMaterial ? parseFloat(selectedMaterial.price) : 0;
  const totalPrice = pricePerSqm && area > 0 ? Math.round(pricePerSqm * area) : 0;

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.area && typeof location.state.area === 'number') {
      dispatch(setArea(location.state.area));
      window.history.replaceState({}, document.title);
    }
  }, [location.state, dispatch]);

  const handleAddToCart = async () => {
    if (!selectedMaterial || area <= 0) return;

    setIsAdding(true);

    const payload = {
      material_id: selectedMaterial.id,
      price_at: pricePerSqm,
      quantity: area,
    };

    try {
      await dispatch(addCartItemThunk(payload)).unwrap();
      toast.success('Добавлено в корзину!');
      // dispatch(resetCalculator());
    } catch (err: any) {
      toast.error(err.message || 'Не удалось добавить в корзину');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section className="py-12 bg-muted rounded-2xl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Калькулятор стоимости</h2>
          <p className="text-lg text-muted-foreground">Рассчитайте стоимость материалов</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CalcIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Онлайн-калькулятор</CardTitle>
                <CardDescription>Выберите материал и укажите площадь</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Категория */}
            <div className="space-y-2">
              <Label>Категория</Label>
              <Select
                value={selectedCategoryId?.toString() || ''}
                onValueChange={(v) => dispatch(setCategory(Number(v)))}
              >
                <SelectTrigger>
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

            {/* Материал */}
            <div className="space-y-2">
              <Label>Материал</Label>
              <Select
                value={selectedMaterialId?.toString() || ''}
                onValueChange={(v) => dispatch(setMaterial(Number(v)))}
                disabled={!selectedCategoryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите материал" />
                </SelectTrigger>
                <SelectContent>
                  {materialsInCategory.map((m) => (
                    <SelectItem key={m.id} value={m.id.toString()}>
                      <div className="flex justify-between w-full">
                        <span>{m.name}</span>
                        <span className="text-muted-foreground ml-4">
                          {parseFloat(m.price).toLocaleString('ru-RU')} ₽/м²
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Площадь */}
            <div className="space-y-2">
              <Label>Площадь (м²)</Label>
              <Input
                type="number"
                min="0.1"
                step="0.1"
                placeholder="Например: 25.5"
                value={area || ''}
                onChange={(e) => dispatch(setArea(parseFloat(e.target.value) || 0))}
              />
            </div>

            {/* Итог */}
            {selectedMaterial && area > 0 && (
              <div className="p-5 rounded-lg bg-primary/5 border border-primary/20">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Материал:</span>
                    <span className="font-medium">{selectedMaterial.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Цена за м²:</span>
                    <span>{pricePerSqm.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Площадь:</span>
                    <span>{area} м²</span>
                  </div>
                  <div className="pt-3 border-t border-primary/30">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Итого:</span>
                      <span className="text-primary">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-center text-muted-foreground">
              * Цена ориентировочная. Точная — после замера
            </p>
          </CardContent>
        </Card>

        {/* Кнопка добавления в корзину */}
        {selectedMaterial && area > 0 && (
          <div className="text-center mt-8">
            <Button
              size="lg"
              onClick={() => {
                handleAddToCart(); 
                navigate('/cart'); 
              }}
              disabled={isAdding}
              className="px-10"
            >
              Добавить в корзину
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
