import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMemo, useState } from 'react';
import type { MaterialType } from '@/app/type/CategoryType';
import type { CategoryType } from '@/app/type/CategoryType';
import { Plus, Search, X } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { MaterialCard } from './MaterialCard';
import { MaterialFormDialog } from './MaterialModal';

interface MaterialsTabProps {
  materials: MaterialType[];
  categories: CategoryType[];
  onCreate: (data: Partial<MaterialType>) => Promise<void>;
  onUpdate: (id: number, data: Partial<MaterialType>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const MaterialsTab: React.FC<MaterialsTabProps> = ({
  materials,
  categories,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [query, setQuery] = useState('');

  const normalized = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalized) return materials;
    return materials.filter((m) => (m.name || '').toLowerCase().includes(normalized));
  }, [materials, normalized]);
  return (
    <>
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/30">
        <h2 className="text-2xl font-bold text-primary">Материалы ({filtered.length})</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 text-white shadow-xl h-14 px-8 rounded-2xl font-semibold text-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Добавить материал
            </Button>
          </DialogTrigger>
          <MaterialFormDialog categories={categories} onSubmit={onCreate} />
        </Dialog>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            placeholder="Поиск материалов по названию"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
          {query && (
            <button
              aria-label="Очистить поиск"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white/95 shadow-sm border border-transparent text-muted-foreground"
              title="Очистить"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <p className="col-span-full text-center py-20 text-gray-500">Материалы не найдены</p>
        ) : (
          filtered.map((m, i) => (
            <div key={m.id} style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-in">
              <MaterialCard
                material={m}
                categories={categories}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
};
