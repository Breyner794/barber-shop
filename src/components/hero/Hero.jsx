
import { useEffect, useState } from "react";
import {Link} from 'react-router-dom'

const Hero = () => {
    
    const images = [
        // Array de imágenes
        '/src/assets/image/cortes1.jpg',
        '/src/assets/image/cortes1.webp',
        '/src/assets/image/cortes2.jpg',
        '/src/assets/image/cortes2.webp',
        '/src/assets/image/cortes3.jpg',
        '/src/assets/image/cortes3.webp',
        '/src/assets/image/cortes4.jpg',
        '/src/assets/image/cortes4.webp',
        '/src/assets/image/cortes5.webp'
    ];

    // Estado para controlar qué imagen se muestra
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentImage((prev) => (prev + 1) % images.length)
        }, 5000) // 5000ms = 5 segundos
    
        return () => clearInterval(interval)
      }, [])

    return (
    <section id="Inicio" className="relative h-[600px] w-full overflow-hidden">
      {/* Imágenes con transición */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out
            ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${img})`
          }}
        />
      ))}

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Contenido */}
      <div className="relative h-full flex flex-col justify-center items-center text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Caballeros del señor💈
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Expertos en estilos clásicos y modernos
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition-colors">
          <Link to="/reserva">
            Reservar tu cita
          </Link>
        </button>

        {/* Indicadores de imagen actual */}
        <div className="absolute bottom-4 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors
                ${index === currentImage ? 'bg-barber-accent' : 'bg-barber-links/50'}`}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero