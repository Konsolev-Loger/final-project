import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { MaterialCard } from './MaterialCard';
import { MaterialFormDialog } from './MaterialModal';

interface MaterialsTabProps {
  materials: Material[];
  categories: Category[];
  onCreate: (data: Partial<Material>) => Promise<void>;
  onUpdate: (id: number, data: Partial<Material>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const MaterialsTab: React.FC<MaterialsTabProps> = ({
  materials,
  categories,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/30">
        <h2 className="text-2xl font-bold text-primary">Материалы ({materials.length})</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 text-white shadow-xl h-14 px-8 rounded-2xl font-semibold text-lg">
              <Plus className="h-5 w-5 mr-2" />
              Добавить материал
            </Button>
          </DialogTrigger>
          <MaterialFormDialog categories={categories} onSubmit={onCreate} />
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.length === 0 ? (
          <p className="col-span-full text-center py-20 text-gray-500">Нет материалов</p>
        ) : (
          materials.map((m, i) => (
            <div key={m.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-in">
              <MaterialCard material={m} categories={categories} onUpdate={onUpdate} onDelete={onDelete} />
            </div>
          ))
        )}
      </div>
    </>
  );
};