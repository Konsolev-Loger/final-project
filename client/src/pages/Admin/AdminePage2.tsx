import { AdminTabs } from './AdminTab';
import { MaterialsTab } from './MaterialTab';
import { CategoriesTab } from './CategoryTab';
import { OrdersTab } from './OrderTab';
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { AdminLayout } from './Admin';
import { MaterialType } from '@/app/type/CategoryType';

interface Category {
  id: number;
  name: string;
  materialsCount?: number;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'materials' | 'categories' | 'orders' | 'users'>(
    'materials',
  );

  const getImageSrc = (img?: string): string => {
    console.log(getImageSrc);
    if (!img) return '/fallback.png';
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    const base = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
    const root = base ? base.replace(/\/api\/?$/, '') : 'http://localhost:3000';
    return `${root}/material/${img}`;
  };
  // const [dialogOpen, setDialogOpen] = useState(false);
  const [materials, setMaterials] = useState<MaterialType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMaterials = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', '50');

      const { data } = await axiosInstance.get(`/material?${params.toString()}`);
      if (data?.statusCode === 200) {
        const mats = data.data?.materials ?? (Array.isArray(data.data) ? data.data : []);
        setMaterials(mats);
      } else {
        throw new Error(data?.message || 'Ошибка загрузки материалов');
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Ошибка',
        description: err instanceof Error ? err.message : 'Не удалось загрузить материалы',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // fetchCategories без параметра поиска
  const fetchCategories = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', '50');

      const { data } = await axiosInstance.get(`/category?${params.toString()}`);
      if (data?.statusCode === 200) {
        const cats = data.data?.categories ?? (Array.isArray(data.data) ? data.data : []);
        setCategories(cats);
      } else {
        throw new Error(data?.message || 'Ошибка загрузки категорий');
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Ошибка',
        description: err instanceof Error ? err.message : 'Не удалось загрузить категории',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMaterials();
  }, []);

  /* --- Materials CRUD --- */
  const createMaterial = async (payload: Partial<MaterialType>) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/material', payload);
      if (data?.statusCode === 201 || data?.statusCode === 200) {
        setMaterials((s) => [newItem, ...s]);
        const newItem = data.data?.material ?? data.data;
        toast({ title: 'Успех', description: 'Материал добавлен' });
      } else throw new Error(data?.message || 'Ошибка создания материала');
    } catch (err) {
      console.error(err);
      toast({
        title: 'Ошибка',
        description: err instanceof Error ? err.message : 'Не удалось создать материал',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMaterial = async (id: number, payload: Partial<MaterialType>) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.put(`/material/${id}`, payload);
      if (data?.statusCode === 200) {
        const updated = data.data?.material ?? data.data;
        setMaterials((s) => s.map((m) => (m.id === id ? updated : m)));
        toast({ title: 'Успех', description: 'Материал обновлён' });
      } else throw new Error(data?.message || 'Ошибка обновления материала');
    } catch (err) {
      console.error(err);
      toast({
        title: 'Ошибка',
        description: err instanceof Error ? err.message : 'Не удалось обновить материал',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMaterial = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить материал?')) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.delete(`/material/${id}`);
      if (data?.statusCode === 200) {
        setMaterials((s) => s.filter((m) => m.id !== id));
        toast({ title: 'Успех', description: 'Материал удалён' });
      } else throw new Error(data?.message || 'Ошибка удаления материала');
    } catch (err) {
      console.error(err);
      toast({
        title: 'Ошибка',
        description: err instanceof Error ? err.message : 'Не удалось удалить материал',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  /* --- Categories CRUD --- */
  const createCategory = async (name: string) => {
    try {
      const { data } = await axiosInstance.post('/category', { name });
      if (data?.statusCode === 201 || data?.statusCode === 200) {
        const newCat = data.data?.category ?? data.data;
        setCategories((s) => [newCat, ...s]);
        toast({ title: 'Успех', description: 'Категория добавлена' });
      } else throw new Error(data?.message || 'Ошибка создания категории');
    } catch (err: any) {
      console.error(err);
      const serverMsg =
        err?.response?.data?.message || err?.message || 'Не удалось создать категорию';
      toast({
        title: 'Ошибка',
        description: serverMsg,
        variant: 'destructive',
      });
    }
  };

  const updateCategory = async (id: number, name: string) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.put(`/category/${id}`, { name });
      if (data?.statusCode === 200) {
        const updated = data.data?.category ?? data.data;
        setCategories((s) => s.map((c) => (c.id === id ? updated : c)));
        toast({ title: 'Успех', description: 'Категория обновлена' });
      } else throw new Error(data?.message || 'Ошибка обновления категории');
    } catch (err: any) {
      console.error(err);
      const serverMsg =
        err?.response?.data?.message || err?.message || 'Не удалось обновить категорию';
      toast({
        title: 'Ошибка',
        description: serverMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить категорию?')) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.delete(`/category/${id}`);
      if (data?.statusCode === 200) {
        setCategories((s) => s.filter((c) => c.id !== id));
        toast({ title: 'Успех', description: 'Категория удалена' });
      } else throw new Error(data?.message || 'Ошибка удаления категории');
    } catch (err: any) {
      console.error(err);
      const serverMsg =
        err?.response?.data?.message || err?.message || 'Не удалось удалить категорию';
      toast({
        title: 'Ошибка',
        description: serverMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

  return (
    <AdminLayout loading={loading}>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab as (value: string) => void}
        defaultValue="materials"
        className="w-full"
      >
        <AdminTabs activeTab={activeTab} onChange={setActiveTab as (value: string) => void} />

        <TabsContent value="materials" className="mt-0">
          <MaterialsTab
            materials={materials}
            categories={categories}
            onCreate={createMaterial}
            onUpdate={updateMaterial}
            onDelete={deleteMaterial}
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-0">
          <CategoriesTab
            categories={categories}
            onCreate={createCategory}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
          />
        </TabsContent>

        <TabsContent value="orders" className="mt-0">
          <OrdersTab />
        </TabsContent>

        {/* <TabsContent value="users" className="mt-0">
          <UsersTab />
        </TabsContent> */}
      </Tabs>
    </AdminLayout>
  );
};

export default AdminPage;
