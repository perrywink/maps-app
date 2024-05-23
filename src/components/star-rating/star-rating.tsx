import { Star, StarHalf } from "lucide-react";
import { toast } from "sonner";

interface Props {
  rating: number,
}

export function StarRating({rating}: Props) {
  if (rating < 0 || rating > 5) {
    toast("Invalid rating encountered.🤔")
    return <></>
  }

  const numFullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className="relative">
      <div className="flex gap-1">
        {
          Array.from({length: 5}).map((_, idx) => (
            <Star key={idx} className="w-5 h-5 text-muted-foreground" />
          ))
        }
      </div>
      <div className="flex gap-1 absolute top-0">
        {
          Array.from({length: numFullStars}).map((_, idx) => (
            <Star key={idx} className="w-5 h-5 fill-primary" />
          ))
        }
        {
          hasHalfStar && <StarHalf className="w-5 h-5 fill-primary" />
        }
      </div>
    </div>
    
  )
}