const PageHeader = ({
  title,
  description,
  titleClass,
  descriptionClass,
}: {
  title: string;
  description: string;
  titleClass: string;
  descriptionClass: string;
}) => {
  return (
    <section className="py-20 px-4 bg-cover bg-center bg-no-repeat bg-[url('@/assets/images/services/service-bg.png')]">
      <div className="relative container mx-auto px-2 z-10 py-10">
        <h2 className={`font-bold text-center ${titleClass}`}>{title}</h2>
        <p className={`font-bold text-center ${descriptionClass}`}>
          {description}
        </p>
      </div>
    </section>
  );
};

export default PageHeader;
