import PlayingCard from "./PlayingCard";

export default function FlopDisplay({ cards }: { cards: string[] }) {
  return (
    <div className="flex items-center gap-2">
      {cards.map((card) => (
        <PlayingCard key={card} code={card} />
      ))}
    </div>
  );
}
