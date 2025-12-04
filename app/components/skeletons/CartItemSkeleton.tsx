// CartItemCard Skeleton for loading states
export function CartItemCardSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center justify-between py-3 border-b animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg animate-pulse">
      <div className="w-24 h-24 bg-gray-200 rounded"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="flex items-center gap-4">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}