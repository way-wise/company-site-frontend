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
}: // breadcrumbs = [{ label: "Home", href: "/" }],
PageHeaderProps) => {
  return (
    <section className="py-20 px-4 bg-cover bg-center bg-no-repeat bg-[url('@/assets/images/services/services-bg.png')]">
      <div className="relative container mx-auto px-2 z-10 py-10">
        {/* Title and Description */}
        <h2 className={`font-bold text-center ${titleClass}`}>{title}</h2>
        <p className={`font-bold text-center ${descriptionClass}`}>
          {description}
        </p>
      </div>
    </section>
  );
};

export default PageHeader;
