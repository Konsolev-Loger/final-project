import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminTabsProps {
  activeTab: string;
  onChange: (value: string) => void;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({  onChange }) => (
  <TabsList className="bg-white/90 backdrop-blur-md border border-gray-300 rounded-2xl p-2 mb-12 shadow-xl inline-flex">
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
        className="text-gray-900 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white rounded-xl px-8 py-4 font-semibold transition-colors hover:bg-primary hover:text-white"
      >
        {tab.label}
      </TabsTrigger>
    ))}
  </TabsList>
);
