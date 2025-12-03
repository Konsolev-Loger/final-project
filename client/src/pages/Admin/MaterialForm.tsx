import { useState } from 'react';
import type { MaterialType } from '@/app/type/CategoryType';
import type { CategoryType } from '@/app/type/CategoryType';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getImageSrc } from './getImageSrc';

interface MaterialFormProps {
  initial?: Partial<MaterialType>;
  categories: CategoryType[];
  onSubmit: (data: Partial<MaterialType>) => Promise<void>;
  onClose?: () => void;
  submitLabel?: string;
}

export const MaterialForm: React.FC<MaterialFormProps> = ({
  initial,
  categories,
  onSubmit,
  onClose,
  submitLabel,
}) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [price, setPrice] = useState<string>((initial?.price ?? '').toString());
  const [description, setDescription] = useState(initial?.description ?? '');
  const [img, setImg] = useState(initial?.img ?? '');
  const [categoryId, setCategoryId] = useState<number | ''>(initial?.category_id ?? '');

  const handleSubmit = async () => {
    if (!name.trim() || !price) return;

    try {
      await onSubmit({
        name: name.trim(),
        price: price.toString(),
        description: description.trim() || undefined,
        img: img.trim() || undefined,
        category_id: categoryId || undefined,
      });

      onClose?.();
    } catch (error) {
      console.error('Ошибка при отправке:', error);
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Название</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Гранит, мрамор..."
          autoFocus
        />
      </div>

      <div className="grid gap-2">
        <Label>Цена (₽)</Label>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="1500"
        />
      </div>

      <div className="grid gap-2">
        <Label>Описание (необязательно)</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Высокопрочный камень..."
        />
      </div>

      <div className="grid gap-2">
        <Label>Изображение (URL или имя файла)</Label>
        <Input value={img} onChange={(e) => setImg(e.target.value)} placeholder="granite.jpg" />
        {img && (
          <img
            src={getImageSrc(img)}
            alt="preview"
            className="w-full max-w-xs h-48 object-cover rounded-lg border"
            onError={(e) => (e.currentTarget.src = '/fallback.png')}
          />
        )}
      </div>

      <div className="grid gap-2">
        <Label>Категория</Label>
        <select
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">Без категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={handleSubmit} className="flex-1">
          {submitLabel ? submitLabel : initial?.id ? 'Сохранить изменения' : 'Создать материал'}
        </Button>
        {/* <Button variant="outline" onClick={onClose}>
          Отмена
        </Button> */}
      </div>
    </div>
  );
};
