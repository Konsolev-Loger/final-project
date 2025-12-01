import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import heroImage from '@/assets/hero-finishing.jpg';
import { useNavigate } from 'react-router-dom';

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
  const { toast } = useToast();

  // fetchMaterials без параметра поиска
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

  const navigate = useNavigate();

  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10">
      {/* Hero-style фон */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/75 to-primary/90" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background/95 via-background/90 to-transparent" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-20 w-full max-w-7xl">
        {/* Заголовок в стиле Hero */}
        <div className="flex items-center justify-between mb-12 text-white animate-fade-in">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent drop-shadow-2xl mb-4">
              Админ-панель
            </h1>
            <p className="text-xl text-white/90 font-light max-w-md">
              Управляйте материалами, заказами и пользователями
            </p>
            <button
              onClick={() => navigate('/')}
              className="fixed top-4 right-4 z-50 px-6 py-3 bg-white/80 backdrop-blur-md border border-primary rounded-2xl text-primary font-semibold shadow-lg hover:bg-primary/90 hover:text-white transition-all duration-300"
            >
              ← На главную
            </button>
          </div>
          {loading && (
            <div className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
              <span className="text-white font-medium">Загрузка...</span>
            </div>
          )}
        </div>

        {/* Основной контейнер с blur-эффектом */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 shadow-primary/10 hover:shadow-3xl transition-all duration-500">
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
            {/* TabsList в стиле Hero */}
            <TabsList className="bg-white/90 backdrop-blur-md border border-gray-300 rounded-2xl p-2 mb-12 shadow-xl">
              <TabsTrigger
                value="materials"
                className="text-gray-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white rounded-xl px-8 py-4 font-semibold transition-colors hover:bg-primary hover:text-white"
              >
                Материалы
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="text-gray-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white rounded-xl px-8 py-4 font-semibold transition-colors hover:bg-primary hover:text-white"
              >
                Категории
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="text-gray-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white rounded-xl px-8 py-4 font-semibold transition-colors hover:bg-primary hover:text-white"
              >
                Заказы
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="text-gray-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white rounded-xl px-8 py-4 font-semibold transition-colors hover:bg-primary hover:text-white"
              >
                Пользователи
              </TabsTrigger>
            </TabsList>

            {/* Materials Tab */}
            <TabsContent value="materials" className="mt-0">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/30">
                <h2 className="text-2xl font-bold text-primary">Материалы ({materials.length})</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-xl hover:shadow-2xl h-14 px-8 rounded-2xl font-semibold text-lg border-0 transition-all duration-300 hover:scale-105"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Добавить материал
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/95 backdrop-blur-xl rounded-3xl p-0 max-w-2xl mx-auto border-white/50">
                    <DialogHeader className="p-8 pb-6 border-b border-white/30">
                      <DialogTitle className="text-3xl font-bold text-primary">
                        Новый материал
                      </DialogTitle>
                    </DialogHeader>
                    <div className="p-8">
                      <MaterialForm
                        categories={categories}
                        onSubmit={createMaterial}
                        submitLabel="Создать материал"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.length === 0 ? (
                  <div className="col-span-full text-center py-20 text-gray-500">
                    Нет материалов
                  </div>
                ) : (
                  materials.map((m, index) => (
                    <Card
                      key={m.id}
                      className="group backdrop-blur-md bg-white/80 hover:bg-white/95 border-white/40 shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 border hover:border-primary/60 overflow-hidden animate-fade-in hover:animate-pulse"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <img
                              src={getImageSrc(m.img)}
                              alt={m.name}
                              className="w-20 h-20 object-cover rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
                              onError={(e) => {
                                // @ts-ignore
                                e.currentTarget.src = '/fallback.png';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-xl text-primary group-hover:text-primary/90 truncate mb-1">
                                {m.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-1">
                                {m.category?.name || 'Без категории'}
                              </p>
                              {m.description && (
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {m.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-white/30">
                            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                              {m.price} ₽
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    className="h-12 px-4 bg-white/80 hover:bg-white border-white/50 shadow-lg hover:shadow-xl text-primary hover:scale-105 transition-all duration-200"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white/95 backdrop-blur-xl rounded-3xl p-0 max-w-2xl mx-auto border-white/50">
                                  <DialogHeader className="p-8 pb-6 border-b border-white/30">
                                    <DialogTitle className="text-3xl font-bold text-primary">
                                      Редактировать материал
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="p-8">
                                    <MaterialForm
                                      categories={categories}
                                      initial={m}
                                      onSubmit={(payload) => updateMaterial(m.id, payload)}
                                      submitLabel="Сохранить изменения"
                                    />
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-12 px-4 bg-gradient-to-r from-destructive to-destructive/90 hover:from-destructive/90 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                                onClick={() => deleteMaterial(m.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Categories Tab - аналогично, но короче */}
            <TabsContent value="categories" className="mt-0">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/30">
                <h2 className="text-2xl font-bold text-primary">Категории ({categories.length})</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-xl hover:shadow-2xl h-14 px-8 rounded-2xl font-semibold text-lg border-0 transition-all duration-300 hover:scale-105"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Добавить категорию
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white/95 backdrop-blur-xl rounded-3xl p-0 max-w-md mx-auto border-white/50">
                    <DialogHeader className="p-8 pb-6 border-b border-white/30">
                      <DialogTitle className="text-3xl font-bold text-primary">
                        Новая категория
                      </DialogTitle>
                    </DialogHeader>
                    <div className="p-8">
                      <CategoryForm
                        onSubmit={(name) => createCategory(name)}
                        submitLabel="Создать категорию"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {categories.map((c) => (
                  <Card
                    key={c.id}
                    className="backdrop-blur-md bg-white/80 hover:bg-white/95 border-white/40 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border hover:border-primary/50"
                  >
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-xl text-primary mb-1">{c.name}</h3>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="h-12 px-4 bg-white/80 hover:bg-white border-white/50 shadow-lg hover:shadow-xl text-primary hover:scale-105 transition-all duration-200"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white/95 backdrop-blur-xl rounded-3xl p-0 max-w-md mx-auto border-white/50">
                            <DialogHeader className="p-8 pb-6 border-b border-white/30">
                              <DialogTitle className="text-3xl font-bold text-primary">
                                Редактировать категорию
                              </DialogTitle>
                            </DialogHeader>
                            <div className="p-8">
                              <CategoryForm
                                initial={c.name}
                                onSubmit={(name) => updateCategory(c.id, name)}
                                submitLabel="Сохранить изменения"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-12 px-4 bg-gradient-to-r from-destructive to-destructive/90 hover:from-destructive/90 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                          onClick={() => deleteCategory(c.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Orders и Users - упрощенные версии */}
            <TabsContent value="orders" className="mt-0">
              <div className="grid gap-4">
                {orders.map((o) => (
                  <Card
                    key={o.id}
                    className="backdrop-blur-md bg-white/80 hover:bg-white/95 border-white/40 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xl text-primary mb-1">Заказ #{o.id}</div>
                        <div className="text-sm text-muted-foreground">{o.user?.email || '—'}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className="px-4 py-2 font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg">
                          {o.status ? 'Выполнен' : 'Ожидает'}
                        </Badge>
                        <span className="text-2xl font-bold text-primary">{o.total_price} ₽</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <div className="grid gap-4">
                {users.map((u) => (
                  <Card
                    key={u.id}
                    className="backdrop-blur-md bg-white/80 hover:bg-white/95 border-white/40 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <CardContent className="p-6 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xl text-primary mb-1">{u.email}</div>
                        <div className="text-sm text-muted-foreground">{u.role}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="h-12 px-6 bg-white/80 hover:bg-white border-white/50 shadow-lg text-primary"
                        >
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" className="h-12 px-6">
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
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


// мы не знаем что это такое...