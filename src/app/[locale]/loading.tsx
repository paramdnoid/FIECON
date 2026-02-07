export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status">
      <div className="w-8 h-8 border-2 border-beige-400 border-t-bordeaux-900 rounded-full animate-spin" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
