

const Services = () => {
    const services = [
        /*Servicios: podemos adicionar nuevos o cambiarlos
        la idea es que aqui podamos cambiar con mas facilidad los precios
        o diferentes combos que pueden haber en futuro.*/
      {
        title: "Corte Clásico",
        price: "$15.000",
        duration: "30 min",
        includes: ["Corte de cabello", "Lavado", "Peinado"],
        icon: "✂️"
      },
      {
        title: "Barba Completa",
        price: "$10.000",
        duration: "20 min",
        includes: ["Perfilado", "Afeitado", "Tratamiento"],
        icon: "💈"
      },
      {
        title: "Combo Premium",
        price: "$20.000",
        duration: "45 min",
        includes: ["Corte", "Barba", "Mascarilla"],
        icon: "👑"
      },
    ];
  
    return (
    <section id="servicios">
      <section className="py-16 bg-barber-hover">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="text-4xl mb-4 text-center">{service.icon}</div>
                  <h3 className="text-xl font-bold text-center mb-2">{service.title}</h3>
                  <p className="text-2xl font-bold text-center text-barber-accent mb-4">{service.price}</p>
                  <p className="text-gray-600 text-center mb-4">{service.duration}</p>
                  <ul className="space-y-2">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-center justify-center">
                        <span className="text-barber-accent mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-gray-50">
                  <button className="w-full bg-barber-accent hover:bg-red-700 text-white py-2 rounded-lg transition-colors">
                    Reservar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
    );
  };
  
  export default Services;