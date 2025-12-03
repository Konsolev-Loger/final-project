import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryFormDialog } from './CategoryFormDialog';
import { CategoryType } from '@/app/type/CategoryType';

interface CategoriesTabProps {
  categories: CategoryType[];
  onCreate: (name: string) => Promise<void>;
  onUpdate: (id: number, name: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categories,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/30">
        <h2 className="text-2xl font-bold text-primary">Категории ({categories.length})</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 text-white shadow-xl h-14 px-8 rounded-2xl font-semibold text-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Добавить категорию
            </Button>
          </DialogTrigger>
          <CategoryFormDialog onSubmit={onCreate} />
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories.map((c) => (
          <Card
            key={c.id}
            className="backdrop-blur-md bg-white/80 hover:bg-white/95 border-white/40 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <h3 className="font-bold text-xl text-primary">{c.name}</h3>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label="Редактировать"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <CategoryFormDialog initial={c.name} onSubmit={(name) => onUpdate(c.id, name)} />
                </Dialog>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Удалить"
                  onClick={() => onDelete(c.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};
