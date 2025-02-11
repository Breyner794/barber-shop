// components/contact/Contact.jsx
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
 const socialLinks = [
   { icon: <FaFacebookF />, url: "https://facebook.com/barberjunior", color: "bg-blue-600" },
   { icon: <FaInstagram />, url: "https://instagram.com/barberjunior", color: "bg-pink-600" },
   { icon: <FaTiktok />, url: "https://tiktok.com/@barberjunior", color: "bg-black" },
   { icon: <FaWhatsapp />, url: "https://wa.me/123456789", color: "bg-green-500" }
 ];

 return (
   <section id="contacto" className="py-16 bg-barber-redS">
     <div className="max-w-screen-xl mx-auto px-4">
       <h2 className="text-3xl font-bold text-center mb-12">Contáctanos</h2>

       <div className="flex flex-col items-center">
         {/* Info de Contacto */}
         <div className="text-center mb-8">
           <p className="mb-2">📍 Dirección del local</p>
           <p className="mb-2">📱 Teléfono: (123) 456-7890</p>
           <p>✉️ Email: info@barberjunior.com</p>
         </div>

         {/* Redes Sociales */}
         <div className="text-center">
           <h3 className="text-xl font-bold mb-4">Síguenos</h3>
           <div className="flex space-x-4">
             {socialLinks.map((social, index) => (
               <a 
                 key={index}
                 href={social.url}
                 target="_blank"
                 rel="noopener noreferrer"
                 className={`${social.color} p-3 rounded-full text-white hover:opacity-80 transition-opacity`}
               >
                 {social.icon}
               </a>
             ))}
           </div>
         </div>
       </div>
     </div>
   </section>
 );
};

export default Contact;