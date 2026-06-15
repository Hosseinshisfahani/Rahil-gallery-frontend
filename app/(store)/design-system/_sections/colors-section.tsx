import { colorTokens } from "@/_components/core/config/tokens";
import { SwatchSection } from "./swatch-section";

export function ColorsSection() {
  return (
    <SwatchSection id="colors" title="Colors">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {colorTokens.map(({ name, token, hex }) => (
          <div key={token} className="flex flex-col gap-2">
            <div
              className="aspect-square rounded-md border border-border shadow-sm"
              style={{ backgroundColor: hex }}
            />
            <div>
              <p className="text-sm font-medium">{name}</p>
              <p className="font-mono text-xs text-ink-subtle">{hex}</p>
              <p className="font-mono text-xs text-ink-subtle">--{token}</p>
            </div>
          </div>
        ))}
      </div>
    </SwatchSection>
  );
}
