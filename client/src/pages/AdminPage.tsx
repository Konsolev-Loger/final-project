// src/pages/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Search, 
  Edit3,
  Trash2,
  Plus,
  Loader2,
  Home,
  Layers,
  Tag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  ordersCount: number;
}

interface Order {
  id: number;
  user_id: number;
  status: boolean;
  total_price: number;
  comment?: string;
  createdAt: string;
  user?: {
    id: number;
    email: string;
    name?: string;
    phone?: string;
  };
  itemsCount: number;
  castomRoomsCount: number;
}

interface Material {
  id: number;
  name: string;
  price: number;
  description: string;
  title?: string;
  img: string;
  is_popular: boolean;
  category_id: number;
  category?: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  materialsCount: number;
}

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalMaterials: number;
  totalCategories: number;
  recentOrders?: Array<{
    id: number;
    status: boolean;
    total_price: number;
    createdAt: string;
    user_email?: string;
  }>;
  popularMaterials?: Array<{
    material_id: number;
    material_name: string;
    total_quantity: number;
  }>;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  error?: string;
}

interface PaginatedResponse<T> {
  users?: T[];
  orders?: T[];
  materials?: T[];
  categories?: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  // Получение токена
  const getAuthToken = (): string | null => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // === DASHBOARD ===
  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast({ 
          title: 'Ошибка', 
          description: 'Требуется авторизация',
          variant: 'destructive'
        });
        return;
      }

      const response = await fetch('/api/admin/dashboard', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse<DashboardStats> = await response.json();
      
      if (data.statusCode === 200) {
        setStats(data.data);
      } else {
        throw new Error(data.message || 'Ошибка загрузки статистики');
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast({ 
        title: 'Ошибка', 
        description: error instanceof Error ? error.message : 'Не удалось загрузить статистику',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // === USERS ===
  const fetchUsers = async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast({ 
          title: 'Ошибка', 
          description: 'Требуется авторизация',
          variant: 'destructive'
        });
        return;
      }

      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '20');
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse<PaginatedResponse<User>> = await response.json();
      
      if (data.statusCode === 200 && data.data.users) {
        setUsers(data.data.users);
        setTotalPages(data.data.totalPages || 1);
        setCurrentPage(data.data.page || 1);
      } else {
        throw new Error(data.message || 'Ошибка загрузки пользователей');
      }
    } catch (error) {
      console.error('Users fetch error:', error);
      toast({ 
        title: 'Ошибка', 
        description: error instanceof Error ? error.message : 'Не удалось загрузить пользователей',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (id: number, role: 'user' | 'admin') => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast({ 
          title: 'Ошибка', 
          description: 'Требуется авторизация',
          variant: 'destructive'
        });
        return;
      }

      const response = await fetch(`/api/admin/users/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });
      
      const data: ApiResponse<User> = await response.json();
      
      if (response.ok && data.statusCode === 200) {
        setUsers(users.map(user => 
          user.id === id ? { ...user, role } : user
        ));
        toast({ 
          title: 'Успех', 
          description: 'Роль пользователя обновлена',
          variant: 'default'
        });
      } else {
        throw new Error(data.message || 'Ошибка обновления роли');
      }
    } catch (error) {
      console.error('Update role error:', error);
      toast({ 
        title: 'Ошибка', 
        description: error instanceof Error ? error.message : 'Не удалось обновить роль пользователя',
        variant: 'destructive'
      });
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить пользователя?')) return;
    
    try {
      const token = getAuthToken();
      if (!token) {
        toast({ 
          title: 'Ошибка', 
          description: 'Требуется авторизация',
          variant: 'destructive'
        });
        return;
      }

      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      const data: ApiResponse<{ message: string }> = await response.json();
      
      if (response.ok && data.statusCode === 200) {
        setUsers(users.filter(user => user.id !== id));
        toast({ 
          title: 'Успех', 
          description: 'Пользователь успешно удалён',
          variant: 'default'
        });
      } else {
        throw new Error(data.message || 'Ошибка удаления');
      }
    } catch (error) {
      console.error('Delete user error:', error);
      toast({ 
        title: 'Ошибка', 
        description: error instanceof Error ? error.message : 'Не удалось удалить пользователя',
        variant: 'destructive'
      });
    }
  };

  // === ORDERS ===
  const fetchOrders = async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast({ 
          title: 'Ошибка', 
          description: 'Требуется авторизация',
          variant: 'destructive'
        });
        return;
      }

      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '20');
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/orders?${params}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse<PaginatedResponse<Order>> = await response.json();
      
      if (data.statusCode === 200 && data.data.orders) {
        setOrders(data.data.orders);
        setTotalPages(data.data.totalPages || 1);
        setCurrentPage(data.data.page || 1);
      } else {
        throw new Error(data.message || 'Ошибка загрузки заказов');
      }
    } catch (error) {
      console.error('Orders fetch error:', error);
      toast({ 
        title: 'Ошибка', 
        description: error instanceof Error ? error.message : 'Не удалось загрузить заказы',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: number, status: boolean) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast({ 
          title: 'Ошибка', 
          description: 'Требуется авторизация',
          variant: 'destructive'
        });
        return;
      }

      const response = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      
      const data: ApiResponse<Order> = await response.json();
      
      if (response.ok && data.statusCode === 200) {
        setOrders(orders.map(order => 
          order.id === id ? { ...order, status } : order
        ));
        toast({ 
          title: 'Успех', 
          description: 'Статус заказа обновлён',
          variant: 'default'
        });
      } else {
        throw new Error(data.message || 'Ошибка обновления статуса');
      }
    } catch (error) {
      console.error('Update order status error:', error);
      toast({ 
        title: 'Ошибка', 
        description: error instanceof Error ? error.message : 'Не удалось обновить статус',
        variant: 'destructive'
      });
    }
  };

  const deleteOrder = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить заказ?')) return;
    
    try {
      const token = getAuthToken();
      if (!token) {
        toast({ 
          title: 'Ошибка', 
          description: 'Требуется авторизация',
          variant: 'destructive'
        });
        return;
      }

      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      const data: ApiResponse<{ message: string }> = await response.json();
      
      if (response.ok && data.statusCode === 200) {
        setOrders(orders.filter(order => order.id !== id));
        toast({ 
          title: 'Успех', 
          description: 'Заказ успешно удалён',
          variant: 'default'
        });
      } else {
        throw new Error(data.message || 'Ошибка удаления');
      }
    } catch (error) {
      console.error('Delete order error:', error);
      toast({ 
        title: 'Ошибка', 
        description: error instanceof Error ? error.message : 'Не удалось удалить заказ',
        variant: 'destructive'
      });
    }
  };

  // === MATERIALS ===
  const fetchMaterials = async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast({ 
          title: 'Ошибка', 
          description: 'Требуется авторизация',
          variant: 'destructive'
        });
        return;
      }

      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '20');
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/materials?${params}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse<PaginatedResponse<Material>> = await response.json();
      
      if (data.statusCode === 200 && data.data.materials) {
        setMaterials(data.data.materials);
        setTotalPages(data.data.totalPages || 1);
        setCurrentPage(data.data.page || 1);
      } else {
        throw new Error(data.message || 'Ошибка загрузки материалов');
      }
    } catch (error) {
      console.error('Materials fetch error:', error);
      toast({ 
        title: 'Ошибка', 
        description: error instanceof Error ? error.message : 'Не удалось загрузить материалы',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // === CATEGORIES ===
  const fetchCategories = async (page: number = 1, search: string = '') => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast({ 
          title: 'Ошибка', 
          description: 'Требуется авторизация',
          variant: 'destructive'
        });
        return;
      }

      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '20');
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/categories?${params}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse<PaginatedResponse<Category>> = await response.json();
      
      if (data.statusCode === 200 && data.data.categories) {
        setCategories(data.data.categories);
        setTotalPages(data.data.totalPages || 1);
        setCurrentPage(data.data.page || 1);
      } else {
        throw new Error(data.message || 'Ошибка загрузки категорий');
      }
    } catch (error) {
      console.error('Categories fetch error:', error);
      toast({ 
        title: 'Ошибка', 
        description: error instanceof Error ? error.message : 'Не удалось загрузить категории',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Обработчик смены вкладки
  useEffect(() => {
    setCurrentPage(1);
    setSearchTerm('');
    
    switch (activeTab) {
      case 'dashboard':
        fetchDashboard();
        break;
      case 'users':
        fetchUsers();
        break;
      case 'orders':
        fetchOrders();
        break;
      case 'materials':
        fetchMaterials();
        break;
      case 'categories':
        fetchCategories();
        break;
    }
  }, [activeTab]);

  // Обработчик поиска с debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length === 0 || searchTerm.length > 2) {
        switch (activeTab) {
          case 'users':
            fetchUsers(1, searchTerm);
            break;
          case 'orders':
            fetchOrders(1, searchTerm);
            break;
          case 'materials':
            fetchMaterials(1, searchTerm);
            break;
          case 'categories':
            fetchCategories(1, searchTerm);
            break;
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, activeTab]);

  // Пагинация
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    setCurrentPage(newPage);
    
    switch (activeTab) {
      case 'users':
        fetchUsers(newPage, searchTerm);
        break;
      case 'orders':
        fetchOrders(newPage, searchTerm);
        break;
      case 'materials':
        fetchMaterials(newPage, searchTerm);
        break;
      case 'categories':
        fetchCategories(newPage, searchTerm);
        break;
    }
  };

  // Фильтрация данных (клиентская)
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchTerm) ||
    order.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.total_price.toString().includes(searchTerm)
  );

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Админ-панель</h1>
        <div className="w-64">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Пользователи
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Заказы
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Материалы
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Категории
          </TabsTrigger>
        </TabsList>

        {/* DASHBOARD */}
        <TabsContent value="dashboard" className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                    <p className="text-xs text-muted-foreground">Всего пользователей</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Заказы</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                    <p className="text-xs text-muted-foreground">Всего заказов</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Выручка</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalRevenue || 0} ₽</div>
                    <p className="text-xs text-muted-foreground">Общая выручка</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ожидающие</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.pendingOrders || 0}</div>
                    <p className="text-xs text-muted-foreground">Ожидающих заказов</p>
                  </CardContent>
                </Card>
              </div>

              {/* Дополнительные карточки */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Материалы</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalMaterials || 0}</div>
                    <p className="text-xs text-muted-foreground">Всего материалов</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Категории</CardTitle>
                    <Layers className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalCategories || 0}</div>
                    <p className="text-xs text-muted-foreground">Всего категорий</p>
                  </CardContent>
                </Card>
              </div>

              {/* Последние заказы */}
              {stats?.recentOrders && stats.recentOrders.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Последние заказы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {stats.recentOrders.map((order) => (
                        <div key={order.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">Заказ #{order.id}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {order.user_email || 'Без пользователя'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={order.status ? "default" : "secondary"}>
                              {order.status ? 'Выполнен' : 'Ожидает'}
                            </Badge>
                            <span className="font-bold">{order.total_price} ₽</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* USERS */}
        <TabsContent value="users">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">Пользователи не найдены</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredUsers.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">{user.email}</h3>
                            <div className="flex items-center gap-3">
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role === 'admin' ? 'Админ' : 'Пользователь'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Зарегистрирован: {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="text-sm">
                              Заказов: <strong>{user.ordersCount}</strong>
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                            >
                              {user.role === 'admin' ? 'Сделать пользователем' : 'Сделать админом'}
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Удалить
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              
              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm">
                    Страница {currentPage} из {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* ORDERS */}
        <TabsContent value="orders">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">Заказы не найдены</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredOrders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-lg">Заказ #{order.id}</h3>
                            <div className="flex items-center gap-3">
                              <Badge variant={order.status ? "default" : "secondary"}>
                                {order.status ? 'Выполнен' : 'Ожидает'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              {order.user && (
                                <span className="text-sm">
                                  Пользователь: <strong>{order.user.email}</strong>
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Элементов: {order.itemsCount} | Комнат: {order.castomRoomsCount}
                            </div>
                            {order.comment && (
                              <p className="text-sm italic">{order.comment}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-2xl text-green-600">
                              {order.total_price} ₽
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant={order.status ? "outline" : "default"}
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, !order.status)}
                          >
                            {order.status ? 'Отменить выполнение' : 'Отметить как выполненный'}
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteOrder(order.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Удалить
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              
              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm">
                    Страница {currentPage} из {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* MATERIALS */}
        <TabsContent value="materials">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Материалы</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить материал
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Добавить новый материал</DialogTitle>
                    </DialogHeader>
                    {/* Форма добавления материала будет здесь */}
                  </DialogContent>
                </Dialog>
              </div>
              
              {filteredMaterials.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Материалы не найдены</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMaterials.map((material) => (
                    <Card key={material.id}>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{material.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {material.title || material.description?.substring(0, 100)}
                                {material.description && material.description.length > 100 ? '...' : ''}
                              </p>
                            </div>
                            {material.is_popular && (
                              <Badge variant="default">Популярный</Badge>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-bold text-lg">{material.price} ₽/м²</div>
                              {material.category && (
                                <Badge variant="outline" className="mt-1">
                                  {material.category.name}
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm">
                    Страница {currentPage} из {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* CATEGORIES */}
        <TabsContent value="categories">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Категории</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить категорию
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Добавить новую категорию</DialogTitle>
                    </DialogHeader>
                    {/* Форма добавления категории будет здесь */}
                  </DialogContent>
                </Dialog>
              </div>
              
              {filteredCategories.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Категории не найдены</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCategories.map((category) => (
                    <Card key={category.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                              Материалов: <strong>{category.materialsCount}</strong>
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm">
                    Страница {currentPage} из {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;