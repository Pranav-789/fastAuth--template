import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../lib/api';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userAPI.getMe();
        setUser(response.data.data || response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your account today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h2>
          <p className="text-gray-600 text-sm mb-4">Get started with your tasks</p>
          <button
            onClick={() => navigate('/todos')}
            className="text-sm font-medium text-gray-900 hover:text-gray-700"
          >
            View Todos →
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Account Info</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Email:</span>{' '}
              <span className="text-gray-900">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
