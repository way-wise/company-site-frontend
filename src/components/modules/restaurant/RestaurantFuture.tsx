import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * CTA banner.
 *
 * The orange ground, the phone mockup and the banner's rounded corners are all baked
 * into one 1520x438 asset, so only the copy on the left is markup.
 *
 * The asset lives in `public/` rather than `src/assets/`, which is where it was
 * supplied, so it is referenced by path and needs its intrinsic size declared.
 */
const BANNER = "/images/restaurant/mobile.png";

// Figma spec: Plus Jakarta Sans ExtraBold 48px / 60px, zero letter-spacing.
// Only the desktop size is specced; the responsive steps below it are mine.
const titleTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 800,
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Medium 18px / 100%, zero letter-spacing. Wraps to two
// lines, so it gets real leading rather than the specced 100%.
const paragraphTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 500,
  fontSize: "18px",
  letterSpacing: "0",
} as const;

// Figma spec: Plus Jakarta Sans Medium 16px / 18px, zero letter-spacing.
const buttonTypography = {
  fontFamily: "var(--font-plus-jakarta-sans), sans-serif",
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "18px",
  letterSpacing: "0",
} as const;

const RestaurantFuture = () => {
  return (
    <section className="w-full bg-white px-4">
      <div className="mx-auto w-full max-w-[1520px] py-10 lg:py-[100px]">
        {/*
          Ground for the banner: it backs the copy on mobile, where the artwork sits
          above rather than behind it, and covers the gap before the image paints.

          Three stops per the Figma gradient panel: #E94222 at full opacity on both
          ends, and the same hue at 50% alpha (#E9422280) at the 57% mark, which lightens
          the middle of the band.
        */}
        <div className="relative rounded-[20px] bg-[#E94222] lg:bg-[linear-gradient(115deg,#E94222_40%,#E9422280_70%,#E94222_100%)]">
          {/*
            Two layouts from one element: in flow at the top on mobile, and absolutely
            covering the banner from lg up. `object-right` keeps the phone anchored to
            the right edge as the banner grows wider than the asset's 3.47:1 aspect.
          */}
          <Image
            src={BANNER}
            alt="Restaurant ordering app shown on a phone"
            width={542}
            height={496}
            className="absolute right-5 xl:right-[147px] -top-[58px] hidden lg:block"
            sizes="(min-width: 1024px) 1520px, 100vw"
          />

          {/* `relative` lifts the copy above the absolutely-positioned artwork. */}
          <div className="relative grid lg:min-h-[438px] lg:grid-cols-[55fr_45fr]">
            <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-0 lg:pl-[100px]">
              {/* h2: sibling of the other section headings. */}
              <h2
                className="text-[30px] leading-[1.2] text-white sm:text-[38px] lg:text-[48px] lg:leading-[60px]"
                style={titleTypography}
              >
                {/* Hard break reproduced from the Figma frame. */}
                <span className="lg:block">Powering the future of </span>
                <span className="lg:block">restaurants</span>
              </h2>

              <p
                className="mt-6 max-w-[540px] leading-[1.5] text-white"
                style={paragraphTypography}
              >
                From ordering to operations, our technology helps restaurants deliver better experiences and grow faster.
              </p>

              <div className="mt-8">
                {/* No fill or border colour was specced beyond "border 1px"; the frame
                    shows a white hairline and white label on the orange ground. */}
                <Link
                  href="/contact-us"
                  style={buttonTypography}
                  className="inline-flex items-center gap-3 rounded-[10px] border border-white px-[60px] py-4 whitespace-nowrap text-white transition-colors duration-200 hover:bg-white hover:text-[#E94222]"
                >
                  Start Growing Today
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Reserves the right side for the phone, which is part of the image. */}
            <div className="hidden lg:block" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantFuture;
