export function ChatIndicator() {
  return (
    <div className="flex items-center space-x-1 p-4 bg-white/10 rounded-ee-none rounded-2xl w-fit">
      <span className="sr-only">Loading...</span>
      <div className="flex space-x-1">
        {Array.from({ length: 3 }).map((_, idx) => (
          <span
            key={idx}
            className="size-2 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: `${idx * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
