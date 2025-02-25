import { useState } from "react";

const Gallery = () => {
  const galleryCategories = {
    "Degradados": [
      {
        image: "/src/assets/image/cortes1.jpg",
        title: "Corte de prueba diseño propuesto1",
        description: "Degradado moderno",
      },
      {
        image: "/src/assets/image/cortes1.webp",
        title: "Corte de prueba diseño propuesto2",
        description: "Degradado moderno",
      },
    ],
    "Cortes de Barba": [
      {
        image: "/src/assets/image/cortes2.jpg",
        title: "Corte de prueba diseño propuesto3",
        description: "Estilo barba profesional",
      },
      {
        image: "/src/assets/image/cortes2.webp",
        title: "Corte de prueba diseño propuesto4",
        description: "Recorte de barba moderno",
      },
    ],
    "Cortes con Diseños": [
      {
        image: "/src/assets/image/cortes3.jpg",
        title: "Corte de prueba diseño propuesto5",
        description: "Diseño personalizado",
      },
      {
        image: "/src/assets/image/cortes3.webp",
        title: "Corte de prueba diseño propuesto6",
        description: "Corte artístico",
      },
    ],
  };

  // Estado para controlar la categoría seleccionada
  const [activeCategory, setActiveCategory] = useState(
    Object.keys(galleryCategories)[0]
  );

  return (
    <section id="galeria" className="py-16 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nuestros Trabajos
        </h2>

        {/* Pestañas de categorías */}
        <div className="flex flex-wrap justify-center mb-8 gap-2">
          {Object.keys(galleryCategories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === category
                  ? "bg-black text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Galería de imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {galleryCategories[activeCategory].map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 p-4 text-white">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
