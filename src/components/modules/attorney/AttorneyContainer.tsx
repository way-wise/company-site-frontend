import { cn } from "@/lib/utils";

/**
 * Shared width constraint for the /attorney landing page.
 *
 * Content sections are 1420px; the navbar is the one documented exception at 1530px
 * (pass `maxWidthClass`).
 *
 * Deliberately not the site-wide `container` utility (globals.css), which is capped at
 * 1352px and used by ~35 other files — widening that would reflow the whole site.
 *
 * The padding sits on the OUTER element and the cap on the inner one, so content
 * measures exactly its stated width at wide viewports rather than that width minus the
 * gutters. The gutters only bite once the viewport is narrower than the cap.
 */

/** Default cap for content sections. */
export const ATTORNEY_CONTENT_WIDTH = "max-w-[1420px]";
/** Navbar-only cap — wider than the content sections by design. */
export const ATTORNEY_NAV_WIDTH = "max-w-[1530px]";

const AttorneyContainer = ({
  children,
  className,
  innerClassName,
  maxWidthClass = ATTORNEY_CONTENT_WIDTH,
}: {
  children: React.ReactNode;
  /** Applied to the full-bleed outer wrapper — use for section background/padding. */
  className?: string;
  /** Applied to the capped inner wrapper — use for layout (flex/grid). */
  innerClassName?: string;
  /**
   * Overrides the 1420px content cap. Only the navbar should set this
   * (to ATTORNEY_NAV_WIDTH); every other section keeps the default.
   */
  maxWidthClass?: string;
}) => {
  return (
    <div className={cn("w-full px-4", className)}>
      <div className={cn("mx-auto w-full", maxWidthClass, innerClassName)}>
        {children}
      </div>
    </div>
  );
};

export default AttorneyContainer;
