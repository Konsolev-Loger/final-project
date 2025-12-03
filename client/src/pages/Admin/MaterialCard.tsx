import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { getImageSrc } from '@/pages/Admin/getImageSrc';
import type { MaterialType } from '@/app/type/CategoryType';
import type { CategoryType } from '@/app/type/CategoryType';
import { MaterialFormDialog } from './MaterialModal';

interface Props {
  material: MaterialType & { category?: { id: number; name: string } };
  categories: CategoryType[];
  onUpdate: (id: number, data: Partial<MaterialType>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const MaterialCard: React.FC<Props> = ({ material, categories, onUpdate, onDelete }) => {
  return (
    <Card className="group backdrop-blur-md bg-white/80 hover:bg-white/95 border-white/40 shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={getImageSrc(material.img)}
              alt={material.name}
              className="w-20 h-20 object-cover rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300"
              onError={(e) => (e.currentTarget.src = '/fallback.png')}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-primary truncate mb-1">{material.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">
                {material.category?.name || 'Без категории'}
              </p>
              {material.description && (
                <p className="text-xs text-gray-600 line-clamp-2">{material.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/30">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {material.price} руб./м2 ₽
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
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
                <MaterialFormDialog
                  initial={material}
                  categories={categories}
                  onSubmit={(data) => onUpdate(material.id, data)}
                />
              </Dialog>

              <Button
                size="icon"
                variant="ghost"
                aria-label="Удалить"
                onClick={() => onDelete(material.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
