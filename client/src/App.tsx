import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAppDispatch } from './store/hooks';
import { refreshTokensThunk } from './entities/user/api/UserApi';
import TestFunc from './components/test';
import RoomsPage from './pages/RoomsPage';
import CalculatePage from './pages/CalculatePage';
import ProfilePage from './pages/Profile/ProfilePage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/Admin/AdminePage2';

const queryClient = new QueryClient();

export default function App(): React.JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshTokensThunk());

    const savedStatus = localStorage.getItem('authStatus');
    const savedUser = localStorage.getItem('userData');

    if (savedStatus === 'logged' && savedUser) {
      dispatch({
        type: 'user/initializeUser',
        payload: {
          status: 'logged',
          user: JSON.parse(savedUser),
        },
      });
    }
  }, [dispatch]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/category" element={<TestFunc />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/calculate" element={<CalculatePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
