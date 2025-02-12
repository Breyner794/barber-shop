import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

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
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 text-barber-light bg-barber-accent hover:bg-barber-secondary"
        >
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>

        {/* Menú de navegación */}
        <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto text-center`}>
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:space-x-8 md:flex-row md:mt-0 md:border-0 bg-barber-primary border-barber-secondary">
            <li>
            <button className="block py-2 px-3 text-barber-light hover:text-barber-accent md:p-0 " onClick={() => scrollToSection('Inicio')}>Inicio</button>
            </li>
            <li>
            <button className="block py-2 px-3 text-barber-light hover:text-barber-accent md:p-0" onClick={() => scrollToSection('servicios')}>Servicios</button>
            </li>
            <li>
            <button className="block py-2 px-3 text-barber-light hover:text-barber-accent md:p-0" onClick={() => scrollToSection('galeria')}>Galeria</button>
            </li>
            <li>
            <button className="block py-2 px-3 text-barber-light hover:text-barber-accent md:p-0" onClick={() => scrollToSection('contacto')}>Contacto</button>
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