interface PlatformToggleProps {
  label: string;
  enabled: boolean;
  color: string;
  onToggle: () => void;
}

export default function PlatformToggle({ label, enabled, color, onToggle }: PlatformToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-border-hover cursor-pointer"
      style={enabled ? { borderColor: color, backgroundColor: `color-mix(in oklch, ${color} 10%, transparent)` } : undefined}
    >
      <div
        className="relative h-5 w-9 rounded-full transition-colors"
        style={{ backgroundColor: enabled ? color : "oklch(0.28 0.005 260)" }}
      >
        <div
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform"
          style={{ transform: enabled ? "translateX(16px)" : "translateX(2px)" }}
        />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
