import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MaterialForm } from './MaterialForm';

import type { MaterialType } from '@/app/type/CategoryType';
import type { CategoryType } from '@/app/type/CategoryType';

interface MaterialFormDialogProps {
  initial?: Partial<MaterialType>;
  categories: CategoryType[];
  onSubmit: (data: Partial<MaterialType>) => Promise<void>;
}

export const MaterialFormDialog: React.FC<MaterialFormDialogProps> = ({
  initial,
  categories,
  onSubmit,
}) => {
  const isEdit = !!initial?.id;

  return (
    <DialogContent className="bg-white/95 backdrop-blur-xl rounded-3xl p-0 max-w-2xl mx-auto border-white/50">
      <DialogHeader className="p-8 pb-6 border-b border-white/30">
        <DialogTitle className="text-3xl font-bold text-primary">
          {isEdit ? 'Редактировать материал' : 'Новый материал'}
        </DialogTitle>
      </DialogHeader>
      <div className="p-8">
        <MaterialForm
          initial={initial}
          categories={categories}
          onSubmit={onSubmit}
          submitLabel={isEdit ? 'Сохранить изменения' : 'Создать материал'}
        />
      </div>
    </DialogContent>
  );
};
