import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";
import Image from "next/image";

// Public folder image paths
const image1 = "/images/contact/usa-flag-animated.gif";
const image2 = "/images/contact/uae-flag-animated.gif";

const contactCards = [
   {
      title: "WAY-WISE GLOBAL INC, USA",
      address: "Saddleback Ridge rd, Santa Clarita, California, USA",
      phone: " +1 (310) 528-6170",
      image: image1,
      addressLink: "https://maps.app.goo.gl/3KSqZih9nCMe71Bo8",
   },
   {
      title: "WAY-WISE TECH SERVICES, UAE",
      address:
         "Arzoo Building, 3rd floor (306-14), 171 Al Nahda St, Al Qusais 2, Dubai",
      phone: " +971 52 144-2416",
      image: image2,
      addressLink: "https://maps.app.goo.gl/FrAcvjAFV7zvndYj6",
   },
];

const MapSection = () => {
   return (
      <div className="bg-[#f2f6ff] w-full relative">
         {/* Map Background Section */}
         {/* <section className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[598px] animate-fade-in opacity-0 [--animation-delay:400ms]">
        <Image
          className="w-full h-full object-cover"
          alt="Map background"
          src={image4}
          width={1200}
          height={598}
        />
      </section> */}

         {/* Contact Information Cards - Responsive Positioning */}
         <section className="w-full lg:top-1/2 lg:left-0 lg:right-0 animate-fade-in opacity-0 [--animation-delay:600ms] pb-10 lg:pb-20">
            <div className="mx-auto sm:px-6 py-8 lg:py-0 container">
               <Card className="w-full mx-auto bg-white rounded-xl shadow-[0px_4px_20px_#7b7b7b1a]">
                  <CardContent className="p-4 sm:p-6 md:p-8 lg:p-4 xl:p-8">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {contactCards.map((card, index) => (
                           <div key={index} className="flex flex-col">
                              <div className="w-full h-48 sm:h-56 md:h-64 lg:h-[260px] mb-4 sm:mb-6">
                                 <Image
                                    className="w-full h-full rounded-[10px] object-cover"
                                    alt={`Contact ${card.title}`}
                                    src={card.image}
                                    width={600}
                                    height={260}
                                 />
                              </div>

                              <h3 className="font-bold text-[#1b3447] text-2xl sm:text-2xl mb-3">
                                 {card.title}
                              </h3>

                              <div className="flex items-start gap-3 mb-2">
                                 <MapPin className="w-5 h-5 text-[#00a3ff] flex-shrink-0 mt-0.5" />
                                 <a
                                    href={card.addressLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#1b3447] text-sm sm:text-base leading-relaxed">
                                    {card.address}
                                 </a>
                              </div>

                              <div className="flex items-center gap-3">
                                 <Phone className="w-5 h-5 text-[#00a3ff] flex-shrink-0" />
                                 <a
                                    href={`tel:${card.phone}`}
                                    className="font-semibold text-[#1b3447] text-sm sm:text-base hover:text-[#00a3ff] transition-colors">
                                    {card.phone}
                                 </a>
                              </div>
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>
            </div>
         </section>

         {/* Spacer to prevent content overlap - only on larger screens */}
         {/* <div className="hidden lg:block h-48 xl:h-56 2xl:h-80"></div> */}
      </div>
   );
};

export default MapSection;
