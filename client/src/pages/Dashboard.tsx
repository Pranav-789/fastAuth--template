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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your account today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quick Actions</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Get started with your writings</p>
          <div className="flex flex-col gap-3 items-start">
            <button
              onClick={() => navigate('/create-blog')}
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              + Create New Blog
            </button>
            <button
              onClick={() => navigate('/blogs')}
              className="text-sm font-medium text-gray-900 dark:text-blue-400 hover:text-gray-700 dark:hover:text-blue-300 transition-colors mt-1"
            >
              Browse Blogs →
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Account Info</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Email:</span>{' '}
              <span className="text-gray-900 dark:text-white">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
