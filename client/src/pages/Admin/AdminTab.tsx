import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { signOutThunk } from '@/entities/user/api/UserApi';
import { useAppDispatch } from '@/store/hooks';
import { useNavigate } from 'react-router-dom';

interface AdminTabsProps {
  activeTab: string;
  onChange: (value: string) => void;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({ onChange }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <div className="relative mb-12">
      <TabsList className="bg-white/90 backdrop-blur-md border border-gray-300 rounded-2xl p-2 shadow-xl inline-flex gap-2">
        {[
          { value: 'materials', label: 'Материалы' },
          { value: 'categories', label: 'Категории' },
          { value: 'orders', label: 'Заказы' },
          // { value: 'users', label: 'Пользователи' },
        ].map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            onClick={() => onChange(tab.value)}
            className="text-gray-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white rounded-xl px-8 py-1.5 font-semibold transition-colors hover:bg-primary hover:text-white"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <button
        onClick={() => {
          dispatch(signOutThunk());
          navigate('/', { replace: true });
        }}
        style={{ backgroundColor: '#d0d0d0ff', color: '#000000ff', cursor: 'pointer' }}
        className="absolute right-0 top-1/2 -translate-y-1/2  text-white rounded-xl px-4 py-1.5 font-semibold transition-colors ml-4 shadow-md"
      >
        Выйти
      </button>
    </div>
  );
};
