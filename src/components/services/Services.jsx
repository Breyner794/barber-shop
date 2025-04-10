import React from 'react';
import { useServices } from '../../context/ServicesContext';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const {services, loading, error} = useServices();
  const navigate = useNavigate();

  if (loading) {
    return (
      <section id="servicios" className="py-16 bg-barber-hover">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
          <div className="flex justify-center items-center h-40">
            <p>Cargando servicios...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="servicios" className="py-16 bg-barber-hover">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
          <div className="flex justify-center items-center h-40">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="servicios">
      <section className="py-16 bg-barber-hover">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.isArray(services) && services.length > 0 ? (
              services.map((service) => (
                <div key={service._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="text-4xl mb-4 text-center">{service.icon}</div>
                    <h3 className="text-xl font-bold text-center mb-2">{service.title}</h3>
                    <p className="text-2xl font-bold text-center text-barber-accent mb-4">$ {service.price.toLocaleString('es-CO')}</p>
                    <p className="text-gray-600 text-center mb-4">{service.duration} minutos</p>
                    <ul className="space-y-2">
                      {service.includes && service.includes.map((item, i) => (
                        <li key={i} className="flex items-center justify-center">
                          <span className="text-barber-accent mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-50">
                    <button 
                      className="w-full bg-barber-accent hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
                      onClick={() => navigate('/reserva', { state: { selectedService: service.id } })}
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center">
                <p>No hay servicios disponibles</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Services;