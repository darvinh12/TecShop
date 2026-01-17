import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider, useShop } from './components/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthDialog } from './components/AuthDialog';
import { CartSheet } from './components/CartSheet';
import { ProductCard } from './components/ProductCard';
import { FeaturedSlider } from './components/FeaturedSlider';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import AboutUs from './pages/AboutUs';

function Home() {
  const { products, addToCart } = useShop();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <>
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h2 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold">
              Los Mejores Productos Tech
            </h2>
            <p className="mb-8 text-lg md:text-xl text-indigo-100">
              Descubre nuestra colección exclusiva de gadgets y accesorios de última generación
            </p>
            <button className="rounded-lg bg-white px-8 py-3 font-semibold text-indigo-600 hover:bg-gray-100 transition-all transform hover:scale-105">
              Explorar Productos
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto">
          <div className="mb-8 px-4">
            <h2 className="mb-2 text-3xl font-bold">Productos Destacados</h2>
            <p className="text-gray-600">Ofertas especiales de esta semana</p>
          </div>
          <FeaturedSlider products={products} onAddToCart={handleAddToCart} />
        </div>
      </section>

      <section id="productos" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold">Todos los Productos</h2>
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
    </>
  );
}

function MainLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onOpenCart={() => setIsCartOpen(true)} onOpenAuth={() => setIsAuthOpen(true)} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </main>

      <Footer />

      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <Router>
        <MainLayout />
      </Router>
    </ShopProvider>
  );
}
