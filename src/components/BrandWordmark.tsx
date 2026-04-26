import wordmarkSrc from "../assets/brand-wordmark.svg";

/** SVG wordmark asset; text styling is separate in CSS. */
export default function BrandWordmark({ className = "h-10 w-auto" }: { className?: string }) {
  return <img src={wordmarkSrc} alt="غُنّ" className={className} decoding="async" loading="lazy" />;
}
