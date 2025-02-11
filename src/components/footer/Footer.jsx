

const Footer = () => {
    return (
      <footer className="bg-barber-primary text-barber-light text-center">
        <div className=" px-4 py-8">
          {/* Grid de contenido */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Columna 1 - Información de contacto */}
            <div>
              <h3 className="text-xl font-bold mb-4">BarberJunior</h3>
              <ul className="space-y-2">
                <li>📍 Dirección del local</li>
                <li>📱 Teléfono: (123) 456-7890</li>
                <li>✉️ Email: info@barberjunior.com</li>
              </ul>
            </div>
  
            {/* Columna 2 - Horarios */}
            <div>
              <h3 className="text-xl font-bold mb-4">Horarios</h3>
              <ul className="space-y-2">
                <li>Lunes - Viernes: 9:00 - 20:00</li>
                <li>Sábado: 10:00 - 18:00</li>
                <li>Domingo: Cerrado</li>
              </ul>
            </div>
  
            {/* Columna 3 - Redes Sociales */}
            <div>
              <h3 className="text-xl font-bold mb-4">Síguenos</h3>
              {/* quite un flex */}
              <div className="space-x-4"> 
                <a href="#" className="text-barber-accent hover:text-barber-links transition-colors">Instagram</a>
                <a href="#" className="text-barber-accent hover:text-barber-links">Facebook</a>
                {/* <a href="#" className="text-barber-accent hover:text-barber-links">Twitter</a> */}
              </div>
            </div>
          </div>
  
          {/* Línea divisoria */}
          <hr className="my-8 border-barber-secondary text-center"/>
  
          {/* Copyright */}
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} BarberJunior. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer