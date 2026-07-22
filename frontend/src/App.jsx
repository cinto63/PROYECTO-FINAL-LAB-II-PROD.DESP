import { useState, useEffect } from 'react';

function App() {
  const [backendStatus, setBackendStatus] = useState({
    loading: true,
    connected: false,
    dbConnected: false,
    message: '',
    dbTime: '',
    error: ''
  });

  const checkHealth = async () => {
    setBackendStatus(prev => ({ ...prev, loading: true, error: '' }));
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        const data = await response.json();
        setBackendStatus({
          loading: false,
          connected: true,
          dbConnected: data.status === 'OK',
          message: data.message,
          dbTime: data.dbTime || '',
          error: ''
        });
      } else {
        const data = await response.json().catch(() => ({}));
        setBackendStatus({
          loading: false,
          connected: true,
          dbConnected: false,
          message: data.message || 'Error en la API',
          dbTime: '',
          error: `HTTP error! status: ${response.status}`
        });
      }
    } catch (err) {
      setBackendStatus({
        loading: false,
        connected: false,
        dbConnected: false,
        message: 'No se pudo conectar al servidor de desarrollo (puerto 5000).',
        dbTime: '',
        error: err.message
      });
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-6 selection:bg-purple-500 selection:text-white font-sans">
      {/* Header */}
      <header className="w-full max-w-5xl flex items-center justify-between py-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-xl font-bold text-white">SF</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Sistema Formal</h1>
            <p className="text-xs text-slate-500">Panel de Control & Desarrollo</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs text-slate-400 font-medium">Entorno Local Listo</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl flex-1 flex flex-col justify-center my-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-white">
            Tu Entorno de Desarrollo está Preparado
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Hemos configurado e instalado React + Tailwind CSS v4 para el Frontend, y Express + PostgreSQL para el Backend. ¡Ya puedes empezar a codificar el Sistema Formal!
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Card: Status Conexión */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300 shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-200">Servicios Activos</h3>
                <button 
                  onClick={checkHealth}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-95 cursor-pointer font-medium"
                >
                  Recomprobar
                </button>
              </div>

              <div className="space-y-4">
                {/* Express API Status */}
                <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800/80 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${backendStatus.connected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-300">Backend (Express)</p>
                      <p className="text-xs text-slate-500">Puerto 5000</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${backendStatus.connected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    {backendStatus.loading ? 'Cargando...' : (backendStatus.connected ? 'En línea' : 'Desconectado')}
                  </span>
                </div>

                {/* PostgreSQL Database Status */}
                <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800/80 rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${backendStatus.dbConnected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-300">Base de Datos (PostgreSQL)</p>
                      <p className="text-xs text-slate-500">{backendStatus.dbConnected ? 'Conectado mediante Pool' : 'Comprobar .env / servicio'}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${backendStatus.dbConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {backendStatus.loading ? 'Cargando...' : (backendStatus.dbConnected ? 'Conectado' : 'Sin conexión')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/60">
              {backendStatus.loading ? (
                <p className="text-sm text-slate-400">Verificando conexión con el servidor...</p>
              ) : backendStatus.connected ? (
                <div className="space-y-1">
                  <p className="text-sm text-emerald-400 font-medium font-semibold">✓ {backendStatus.message}</p>
                  {backendStatus.dbTime && (
                    <p className="text-xs text-slate-500">Hora BD: {new Date(backendStatus.dbTime).toLocaleString()}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-rose-400 font-medium">✗ Backend desconectado</p>
                  <p className="text-xs text-slate-500 leading-normal">
                    Inicia el servidor ejecutando <code className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">npm run dev</code> dentro de la carpeta <code className="text-purple-400">backend/</code>.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card: Próximos pasos en el desarrollo */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300 shadow-xl">
            <div>
              <h3 className="text-lg font-semibold text-slate-200 mb-6">Guía Rápida para Desarrollar</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-sm text-slate-300">
                  <span className="mt-1 h-5 w-5 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <div>
                    <strong className="text-slate-200 block">Levantar localmente:</strong>
                    Abre terminales separadas para correr el backend y el frontend mediante los comandos de inicio en cada carpeta.
                  </div>
                </li>
                <li className="flex items-start space-x-3 text-sm text-slate-300">
                  <span className="mt-1 h-5 w-5 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <div>
                    <strong className="text-slate-200 block">Vincular a GitHub:</strong>
                    Ejecuta los comandos de Git descritos en el archivo <code className="text-purple-400">README.md</code> para subir tu repositorio.
                  </div>
                </li>
                <li className="flex items-start space-x-3 text-sm text-slate-300">
                  <span className="mt-1 h-5 w-5 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <div>
                    <strong className="text-slate-200 block">Despliegue a Producción:</strong>
                    Usa Railway para provisionar PostgreSQL y Express, y conecta Vercel a la carpeta <code className="text-purple-400">frontend/</code>.
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/60 flex justify-between items-center text-xs text-slate-500">
              <span>Estructura de archivos configurada</span>
              <a 
                href="file:///c:/Users/Lab2LT-1/Desktop/PROYECTO%20FINAL-LAB-II/README.md"
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:underline hover:text-purple-300 transition-colors"
              >
                Ver README.md →
              </a>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl py-6 border-t border-slate-800/60 text-center text-xs text-slate-600">
        <p>Sistema Formal - Monorepositorio React (Vite) + Tailwind CSS v4 & Express + PostgreSQL</p>
      </footer>
    </div>
  );
}

export default App;
