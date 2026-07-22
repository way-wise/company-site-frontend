import type { Metadata } from "next";

const PDF_PATH = "/pdfs/Tech_Profile_for_AK_Print.pdf";

export const metadata: Metadata = {
  title: "Waywise Tech Profile | AK Printing",
  description: "Waywise Tech company technology profile prepared for AK Printing.",
};

const TechProfilePage = () => {
  return (
    <main className="h-screen w-screen">
      <iframe
        src={PDF_PATH}
        title="Tech Profile"
        className="h-full w-full border-0"
      />
    </main>
  );
};

export default TechProfilePage;
