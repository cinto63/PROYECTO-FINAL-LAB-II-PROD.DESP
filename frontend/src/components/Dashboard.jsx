import { useState, useEffect, useCallback } from 'react';

function Dashboard({ user, token, onLogout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Formulario de nuevo producto
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Aceites y Aderezos',
    price: '',
    stock: '',
    description: '',
    image_url: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const categories = [
    'Todos',
    'Aceites y Aderezos',
    'Endulzantes',
    'Bebidas e Infusiones',
    'Granos y Pastas',
    'Dulces y Conservas'
  ];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL('http://localhost:5000/api/products');
      if (searchTerm) url.searchParams.append('q', searchTerm);
      if (selectedCategory && selectedCategory !== 'Todos') {
        url.searchParams.append('category', selectedCategory);
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar los productos de la despensa.');
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    // Debounce búsqueda para no saturar la BD
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [fetchProducts]);

  const handleFormChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    setFormError('');
    setFormSuccess('');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { name, category, price, stock } = newProduct;

    if (!name.trim() || !category || price === '' || stock === '') {
      setFormError('Nombre, categoría, precio y stock son campos obligatorios.');
      return;
    }

    if (parseFloat(price) < 0 || parseInt(stock, 10) < 0) {
      setFormError('El precio y el stock deben ser mayores o iguales a 0.');
      return;
    }

    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo guardar el producto.');
      }

      setFormSuccess('¡Producto añadido exitosamente!');
      setNewProduct({
        name: '',
        category: 'Aceites y Aderezos',
        price: '',
        stock: '',
        description: '',
        image_url: ''
      });
      
      // Volver a cargar la lista
      fetchProducts();

    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070d0a] text-slate-100 font-sans flex flex-col">
      {/* Navbar Premium */}
      <header className="w-full bg-[#0f1914]/80 border-b border-emerald-950/60 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">Alacena Real</h1>
              <span className="text-[10px] text-emerald-500/70 tracking-widest uppercase font-semibold">Despensa Gourmet</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-200">{user.name}</span>
              <span className="text-xs text-emerald-500/60">{user.email}</span>
            </div>
            <div className="h-10 w-px bg-emerald-950/60 hidden sm:block"></div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-[#0c1310] border border-emerald-900/50 hover:bg-rose-950/20 hover:border-rose-900/50 rounded-xl text-xs font-semibold text-slate-300 hover:text-rose-400 transition-all cursor-pointer active:scale-95 flex items-center space-x-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Panel Izquierdo: Añadir Producto */}
        <section className="lg:col-span-1 bg-[#0f1914]/90 border border-emerald-950/60 p-6 rounded-3xl h-fit shadow-xl backdrop-blur-md">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-7 w-7 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-md font-bold text-white">Nuevo Producto</h2>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-4">
            {formError && (
              <div className="p-3 bg-rose-950/40 border border-rose-900/50 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{formError}</span>
              </div>
            )}
            {formSuccess && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-300 text-xs flex items-center space-x-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{formSuccess}</span>
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-emerald-400 uppercase block tracking-wider">Nombre</label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleFormChange}
                placeholder="Ej. Aceite de Oliva"
                className="w-full bg-[#0c1310] border border-emerald-950 text-white rounded-xl py-2 px-3 text-xs placeholder-emerald-900 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Categoría */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-emerald-400 uppercase block tracking-wider">Categoría</label>
              <select
                name="category"
                value={newProduct.category}
                onChange={handleFormChange}
                className="w-full bg-[#0c1310] border border-emerald-950 text-white rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500 transition-all"
              >
                {categories.filter(c => c !== 'Todos').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-400 uppercase block tracking-wider">Precio ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={newProduct.price}
                  onChange={handleFormChange}
                  placeholder="Ej. 12.50"
                  className="w-full bg-[#0c1310] border border-emerald-950 text-white rounded-xl py-2 px-3 text-xs placeholder-emerald-900 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-emerald-400 uppercase block tracking-wider">Stock (u)</label>
                <input
                  type="number"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleFormChange}
                  placeholder="Ej. 50"
                  className="w-full bg-[#0c1310] border border-emerald-950 text-white rounded-xl py-2 px-3 text-xs placeholder-emerald-900 focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-emerald-400 uppercase block tracking-wider">Descripción</label>
              <textarea
                name="description"
                rows={2}
                value={newProduct.description}
                onChange={handleFormChange}
                placeholder="Detalle del producto..."
                className="w-full bg-[#0c1310] border border-emerald-950 text-white rounded-xl py-2 px-3 text-xs placeholder-emerald-900 focus:outline-none focus:border-emerald-500 transition-all resize-none"
              />
            </div>

            {/* URL Imagen */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-emerald-400 uppercase block tracking-wider">URL Imagen (Opcional)</label>
              <input
                type="text"
                name="image_url"
                value={newProduct.image_url}
                onChange={handleFormChange}
                placeholder="https://..."
                className="w-full bg-[#0c1310] border border-emerald-950 text-white rounded-xl py-2 px-3 text-xs placeholder-emerald-900 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 text-xs font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-950/40"
            >
              {formLoading ? (
                <span>Añadiendo...</span>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Añadir a Alacena</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Panel Derecho: Buscador, Filtros y Lista de Productos */}
        <section className="lg:col-span-3 flex flex-col space-y-6">
          
          {/* Fila superior: Buscador */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0f1914]/50 border border-emerald-950/40 p-4 rounded-2xl">
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-emerald-800">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Buscar productos por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0c1310] border border-emerald-950/60 text-white rounded-xl py-2 pl-9 pr-4 text-xs placeholder-emerald-900 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
            <span className="text-xs text-emerald-600 font-medium">
              {products.length} {products.length === 1 ? 'producto listado' : 'productos listados'}
            </span>
          </div>

          {/* Fila media: Filtros de Categoría */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-900/30'
                    : 'bg-[#0f1914] text-emerald-400 border border-emerald-950/60 hover:bg-emerald-950/20 hover:text-emerald-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Malla de Productos */}
          {loading ? (
            <div className="flex-1 flex flex-col justify-center items-center py-20 space-y-4">
              <svg className="animate-spin h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-emerald-500/70 text-xs">Cargando inventario de despensa...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 bg-rose-950/20 border border-rose-900/30 rounded-2xl p-6">
              <p className="text-rose-400 text-sm font-semibold mb-2">Error al sincronizar inventario</p>
              <p className="text-slate-400 text-xs">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-[#0f1914]/20 border border-emerald-950/30 rounded-2xl p-8 flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-emerald-900 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-emerald-600 text-sm font-bold">No se encontraron productos</p>
              <p className="text-emerald-800 text-xs mt-1">Prueba a buscar con otro término o añade un producto nuevo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((prod) => {
                const isOutOfStock = prod.stock === 0;
                const isLowStock = prod.stock > 0 && prod.stock < 10;

                return (
                  <div
                    key={prod.id}
                    className="bg-[#0f1914]/60 border border-emerald-950/60 rounded-2xl overflow-hidden hover:border-emerald-700/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 flex flex-col"
                  >
                    {/* Imagen de Producto */}
                    <div className="h-44 w-full relative overflow-hidden bg-[#070d0a] shrink-0">
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span className="absolute top-3 left-3 bg-[#070d0a]/75 backdrop-blur-md border border-emerald-900/40 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        {prod.category}
                      </span>
                    </div>

                    {/* Detalles */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <h3 className="text-sm font-bold text-white line-clamp-1">{prod.name}</h3>
                        <p className="text-[11px] text-emerald-600/70 leading-relaxed line-clamp-2 h-8">
                          {prod.description || 'Sin descripción disponible.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-emerald-950/60 pt-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">Precio</span>
                          <span className="text-base font-extrabold text-amber-500">${parseFloat(prod.price).toFixed(2)}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider block mb-1">Disponibilidad</span>
                          {isOutOfStock ? (
                            <span className="px-2 py-0.5 bg-rose-950/50 border border-rose-900/40 text-rose-400 rounded-lg text-[10px] font-bold">
                              Sin Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="px-2 py-0.5 bg-amber-950/50 border border-amber-900/40 text-amber-400 rounded-lg text-[10px] font-bold">
                              Bajo ({prod.stock} u)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-950/50 border border-emerald-900/40 text-emerald-400 rounded-lg text-[10px] font-bold">
                              Disponible ({prod.stock} u)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#0b100d] border-t border-emerald-950/60 py-6 text-center text-xs text-emerald-800 shrink-0">
        <p>© 2026 Alacena Real. Panel del Administrador de Despensa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
