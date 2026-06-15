import { spacingTokens } from "@/_components/core/config/tokens";
import { SwatchSection } from "./swatch-section";

export function SpacingSection() {
  return (
    <SwatchSection id="spacing" title="Spacing scale">
      <div className="flex max-w-xl flex-col gap-4">
        {spacingTokens.map((px) => (
          <div key={px} className="flex items-center gap-4">
            <span className="w-12 font-mono text-xs text-ink-subtle">{px}px</span>
            <div className="h-4 rounded-sm bg-ink" style={{ width: px }} />
          </div>
        ))}
      </div>
    </SwatchSection>
  );
}
