import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Material {
  id: number;
  name: string;
  price: number;
  description?: string;
  img?: string;
  is_popular?: boolean;
  category_id?: number;
  category?: { id: number; name: string } | null;
}

interface Category {
  id: number;
  name: string;
  materialsCount?: number;
}

// helper to build image src: support absolute URLs and server-stored filenames
const getImageSrc = (img?: string) => {
  if (!img) return '/fallback.png';
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  const base = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
  const root = base ? base.replace(/\/api\/?$/, '') : 'http://localhost:3000';
  return `${root}/material/${img}`;
};

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'orders' | 'materials' | 'categories'>(
    'materials',
  );
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchMaterials = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', '50');
      if (search) params.append('search', search);

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

  const fetchCategories = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', '50');
      if (search) params.append('search', search);

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

  //! Юзер и заказы не работают, скорее всего на сервере нет метоа, который их выводит, надо проверить

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get('/users?page=1&limit=20');
      if (data?.statusCode === 200 && data.data?.users) setUsers(data.data.users);
    } catch (err) {
      console.warn('fetchUsers error', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get('/orders?page=1&limit=20');
      if (data?.statusCode === 200 && data.data?.orders) setOrders(data.data.orders);
    } catch (err) {
      console.warn('fetchOrders error', err);
    }
  };

  //! Заказы и юзер здесь закончились

  useEffect(() => {
    fetchCategories();
    fetchMaterials();
    fetchUsers();
    fetchOrders();
  }, []);

  /* --- Materials CRUD --- */
  const createMaterial = async (payload: Partial<Material>) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/material', payload);
      if (data?.statusCode === 201 || data?.statusCode === 200) {
        const newItem = data.data?.material ?? data.data;
        setMaterials((s) => [newItem, ...s]);
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

  const updateMaterial = async (id: number, payload: Partial<Material>) => {
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
    setLoading(true);
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
    } finally {
      setLoading(false);
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin panel</h1>
        {/* header actions removed — Tabs below provide navigation */}
      </div>

      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
        <TabsList>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="orders">Заказы</TabsTrigger>
          <TabsTrigger value="materials">Материалы</TabsTrigger>
          <TabsTrigger value="categories">Категории</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-2">
              {users.length === 0 ? (
                <div>No users found</div>
              ) : (
                users.map((u) => (
                  <Card key={u.id}>
                    <CardContent className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{u.email}</div>
                        <div className="text-xs text-muted-foreground">{u.role}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">Edit</Button>
                        <Button size="sm" variant="destructive">
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-2">
              {orders.length === 0 ? (
                <div>No orders found</div>
              ) : (
                orders.map((o) => (
                  <Card key={o.id}>
                    <CardContent className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Заказ #{o.id}</div>
                        <div className="text-xs text-muted-foreground">{o.user?.email || '—'}</div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant={o.status ? 'default' : 'secondary'}>
                          {o.status ? 'Выполнен' : 'Ожидает'}
                        </Badge>
                        <span className="font-bold">{o.total_price} ₽</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="materials">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search materials"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              <Button size="sm" onClick={() => fetchMaterials(1, searchTerm)}>
                Search
              </Button>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Добавить материал</DialogTitle>
                  </DialogHeader>
                  <MaterialForm
                    categories={categories}
                    onSubmit={createMaterial}
                    submitLabel="Создать"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-2">
              {materials.length === 0 ? (
                <div>No materials found</div>
              ) : (
                materials.map((m) => (
                  <Card key={m.id}>
                    <CardContent className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={getImageSrc(m.img)}
                          alt={m.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            // in case fetching through server fails or remote host blocks hotlinking
                            // @ts-ignore
                            e.currentTarget.src = '/fallback.png';
                          }}
                        />
                        <div>
                          <div className="font-medium">{m.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {m.category?.name || '—'}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="font-bold">{m.price} ₽</div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Редактировать материал</DialogTitle>
                              </DialogHeader>
                              <MaterialForm
                                categories={categories}
                                initial={m}
                                onSubmit={(payload) => updateMaterial(m.id, payload)}
                                submitLabel="Сохранить"
                              />
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMaterial(m.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search categories"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              <Button size="sm" onClick={() => fetchCategories(1, searchTerm)}>
                Search
              </Button>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Добавить категорию</DialogTitle>
                  </DialogHeader>
                  <CategoryForm onSubmit={(name) => createCategory(name)} submitLabel="Создать" />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-2">
              {categories.length === 0 ? (
                <div>No categories found</div>
              ) : (
                categories.map((c) => (
                  <Card key={c.id}>
                    <CardContent className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {c.materialsCount ?? 0} materials
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Редактировать категорию</DialogTitle>
                            </DialogHeader>
                            <CategoryForm
                              initial={c.name}
                              onSubmit={(name) => updateCategory(c.id, name)}
                              submitLabel="Сохранить"
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCategory(c.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;

// --- Helper small forms used above ---
interface MaterialFormProps {
  initial?: Partial<Material>;
  categories: Category[];
  onSubmit: (payload: Partial<Material>) => void | Promise<void>;
  submitLabel?: string;
}

const MaterialForm: React.FC<MaterialFormProps> = ({
  initial,
  categories,
  onSubmit,
  submitLabel = 'Save',
}) => {
  const [name, setName] = useState(initial?.name ?? '');
  const [price, setPrice] = useState<number | ''>(initial?.price ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [img, setImg] = useState(initial?.img ?? '');
  const [previewError, setPreviewError] = useState(false);
  const [categoryId, setCategoryId] = useState<number | ''>(initial?.category_id ?? '');

  return (
    <div className="grid gap-3">
      <Input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input
        placeholder="price"
        value={price?.toString() ?? ''}
        onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
      />
      <Input
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        placeholder="image url or server filename"
        value={img}
        onChange={(e) => {
          setImg(e.target.value);
          setPreviewError(false);
        }}
      />
      {img ? (
        <div className="flex items-center gap-2">
          <img
            src={getImageSrc(img)}
            alt="preview"
            className="w-24 h-24 object-cover rounded border"
            onError={(e) => {
              // @ts-ignore
              e.currentTarget.src = '/fallback.png';
              setPreviewError(true);
            }}
          />
          {previewError && (
            <div className="text-xs text-red-500">
              Не удалось показать картинку — проверьте URL или используйте имя файла, загруженное на
              сервер
            </div>
          )}
        </div>
      ) : null}
      <select
        className="rounded border p-2"
        value={categoryId?.toString() ?? ''}
        onChange={(e) => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
      >
        <option value="">Без категории</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <Button
        onClick={() =>
          onSubmit({
            name,
            price: price === '' ? undefined : price,
            description,
            img,
            category_id: categoryId === '' ? undefined : categoryId,
          })
        }
      >
        {submitLabel}
      </Button>
    </div>
  );
};

interface CategoryFormProps {
  initial?: string;
  onSubmit: (name: string) => void | Promise<void>;
  submitLabel?: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initial = '',
  onSubmit,
  submitLabel = 'Save',
}) => {
  const [name, setName] = useState(initial);
  return (
    <div className="grid gap-3">
      <Input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
      <Button onClick={() => onSubmit(name)}>{submitLabel}</Button>
    </div>
  );
};
