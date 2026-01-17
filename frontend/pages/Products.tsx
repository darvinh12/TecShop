import { useShop } from '../components/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function Products() {
    const { products, addToCart } = useShop();
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddToCart = (product: any) => {
        addToCart(product);
        toast.success(`${product.name} agregado al carrito`);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-16">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-slate-900 md:text-5xl"
                    >
                        Nuestra Colección
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-lg text-slate-600"
                    >
                        Explora la mayor selección de gadgets y tecnología de vanguardia.
                    </motion.p>
                </div>

                {/* Filters & Search */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            className="w-full rounded-full border-slate-200 bg-white py-3 pl-12 pr-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-slate-700 shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
                        <SlidersHorizontal className="h-5 w-5" />
                        Filtrar
                    </button>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <ProductCard
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-slate-500">
                        <p className="text-xl">No encontramos productos que coincidan con tu búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
