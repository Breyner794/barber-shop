import { useState } from 'react';
import logo from '/src/assets/scissors.svg'; // Ajusta la ruta según tu estructura

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!credentials.email) {
      alert('Por favor, ingresa tu email');
      return;
    }
    // Aquí iría la lógica para enviar el email de recuperación
    console.log('Enviando email de recuperación a:', credentials.email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá la lógica de autenticación
    console.log(credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-barber-primary">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <img 
            src={logo} 
            alt="BarberJunior Logo" 
            className="mx-auto h-20 w-20 mb-4"
          />
          <h2 className="text-2xl font-bold text-barber-primary">
            Dashboard
          </h2>
        </div>

         {!isForgotPassword ? (
            <div>
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-barber-accent focus:border-transparent"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-barber-accent focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex flex-col space-y-4">
              <button
                type="submit"
                className="w-full bg-barber-accent text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Iniciar Sesión
              </button>
              
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-sm text-gray-600 hover:text-barber-accent transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
        </form>
        </div>
    ) : (
        <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-barber-accent focus:border-transparent"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                className="w-full bg-barber-accent text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Enviar Email de Recuperación
              </button>
              
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="text-sm text-gray-600 hover:text-barber-accent transition-colors"
              >
                Volver al inicio de sesión
              </button>
            </div>
          </form>
         )} 
        {/* Footer */}
        <p className="mt-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Caballeros del señor. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;