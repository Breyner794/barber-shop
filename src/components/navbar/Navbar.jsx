import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el click no fue ni en el menú ni en el botón, cerramos el menú
      if (menuRef.current && buttonRef.current && 
          !menuRef.current.contains(event.target) && 
          !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Añadimos el event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Limpiamos el event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigate = useNavigate()

  const scrollToSection = (id) => {
    navigate('/')
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <nav className="bg-barber-primary fixed w-full z-20 top-0 start-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo y Nombre */}
        <a href="/" className="flex items-center space-x-3">
          <img src="/src/assets/scissors.svg" className="h-12" alt="Logo Barbería" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-barber-light">
            Caballeros del señor💈
          </span>
        </a>

        {/* Botón móvil */}
        <button 
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg 
          lg:hidden focus:outline-none focus:ring-2 
          text-barber-light bg-barber-accent hover:bg-barber-secondary"
        >
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>

        {/* Menú de navegación */}
        <div 
        ref={menuRef}
        className={`${isOpen ? 'block' : 'hidden'} w-full lg:block lg:w-auto`}>
          <ul className="flex flex-col p-4 lg:p-0 mt-4 font-medium border 
          rounded-lg lg:space-x-8 lg:flex-row lg:mt-0 lg:border-0 flex flex-col items-center
          bg-barber-primary border-barber-secondary">
            <li>
            <button className="block py-2 px-3 text-barber-light hover:text-barber-accent lg:p-0 " onClick={() => scrollToSection('Inicio')}>Inicio</button>
            </li>
            <li>
            <button className="block py-2 px-3 text-barber-light hover:text-barber-accent lg:p-0" onClick={() => scrollToSection('servicios')}>Servicios</button>
            </li>
            <li>
            <button className="block py-2 px-3 text-barber-light hover:text-barber-accent lg:p-0" onClick={() => scrollToSection('galeria')}>Galeria</button>
            </li>
            <li>
            <button className="block py-2 px-3 text-barber-light hover:text-barber-accent lg:p-0" onClick={() => scrollToSection('contacto')}>Contacto</button>
            </li>
            {/* Botón de Reserva */}
            <li>
              <button className="inline-block px-4 py-2 text-barber-light bg-barber-accent hover:bg-red-700 rounded-lg transition-colors duration-300">
                <Link to="/reserva">
                Reserva tu cita
                </Link>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar