type PlayingCardProps = {
  code: string;
  small?: boolean;
};

const suitConfig: Record<string, { symbol: string; color: string }> = {
  s: { symbol: "♠", color: "text-slate-900" },
  h: { symbol: "♥", color: "text-red-600" },
  d: { symbol: "♦", color: "text-blue-600" },
  c: { symbol: "♣", color: "text-emerald-700" },
};

export default function PlayingCard({ code, small = false }: PlayingCardProps) {
  const rank = code[0] ?? "?";
  const suit = code[1] ?? "s";
  const cfg = suitConfig[suit] ?? suitConfig.s;

  return (
    <div
      className={`inline-flex flex-col justify-between rounded-lg border border-zinc-300 bg-white shadow-sm ${
        small ? "h-12 w-9 p-1.5" : "h-16 w-12 p-2"
      }`}
    >
      <span className={`font-bold leading-none ${small ? "text-xs" : "text-sm"} ${cfg.color}`}>
        {rank}
      </span>

      <span className={`self-end leading-none ${small ? "text-base" : "text-xl"} ${cfg.color}`}>
        {cfg.symbol}
      </span>
    </div>
  );
}
