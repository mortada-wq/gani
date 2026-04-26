import { useId } from "react";

/** Small pixel mark from prompt bar design (left of tools). */
export default function PromptBarPixelGlyph({ className = "" }: { className?: string }) {
  const gid = useId().replace(/:/g, "");
  const gradId = `pb_pixel_${gid}`;

  return (
    <svg
      className={className}
      width="18"
      height="12"
      viewBox="37.25 129.75 16.35 10.1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M53.55 136.5V139.75H50.3V136.5H53.55Z" fill={`url(#${gradId})`} />
      <path d="M50.3 133.25H47.05V136.5H50.3V133.25Z" fill={`url(#${gradId})`} />
      <path d="M40.55 139.75V136.5H37.3V139.75H40.55Z" fill={`url(#${gradId})`} />
      <path d="M47.05 130V133.25H43.8V136.5H40.55V133.25H43.8V130H47.05Z" fill={`url(#${gradId})`} />
      <defs>
        <linearGradient id={gradId} x1="45.425" y1="130" x2="40.3" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0.610577" stopColor="#12B1FE" />
          <stop offset="1" stopColor="#155C7E" />
        </linearGradient>
      </defs>
    </svg>
  );
}
