import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CategoryFormProps {
  initial?: string;
  onSubmit: (name: string) => Promise<void>;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initial = '',
  onSubmit,
}) => {
  const [name, setName] = useState(initial);

  return (
    <div className="grid gap-4">
      <Input
        placeholder="Название категории"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />

      <Button
        onClick={() => onSubmit(name.trim())}
        disabled={!name.trim()}
        className="w-full h-12 text-lg font-semibold"
      >
        {initial ? 'Сохранить изменения' : 'Создать категорию'}
      </Button>
    </div>
  );
};