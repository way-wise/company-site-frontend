import image1 from "@/assets/images/contact/image1.svg";
import image2 from "@/assets/images/contact/image2.svg";
import image3 from "@/assets/images/contact/image3.svg";
import image4 from "@/assets/images/contact/image4.svg";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
const contactCards = [
  {
    icon: "phone",
    title: "Make a Call",
    subtitle: "+1-310-528-6170",
    image: image1,
    stasue: "tel:+1-310-528-6170",
    iconSrc: "https://c.animaapp.com/mg0gx2pzE6gABw/img/fi-2951053.svg",
  },
  {
    icon: "mail",
    title: "Make a Quote",
    subtitle: "info@waywisetech.com",
    image: image2,
    stasue: "mailto:info@waywisetech.com",
    iconSrc: "https://c.animaapp.com/mg0gx2pzE6gABw/img/fi-3296467.svg",
  },
  {
    icon: "location",
    title: "Street Location",
    subtitle: "Santa Clarita, CA 91351, USA",
    image: image3,
    stasue: "https://maps.app.goo.gl/EgMwMf5hbxYeJD8t5",
    iconSrc: "https://c.animaapp.com/mg0gx2pzE6gABw/img/fi-3722049.svg",
  },
];

const MapSection = () => {
  return (
    <div className="bg-[#f2f6ff] w-full relative" data-model-id="286:917">
      {/* Map Background Section */}
      <section className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[598px] animate-fade-in opacity-0 [--animation-delay:400ms]">
        <Image
          className="w-full h-full object-cover"
          alt="Map background"
          src={image4.src}
          width={1200}
          height={598}
        />
      </section>

      {/* Contact Information Cards - Responsive Positioning */}
      <section className="w-full relative md:absolute md:top-1/2 md:left-0 md:right-0 animate-fade-in opacity-0 [--animation-delay:600ms]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-0">
          <Card className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-[0px_4px_20px_#7b7b7b1a]">
            <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {contactCards.map((card, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="w-full h-48 sm:h-56 md:h-64 lg:h-[260px] mb-4 sm:mb-6">
                      <Image
                        className="w-full h-full rounded-[10px] object-cover"
                        alt={`Contact ${card.title}`}
                        src={card.image.src}
                        width={100}
                        height={100}
                      />
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                      <Image
                        className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
                        alt={card.title}
                        src={card.iconSrc}
                        width={100}
                        height={100}
                      />
                      <div className="flex flex-col min-w-0">
                        <div className="font-normal text-[#00a3ff] text-xs sm:text-sm tracking-[0] leading-6">
                          {card.title}
                        </div>
                        <div className="font-semibold text-[#1b3447] text-sm sm:text-base xl:text-xl tracking-[0] leading-normal break-words">
                          <a href={card.stasue} target="_blank">
                            {card.subtitle}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Spacer to prevent content overlap - only on larger screens */}
      <div className="hidden md:block h-32 lg:h-40 xl:h-80"></div>
    </div>
  );
};

export default MapSection;
