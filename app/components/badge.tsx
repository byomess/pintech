export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
      {children}
    </span>
  );
}