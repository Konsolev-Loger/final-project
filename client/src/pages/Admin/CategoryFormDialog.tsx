import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CategoryForm } from './CategoryForm';

interface CategoryFormDialogProps {
  initial?: string;
  onSubmit: (name: string) => Promise<void>;
}

export const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  initial = '',
  onSubmit,
}) => {
  return (
    <DialogContent className="bg-white/95 backdrop-blur-xl rounded-3xl p-0 max-w-md mx-auto border-white/50">
      <DialogHeader className="p-8 pb-6 border-b border-white/30">
        <DialogTitle className="text-3xl font-bold text-primary">
          {initial ? 'Редактировать категорию' : 'Новая категория'}
        </DialogTitle>
      </DialogHeader>

      <div className="p-8">
        <CategoryForm initial={initial} onSubmit={onSubmit} />
      </div>
    </DialogContent>
  );
};
