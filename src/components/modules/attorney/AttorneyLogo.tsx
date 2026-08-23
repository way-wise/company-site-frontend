import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import logo from "@/assets/images/shared/logo.webp";

/**
 * Way Wise Tech lockup for the dark /attorney page.
 *
 * This is the dark-background variant: white "WAY-WISE" with the gold "TECH" and gold
 * mark, all in one asset. The site-wide pair (way-wise-logo.svg + way-wise-text.png)
 * cannot be used here — that wordmark's text is near-black and disappears on black,
 * which is why it previously needed a `brightness-0 invert` filter that also stripped
 * the gold from "TECH". That workaround is now gone.
 *
 * Sourced from logo.png and re-encoded as LOSSLESS WebP: 8.2 KB → 5.6 KB, pixel
 * identical. Lossless matters for a logo — lossy WebP fringes crisp letterforms. Note
 * next.config.ts sets images.unoptimized, so whatever is imported here is what ships.
 */
const AttorneyLogo = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/attorney"
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label="Way Wise Tech"
    >
      <Image
        src={logo}
        alt="Way Wise Tech"
        // Intrinsic size is 285x60; width/height come from the static import, so only
        // the rendered width is set here and the height follows the aspect ratio.
        className="h-auto w-37.5 md:w-43.75 xl:w-47.5"
        priority
      />
    </Link>
  );
};

export default AttorneyLogo;
