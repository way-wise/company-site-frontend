import { BreadcrumbItem } from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description: string;
  titleClass: string;
  descriptionClass: string;
  breadcrumbs?: BreadcrumbItem[];
}

const PageHeader = ({
  title,
  description,
  titleClass,
  descriptionClass,
  breadcrumbs = [{ label: "Home", href: "/" }],
}: PageHeaderProps) => {
  return (
    <section className="py-20 px-4 bg-cover bg-center bg-no-repeat bg-[url('@/assets/images/services/services-bg.png')]">
      <div className="relative container mx-auto px-2 z-10 py-10">
        {/* Title and Description */}
        <h2 className={`font-bold text-center ${titleClass}`}>{title}</h2>
        <p className={`font-bold text-center ${descriptionClass}`}>
          {description}
        </p>
        {/* Breadcrumb */}
        {/* {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex justify-center my-6 ">
            <Breadcrumb>
              <BreadcrumbList className="text-white/80">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage className="text-white font-semibold">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link
                            href={crumb.href || "/"}
                            className="text-white/80 hover:text-white"
                          >
                            {crumb.label}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator className="text-white/60" />
                    )}
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )} */}
      </div>
    </section>
  );
};

export default PageHeader;
