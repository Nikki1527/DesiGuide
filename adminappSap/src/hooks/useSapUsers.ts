import { useEffect, useState } from 'react';

export interface SapUser {
  id: number;
  name: string;
  email: string;
  role: string;
  age?: number;
  address?: string;
  profile_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSapUserRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
  age?: number;
  address?: string;
  profile_url?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export function useSapUsers() {
  const [users, setUsers] = useState<SapUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getHeaders = () => {
    return {
      'Content-Type': 'application/json'
    };
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch users');
      }
    } catch (err: any) {
      console.error('Error fetching SAP users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (userData: CreateSapUserRequest): Promise<SapUser> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const newUser = result.data;
        setUsers((prevUsers: SapUser[]) => [newUser, ...prevUsers]);
        return newUser;
      } else {
        throw new Error(result.message || 'Failed to create user');
      }
    } catch (err: any) {
      console.error('Error creating SAP user:', err);
      throw new Error(err.message || 'Failed to create user');
    }
  };

  const updateUser = async (id: number, userData: Partial<CreateSapUserRequest>): Promise<SapUser> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const updatedUser = result.data;
        setUsers((prevUsers: SapUser[]) => 
          prevUsers.map((user: SapUser) => user.id === id ? updatedUser : user)
        );
        return updatedUser;
      } else {
        throw new Error(result.message || 'Failed to update user');
      }
    } catch (err: any) {
      console.error('Error updating SAP user:', err);
      throw new Error(err.message || 'Failed to update user');
    }
  };

  const deleteUser = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setUsers((prevUsers: SapUser[]) => prevUsers.filter((user: SapUser) => user.id !== id));
      } else {
        throw new Error(result.message || 'Failed to delete user');
      }
    } catch (err: any) {
      console.error('Error deleting SAP user:', err);
      throw new Error(err.message || 'Failed to delete user');
    }
  };

  const refreshUsers = () => {
    fetchUsers();
  };

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers,
  };
}
