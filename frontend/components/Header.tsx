import { ShoppingCart, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useShop } from './ShopContext';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export function Header({ onOpenCart, onOpenAuth }: HeaderProps) {
  const { user, logout, getTotalItems } = useShop();
  const totalItems = getTotalItems();
  const location = useLocation();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/products' },
    { name: 'Sobre Nosotros', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TechShop
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${location.pathname === link.path ? 'text-indigo-600' : 'text-gray-600'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:inline">
                Hola, {user.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-9 w-9"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenAuth}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Ingresar</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            className="relative h-9 w-9"
            onClick={onOpenCart}
          >
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
