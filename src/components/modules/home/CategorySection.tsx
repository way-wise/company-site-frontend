import { categoryData } from "@/datas/category";
import Image from "next/image";

const CategorySection = () => {
  const categories = categoryData;

  return (
    <section className="w-full py-6 ">
      <div className=" mx-auto px-4 container">
        <div className="flex flex-col lg:flex-row justify-start items-center w-full gap-2">
          <div className=" font-semibold text-center">
            <p>
              <span className="whitespace-nowrap">Our Featured</span>{" "}
              <br className="hidden lg:block" /> Partners
            </p>
          </div>
          <div className="flex items-center md:px-4 w-full">
            <div className="overflow-hidden w-full">
              <div className="flex items-center gap-4 lg:gap-8 xl:gap-12 auto-scroll">
                {categories.map((category) => (
                  <div
                    key={`first-${category.id}`}
                    className="flex-shrink-0 flex flex-col transition-all items-center justify-center text-center rounded-xl group duration-200 p-1"
                  >
                    <div className="flex items-center justify-center mb-2 bg-white p-2 rounded-md">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={120}
                        height={60}
                        className="w-20 h-12 lg:w-32 lg:h-16 rounded-md object-contain"
                      />
                    </div>
                  </div>
                ))}

                {categories.map((category) => (
                  <div
                    key={`second-${category.id}`}
                    className="flex-shrink-0 flex flex-col transition-all items-center justify-center text-center rounded-xl group duration-200 p-1"
                  >
                    <div className="flex items-center justify-center mb-2 bg-white p-2 rounded-md">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={120}
                        height={60}
                        className="w-20 h-12 lg:w-32 lg:h-16 rounded-md object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
