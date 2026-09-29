import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const SIZES = {
  xs: "size-8",
  sm: "size-10 sm:size-12",
  md: "size-16 sm:size-20",
  lg: "size-20 sm:size-27.5",
} as const;

type RestaurentPlayButtonProps = ComponentPropsWithoutRef<"button"> & {
  /** Preset size. Override with `width`/`height` or `className` (e.g. `size-14`). */
  size?: keyof typeof SIZES;
  /** Button width. Number = px, or any CSS length. Overrides `size`. */
  width?: number | string;
  /** Button height. Number = px, or any CSS length. Defaults to `width` so it stays round. */
  height?: number | string;
  /** Centre absolutely over the nearest positioned ancestor. Set `false` to render inline. */
  centered?: boolean;
  /** Classes for the red triangle, e.g. `size-4 sm:size-6` for responsive icon sizes. */
  iconClassName?: string;
  /** Red triangle size. Number = px, or any CSS length (% is of the white core). Default 40%. */
  iconSize?: number | string;
  /** Thickness of the wide translucent outer ring. Number = px, or any CSS length. Default `"13.5%"`. */
  outerRingWidth?: number | string;
  /** Thickness of the thin frosted inner ring. Number = px, or any CSS length. Default `"4%"`. */
  innerRingWidth?: number | string;
};

const toCss = (value: number | string) => (typeof value === "number" ? `${value}px` : value);

/**
 * Layered play button — a wide translucent outer ring, a thin frosted inner ring and a
 * solid white core holding a red play triangle. Rings and icon scale with the button,
 * so it works at any size.
 */
const RestaurentPlayButton = ({
  size = "md",
  width,
  height = width,
  centered = true,
  className,
  iconClassName,
  iconSize,
  outerRingWidth = "13.5%",
  innerRingWidth = "4%",
  type = "button",
  "aria-label": ariaLabel = "Play video",
  style,
  ...props
}: RestaurentPlayButtonProps) => {
  const outer = toCss(outerRingWidth);
  const core = `calc(${outer} + ${toCss(innerRingWidth)})`;

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      style={{
        ...(width !== undefined && { width: toCss(width) }),
        ...(height !== undefined && { height: toCss(height) }),
        ...style,
      }}
      className={cn(
        "group relative shrink-0 cursor-pointer rounded-full bg-white/50 backdrop-blur-[2px] transition-colors duration-300 hover:bg-white/50",
        centered && "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        SIZES[size],
        className,
      )}
      {...props}
    >
      {/* Thin frosted inner ring */}
      <span
        aria-hidden="true"
        style={{ inset: outer }}
        className="absolute rounded-full bg-white/60 transition-transform duration-300 group-hover:scale-105"
      />
      {/* Solid white core */}
      <span
        aria-hidden="true"
        style={{ inset: core }}
        className="absolute flex items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-105"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={iconSize !== undefined ? { width: toCss(iconSize), height: toCss(iconSize) } : undefined}
          className={cn(
            "size-[40%] text-[#F5282D] transition-transform duration-300 group-hover:scale-110",
            iconClassName,
          )}
        >
          <path
            d="M6 4.2c0-1 1.1-1.6 1.9-1.1l12.4 8c.8.5.8 1.6 0 2.1l-12.4 8c-.8.5-1.9-.1-1.9-1.1V4.2Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  );
};

export default RestaurentPlayButton;
