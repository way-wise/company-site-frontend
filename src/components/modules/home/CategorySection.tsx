import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { categoryData } from "@/datas/category";
import Image from "next/image";

const CategorySection = () => {
  const categories = categoryData;

  return (
    <section className="w-full py-12 lg:py-16">
      <div className=" mx-auto px-4">
        <div className="flex justify-center">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full "
          >
            <CarouselContent className="flex items-center justify-center">
              {categories.map((category) => (
                <CarouselItem
                  className="basis-1/3 md:basis-1/5 lg:basis-1/6 xl:basis-1/8"
                  key={category.id}
                >
                  <div className="flex flex-col transition-all w-full items-center justify-center text-center rounded-xl group duration-200  p-2 mx-2">
                    <div className="flex items-center justify-center  mb-2">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={310}
                        height={68}
                        className="w-full h-full"
                      />
                    </div>
                    {/* <span className="text-xs font-medium text-gray-600 group-hover:text-[#340049] text-center">
                      {category.name}
                    </span> */}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
