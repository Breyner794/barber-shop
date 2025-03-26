

const Footer = () => {
    return (
      <footer className="bg-barber-primary text-barber-light text-center">
        <div className=" px-4 py-8">
          {/* Grid de contenido */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Columna 1 - Información de contacto */}
            <div>
              <h3 className="text-xl font-bold mb-4">BarberJunior</h3>
              <hr className="w-full my-4"/>
              <ul className="space-y-2">
                <li>📍 Compartir Calle 102D #23-05</li>
                <li>📍 Valle Grande Calle 80 #23 - 85</li>
                <li>📱 Teléfono: (+57) 318 473 18 77</li>
              </ul>
            </div>
  
            {/* Columna 2 - Horarios */}
            <div>
              <h3 className="text-xl font-bold mb-4">Horarios</h3>
              <hr className="w-full my-4"/>
              <ul className="space-y-4">
                <li>Sede Compartir</li>
                <li>Horario: Lunes a sábado: 9:00 - 20:00</li>
                <li>Domingo: Cerrado, excepto si hay un festivo. En ese caso, se atiende por orden de llegada.</li>
                <hr className="w-full my-4"/>
                <li>Sede Valle Grande</li>
                <li>Horario: Lunes a viernes: 9:00 - 20:00</li>
                <li>Domingo y festivos: Cerrado</li>
              </ul>
            </div>
  
            {/* Columna 3 - Redes Sociales */}
            <div>
              <h3 className="text-xl font-bold mb-4">Síguenos</h3>
              <hr className="w-full my-4"/>
              {/* quite un flex */}
              <div className="space-x-4"> 
                <a href="https://www.facebook.com/junior.castillo.9081?locale=es_LA" className="text-barber-accent hover:text-barber-links transition-colors">Instagram</a>
                <a href="https://www.instagram.com/caba.llerosdelsenor/" className="text-barber-accent hover:text-barber-links">Facebook</a>
                <a href="https://www.tiktok.com/@juniorcastillo549" className="text-barber-accent hover:text-barber-links">TikTok</a>
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