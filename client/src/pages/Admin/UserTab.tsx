import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface User {
  id: number;
  email: string;
  role: string;
}

interface UsersTabProps {
  users: User[];
}

export const UsersTab: React.FC<UsersTabProps> = ({ users }) => {
  return (
    <div className="grid gap-4">
      {users.map((u) => (
        <Card key={u.id} className="backdrop-blur-md bg-white/80 hover:bg-white/95 border-white/40 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="font-bold text-xl text-primary mb-1">{u.email}</div>
              <div className="text-sm text-muted-foreground">{u.role}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="h-12 px-6 bg-white/80 hover:bg-white border-white/50 shadow-lg text-primary">
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
  );
};