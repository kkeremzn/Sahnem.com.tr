import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  showValue?: boolean;
  count?: number;
}

export function StarRating({ rating, size = 14, showValue = false, count }: StarRatingProps) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex items-center gap-0.5 text-gold">
        {Array.from({ length: 5 }, (_, i) => {
          if (i < full) return <Star key={i} size={size} fill="currentColor" strokeWidth={0} />;
          if (i === full && hasHalf) return <StarHalf key={i} size={size} fill="currentColor" strokeWidth={0} />;
          return <Star key={i} size={size} className="text-border" fill="currentColor" strokeWidth={0} />;
        })}
      </span>
      {showValue && <span className="text-sm font-medium text-text">{rating.toFixed(1)}</span>}
      {count !== undefined && <span className="text-sm text-text-faint">({count})</span>}
    </span>
  );
}
