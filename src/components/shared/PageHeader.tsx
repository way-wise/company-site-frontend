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
  /**
   * How the banner title participates in the page's heading outline. Pick per page:
   *
   * - "h1"    — this banner IS the page's main heading. Title and description are wrapped in a
   *             *single* <h1>, because the design splits one heading across two lines
   *             ("OUR" / "SERVICES"); separate elements would give an <h1> of just "OUR".
   * - "plain" — the page's <h1> lives in a child component (ServiceDetails, ChooseUs,
   *             MedicalITSupportDetails). The banner renders as a plain <div> so it does not
   *             sit *above* that <h1> in the outline, which would make the <h1> non-sequential.
   * - "h2"    — legacy default, kept so existing callers are unaffected. Avoid for new pages:
   *             it is what caused both the "missing h1" and "h1 non-sequential" audit issues.
   *
   * Every mode reuses the same classes, so all three render identically — Tailwind's preflight
   * resets heading font-size/weight, and `block` makes the spans behave like the old h2/p.
   */
  titleAs?: "h1" | "h2" | "plain";
}

const PageHeader = ({
  title,
  description,
  titleClass,
  descriptionClass,
  titleAs = "h2",
}: // breadcrumbs = [{ label: "Home", href: "/" }],
PageHeaderProps) => {
  return (
    <section className="py-14 px-4 bg-cover bg-center bg-no-repeat bg-[url('@/assets/images/services/services-bg.png')]">
      <div className="relative container mx-auto px-2 z-10 py-10">
        {/* Title and Description */}
        {titleAs === "h1" ? (
          <h1>
            <span className={`block font-bold text-center ${titleClass}`}>
              {title}
            </span>
            {description ? (
              <span className={`block font-bold text-center ${descriptionClass}`}>
                {description}
              </span>
            ) : null}
          </h1>
        ) : titleAs === "plain" ? (
          <>
            <div className={`font-bold text-center ${titleClass}`}>{title}</div>
            <p className={`font-bold text-center ${descriptionClass}`}>
              {description}
            </p>
          </>
        ) : (
          <>
            <h2 className={`font-bold text-center ${titleClass}`}>{title}</h2>
            <p className={`font-bold text-center ${descriptionClass}`}>
              {description}
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
