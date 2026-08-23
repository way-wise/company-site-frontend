import AttorneyContainer from "./AttorneyContainer";

/**
 * Section 1 — top announcement bar.
 *
 * Figma spec: full-bleed #00A3FF band, DM Sans Medium 13px / 19.5px line-height,
 * zero letter-spacing, centered horizontally and vertically.
 *
 * The blue band is full-bleed; only the text is held to the shared 1420px width.
 */
const AttorneyTopBar = () => {
  return (
    <AttorneyContainer
      className="bg-[#00A3FF] py-2.5"
      innerClassName="flex items-center justify-center"
    >
      <p
        className="text-center font-medium text-white"
        style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: "13px",
          lineHeight: "19.5px",
          letterSpacing: "0",
        }}
      >
        Technology Solutions Built Exclusively for Attorneys &amp; Law Firms
      </p>
    </AttorneyContainer>
  );
};

export default AttorneyTopBar;
