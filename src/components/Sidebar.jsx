import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bus, Users, MapPin, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Package, Warehouse, Truck, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/context/SidebarContext';

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Product Management', icon: Package, href: '/dashboard/products' },
    { label: 'Inventory Management', icon: Warehouse, href: '/dashboard/inventory' },
    // { label: 'Route Management', icon: MapPin, href: '/dashboard/routes' },
    { label: 'Vendor Management', icon: Truck, href: '/dashboard/vendors' },
    { label: 'Daily Sales', icon: ShoppingCart, href: '/dashboard/daily-sales' },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <h1 className="text-xl font-bold" >NaturHolic POS</h1>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md transition-colors text-neutral-500"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--color-neutral-100)')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              title={isCollapsed ? item.label : ''}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} className="shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={logout}
          title={isCollapsed ? 'Logout' : ''}
          className={`nav-link w-full`}
        >
          <LogOut size={18} className="shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
