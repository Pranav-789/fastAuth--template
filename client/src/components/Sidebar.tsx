import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authAPI } from '../lib/api';

interface SidebarItem {
  label: string;
  path: string;
  icon?: string;
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Todos', path: '/todos' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Navigate anyway if logout fails
      navigate('/login');
    }
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-200 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Logo/Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-gray-200">
          {!isCollapsed && (
            <h1 className="text-xl font-semibold text-gray-900">BlogApp</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {item.icon || '•'}
                    </span>
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-2 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </span>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
