import { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (isRegister && !formData.name.trim()) {
      setError('El nombre es requerido.');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El correo electrónico es requerido.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return false;
    }
    if (!formData.password) {
      setError('La contraseña es requerida.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const endpoint = isRegister ? 'register' : 'login';
    const payload = isRegister 
      ? formData 
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Algo salió mal. Por favor, intenta de nuevo.');
      }

      setSuccess(isRegister ? '¡Registro exitoso! Iniciando sesión...' : '¡Inicio de sesión exitoso!');
      
      // Simular pequeña pausa para mostrar el mensaje de éxito antes de pasar al Dashboard
      setTimeout(() => {
        onLoginSuccess(data.token, data.user);
      }, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070d0a] p-4 md:p-6 font-sans">
      <div className="w-full max-w-6xl bg-[#0f1914]/90 border border-emerald-950/60 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
        
        {/* Panel Izquierdo: Formulario */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center space-x-2.5 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-900/30">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-amber-300">
                Despensa Premium
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              {isRegister ? 'Crea tu Cuenta' : 'Bienvenido de Nuevo'}
            </h2>
            <p className="text-sm text-emerald-500/70">
              {isRegister 
                ? 'Regístrate para gestionar productos y pedidos de tu alacena.' 
                : 'Accede para ver tu inventario de despensa y productos frescos.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mensajes de Alerta */}
            {error && (
              <div className="flex items-center space-x-2 p-3.5 bg-rose-950/40 border border-rose-900/50 rounded-xl text-rose-300 text-xs animate-shake">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center space-x-2 p-3.5 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-emerald-300 text-xs">
                <svg className="w-4 h-4 shrink-0 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            {/* Campo Nombre (solo Registro) */}
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider block">
                  Nombre Completo
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-700">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#0c1310] border border-emerald-950/60 text-white rounded-xl py-3 pl-11 pr-4 text-sm placeholder-emerald-800 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
              </div>
            )}

            {/* Campo Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider block">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-700">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0c1310] border border-emerald-950/60 text-white rounded-xl py-3 pl-11 pr-4 text-sm placeholder-emerald-800 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  placeholder="nombre@ejemplo.com"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider block">
                  Contraseña
                </label>
                {!isRegister && (
                  <a href="#" className="text-xs text-amber-500 hover:text-amber-400 transition-colors">
                    ¿La olvidaste?
                  </a>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-emerald-700">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#0c1310] border border-emerald-950/60 text-white rounded-xl py-3 pl-11 pr-4 text-sm placeholder-emerald-800 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Botón de Enviar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 text-sm font-bold shadow-lg shadow-emerald-900/30 transition-all hover:shadow-emerald-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center space-x-2 mt-4"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Procesando...</span>
                </>
              ) : (
                <span>{isRegister ? 'Registrarse e Ingresar' : 'Iniciar Sesión'}</span>
              )}
            </button>
          </form>

          {/* Toggle de Modo */}
          <div className="mt-8 text-center text-sm text-emerald-700">
            <span>
              {isRegister ? '¿Ya tienes una cuenta?' : '¿Nuevo en Despensa Premium?'}
            </span>{' '}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setSuccess('');
              }}
              className="font-bold text-amber-500 hover:text-amber-400 transition-colors ml-1 cursor-pointer bg-transparent border-none"
            >
              {isRegister ? 'Inicia Sesión aquí' : 'Crea una cuenta'}
            </button>
          </div>
        </div>

        {/* Panel Derecho: Imagen e Info */}
        <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-0 bg-cover bg-center flex flex-col justify-end p-8 md:p-14" style={{ backgroundImage: "url('/pantry_bg.png')" }}>
          {/* Overlay Oscuro para Legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050a07] via-[#050a07]/50 to-transparent md:bg-gradient-to-r md:from-[#0f1914] md:to-transparent" />
          
          {/* Tarjeta de Información Glassmorphic */}
          <div className="relative bg-[#0f1914]/40 border border-white/5 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl max-w-md">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-3 inline-block">
              Calidad y Tradición
            </span>
            <h3 className="text-2xl font-bold text-white mb-2">
              Ingredientes con Alma
            </h3>
            <p className="text-xs md:text-sm text-emerald-100/70 leading-relaxed">
              Descubre aceites de oliva de primera prensa, mieles vírgenes y cafés seleccionados. Administra el stock de tu despensa gourmet y garantiza siempre frescura en tu cocina.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
