import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [backendStatus, setBackendStatus] = useState({
    loading: true,
    connected: false,
    dbConnected: false,
    message: '',
    error: ''
  });

  const checkHealth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        const data = await response.json();
        setBackendStatus({
          loading: false,
          connected: true,
          dbConnected: data.status === 'OK',
          message: data.message,
          error: ''
        });
      } else {
        setBackendStatus({
          loading: false,
          connected: true,
          dbConnected: false,
          message: 'Error en la respuesta de salud',
          error: `HTTP error! status: ${response.status}`
        });
      }
    } catch (err) {
      setBackendStatus({
        loading: false,
        connected: false,
        dbConnected: false,
        message: 'No se pudo conectar al servidor.',
        error: err.message
      });
    }
  };

  const verifySession = async (savedToken) => {
    if (!savedToken) {
      setLoadingSession(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${savedToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(savedToken);
      } else {
        // Token expiró o es inválido
        handleLogout();
      }
    } catch (err) {
      console.error('Error verificando sesión:', err);
      // No cerrar sesión por fallos temporales de red
    } finally {
      setLoadingSession(false);
    }
  };

  useEffect(() => {
    checkHealth();
    verifySession(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoginSuccess = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  // Si se está verificando el token de sesión guardado al inicio
  if (loadingSession && token) {
    return (
      <div className="min-h-screen bg-[#070d0a] text-emerald-400 flex flex-col justify-center items-center font-sans space-y-4">
        <svg className="animate-spin h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs">Sincronizando credenciales de seguridad...</span>
      </div>
    );
  }

  return (
    <>
      {/* Indicador de Estado del Servidor si hay algún fallo */}
      {!backendStatus.loading && (!backendStatus.connected || !backendStatus.dbConnected) && (
        <div className="bg-rose-950/90 border-b border-rose-900 text-rose-300 px-4 py-2.5 text-center text-xs font-semibold z-50 sticky top-0 flex justify-center items-center space-x-2 backdrop-blur-md">
          <svg className="w-4 h-4 text-rose-400 animate-pulse shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>
            {!backendStatus.connected 
              ? 'Atención: El servidor backend (puerto 5000) no responde. Asegúrate de iniciarlo con "npm run dev".' 
              : 'Atención: Servidor conectado, pero falló la conexión con la base de datos PostgreSQL.'}
          </span>
          <button 
            onClick={checkHealth}
            className="px-2.5 py-0.5 rounded bg-rose-900 hover:bg-rose-800 text-white text-[10px] transition-all ml-2 active:scale-95 cursor-pointer font-bold border border-rose-800"
          >
            Reintentar
          </button>
        </div>
      )}

      {user ? (
        <Dashboard user={user} token={token} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;
