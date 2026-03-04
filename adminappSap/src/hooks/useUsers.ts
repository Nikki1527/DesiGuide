import { useEffect, useState } from 'react';
import { supabase, Tables } from '../lib/supabase';

export function useUsers() {
  const [users, setUsers] = useState<Tables['users'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, password, age, location, is_admin, created_at, updated_at');
      if (error) {
        setError(error.message);
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    setUsers(users => users.filter(u => u.id !== id));
  };

  return { users, loading, error, deleteUser };
}
