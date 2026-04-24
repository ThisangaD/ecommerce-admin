import { NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  ShoppingCart,
  Settings,
} from 'lucide-react';

export function Sidebar() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: isAdmin ? '/dashboard' : '/user-dashboard',
      show: true,
    },
    {
      label: 'Users',
      icon: Users,
      path: '/users',
      show: isAdmin,
    },
    {
      label: 'Products',
      icon: Package,
      path: '/products',
      show: true,
    },
    {
      label: 'Categories',
      icon: FolderTree,
      path: '/categories',
      show: true,
    },
    {
      label: 'Orders',
      icon: ShoppingCart,
      path: '/orders',
      show: true,
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      show: isAdmin,
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-indigo-600">eCommerce Admin</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems
          .filter(item => item.show)
          .map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-sm font-medium text-indigo-600">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
