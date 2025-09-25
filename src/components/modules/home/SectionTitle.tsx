const SectionTitle = ({
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
    <div className="max-w-4xl mx-auto px-4 text-center space-y-1">
      <h2 className={` font-bold  ${titleClass}`}>{title}</h2>
      <p className={` leading-[30px] ${descriptionClass}`}>{description}</p>
    </div>
  );
};

export default SectionTitle;
