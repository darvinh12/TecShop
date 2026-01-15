import { useState } from 'react';
import { ShopProvider, useShop } from './components/ShopContext';
import { Header } from './components/Header';
import { AuthDialog } from './components/AuthDialog';
import { CartSheet } from './components/CartSheet';
import { ProductCard } from './components/ProductCard';
import { FeaturedSlider } from './components/FeaturedSlider';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

function ShopContent() {
  const { products, addToCart } = useShop();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenCart={() => setIsCartOpen(true)} onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h2 className="mb-4 text-4xl md:text-5xl lg:text-6xl">
              Los Mejores Productos Tech
            </h2>
            <p className="mb-8 text-lg md:text-xl text-indigo-100">
              Descubre nuestra colección exclusiva de gadgets y accesorios de última generación
            </p>
            <button className="rounded-lg bg-white px-8 py-3 text-indigo-600 hover:bg-gray-100 transition-colors">
              Explorar Productos
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Slider */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto">
          <div className="mb-8 px-4">
            <h2 className="mb-2 text-3xl">Productos Destacados</h2>
            <p className="text-gray-600">Ofertas especiales de esta semana</p>
          </div>
          <FeaturedSlider products={products} onAddToCart={handleAddToCart} />
        </div>
      </section>

      {/* All Products Section */}
      <section id="productos" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl">Todos los Productos</h2>
            <p className="text-gray-600">Explora nuestra colección completa</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4">TechShop</h3>
              <p className="text-sm text-gray-600">
                Tu tienda de confianza para tecnología de última generación.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm">Compra</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Productos</a></li>
                <li><a href="#" className="hover:text-gray-900">Ofertas</a></li>
                <li><a href="#" className="hover:text-gray-900">Novedades</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm">Ayuda</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Contacto</a></li>
                <li><a href="#" className="hover:text-gray-900">Envíos</a></li>
                <li><a href="#" className="hover:text-gray-900">Devoluciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Privacidad</a></li>
                <li><a href="#" className="hover:text-gray-900">Términos</a></li>
                <li><a href="#" className="hover:text-gray-900">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
            © 2025 TechShop. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <ShopContent />
    </ShopProvider>
  );
}
