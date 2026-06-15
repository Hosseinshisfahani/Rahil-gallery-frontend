import { landingMarqueeItems } from "./data";

export function LandingMarquee() {
  const items = [...landingMarqueeItems, ...landingMarqueeItems];

  return (
    <div
      className="overflow-hidden border-y border-[var(--landing-border)] bg-[var(--landing-primary)] py-3.5"
      aria-hidden="true"
    >
      <div className="landing-marquee-track">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="landing-mono flex shrink-0 items-center gap-8 px-8 text-white"
          >
            {item}
            <span className="text-[var(--landing-gold)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
