// src/components/Calculator.tsx
import { clearCalculator } from '@/store/calculatorSlice';
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
import { Calculator as CalcIcon, ShoppingCart, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useMatch } from 'react-router-dom';
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

  // Определяем, на какой мы странице
  const isCalculatePage = Boolean(useMatch('/calculate'));

  const materialsInCategory = selectedCategoryId
    ? categories.find((cat) => cat.id === selectedCategoryId)?.materials || []
    : categories.flatMap((cat) => cat.materials || []);

  const selectedMaterial = materialsInCategory.find((m) => m.id === selectedMaterialId);
  const pricePerSqm = selectedMaterial ? parseFloat(selectedMaterial.price) : 0;
  const totalPrice = pricePerSqm && area > 0 ? Math.round(pricePerSqm * area) : 0;

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // useEffect(() => {
  //   if (location.state?.area && typeof location.state.area === 'number') {
  //     dispatch(setArea(location.state.area));
  //     window.history.replaceState({}, document.title);
  //   }
  // }, [location.state, dispatch]);
  useEffect(() => {
    if (typeof location.state?.area === 'number') {
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
      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Материал добавлен в корзину</span>
          <span className="text-sm">
            {selectedMaterial.name} - {area} м²
          </span>
        </div>,
        { duration: 4000 },
      );
      dispatch(clearCalculator());
    } catch (err: any) {
      toast.error(err.message || 'Не удалось добавить в корзину');
    } finally {
      setIsAdding(false);
    }
  };

  const titleColor = isCalculatePage ? 'text-white/95' : 'text-foreground ';
  const subtitleColor = isCalculatePage ? 'text-white/80' : 'text-muted-foreground';
  const cardTitleColor = isCalculatePage ? 'text-white' : 'text-foreground';
  const cardDescColor = isCalculatePage ? 'text-white/70' : 'text-muted-foreground';

  return (
    <section className="py-16 lg:py-24" id="calculator">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl md:text-5xl font-bold tracking-tight ${titleColor}`}>
            Калькулятор стоимости
          </h2>
          <p className={`mt-3 text-lg ${subtitleColor}`}>
            Подберите материал и узнайте точную цену за вашу площадь
          </p>
        </div>

        <Card className="max-w-7xl mx-auto shadow-2xl border-0 overflow-hidden bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <CardHeader className="pb-8 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <CalcIcon className="w-9 h-9 text-primary" />
              </div>
              <div>
                <CardTitle className={`text-2xl md:text-3xl font-bold ${cardTitleColor}`}>
                  Онлайн-калькулятор материалов
                </CardTitle>
                <CardDescription className={`text-base mt-1 ${cardDescColor}`}>
                  Выберите категорию, материал и площадь — получите точную стоимость
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Левая часть — выбор */}
              <div className="lg:col-span-2 space-y-7">
                {/* Категория */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Категория</Label>
                  <Select
                    value={selectedCategoryId?.toString() || ''}
                    onValueChange={(v) => dispatch(setCategory(Number(v)))}
                  >
                    <SelectTrigger className="h-12 text-base">
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
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Материал</Label>
                  <Select
                    value={selectedMaterialId?.toString() || ''}
                    onValueChange={(v) => dispatch(setMaterial(Number(v)))}
                    disabled={!selectedCategoryId}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Сначала выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {materialsInCategory.map((m) => (
                        <SelectItem key={m.id} value={m.id.toString()}>
                          <div className="flex justify-between items-center w-full pr-2">
                            <span className="font-medium truncate max-w-[220px]">{m.name}</span>
                            <span className="text-muted-foreground ml-3 shrink-0">
                              {parseFloat(m.price).toLocaleString('ru-RU')} ₽/м²
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Площадь */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Площадь (м²)</Label>
                  <div className="flex flex-col gap-4">
                    <Input
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="Например: 25.5"
                      className="h-12 text-lg font-medium w-full sm:w-48"
                      value={area || ''}
                      onChange={(e) => dispatch(setArea(parseFloat(e.target.value) || 0))}
                    />
                    <button
                      onClick={() => navigate('/rooms')}
                      className="text-primary hover:underline font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
                    >
                      Популярные размеры
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Правая часть — итог */}
              <div className="lg:border-l lg:pl-10 flex flex-col justify-between min-h-[420px]">
                <div className="space-y-6">
                  <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 min-h-[260px] flex flex-col justify-center">
                    {selectedMaterial && area > 0 ? (
                      <div className="space-y-5">
                        <h3 className="font-bold text-xl">Итоговая стоимость</h3>
                        <div className="space-y-4 text-lg">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Цена за м²:</span>
                            <span className="font-semibold">
                              {pricePerSqm.toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Площадь:</span>
                            <span className="font-semibold">{area} м²</span>
                          </div>
                        </div>
                        <div className="mt-6 pt-5 border-t border-primary/30">
                          <div className="flex justify-between items-baseline">
                            <span className="text-xl font-bold">Итого:</span>
                            <span className="text-3xl md:text-4xl font-bold text-primary">
                              {totalPrice.toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <CalcIcon className="w-20 h-20 mx-auto mb-5 opacity-20" />
                        <p className="text-lg font-medium">Заполните форму слева</p>
                        <p className="text-sm mt-2">Расчёт появится автоматически</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Кнопки */}
                <div className="mt-8 space-y-4">
                  <Button
                    size="lg"
                    className="w-full h-14 text-lg font-semibold shadow-lg"
                    onClick={handleAddToCart}
                    disabled={!selectedMaterial || area <= 0 || isAdding}
                  >
                    <ShoppingCart className="w-6 h-6 mr-3" />
                    {isAdding ? 'Добавляем...' : 'Добавить в корзину'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full h-12"
                    onClick={() => navigate('/cart')}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Перейти в корзину
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-10">
              * Цена ориентировочная. Точная стоимость рассчитывается после замера специалистом
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
