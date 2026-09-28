import Image from "next/image";
import playIconBg from "@/assets/images/attorney/paly-icon-bg.png";
import playIcon from "@/assets/images/attorney/play-icon.png";
import { cn } from "@/lib/utils";

/**
 * Translucent ring play button, centred over its nearest positioned ancestor.
 * No video source yet — visual control only. Pass `className` to override the size
 * (e.g. `size-[44px] border-[6px]`).
 */
const AttorneyPlayButton = ({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) => {
  return (
    <button
      type="button"
      aria-label="Play video"
      className={cn(
        "group absolute left-1/2 top-1/2 flex cursor-pointer transition-colors duration-300 hover:border-white/40 size-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-8 border-white/40 sm:size-[96px] sm:border-[20px]",
        className,
      )}
    >
      <Image
        src={playIconBg}
        alt=""
        aria-hidden="true"
        fill
        sizes="124px"
        className="pointer-events-none object-contain opacity-90 transition-transform duration-300 group-hover:scale-110"
      />
      <Image
        src={playIcon}
        alt=""
        aria-hidden="true"
        width={48}
        height={48}
        className={cn(
          "relative size-5 transition-transform duration-300 group-hover:scale-125 sm:size-7",
          iconClassName,
        )}
      />
    </button>
  );
};

export default AttorneyPlayButton;
