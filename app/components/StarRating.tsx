'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  disabled = false, 
  size = 'md',
  showLabel = true 
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Rate this tutorial';
    }
  };

  const handleStarClick = (starRating: number) => {
    if (!disabled) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!disabled) {
      setHoveredRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoveredRating(0);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div 
        className="flex space-x-1"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hoveredRating || rating);
          const isHovered = star === hoveredRating;
          
          return (
            <motion.button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              className={`${sizeClasses[size]} transition-colors ${
                disabled 
                  ? 'cursor-not-allowed' 
                  : 'cursor-pointer hover:scale-110'
              }`}
              whileHover={!disabled ? { scale: 1.1 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
            >
              <Star
                className={`transition-colors ${
                  isFilled
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 hover:text-yellow-200'
                } ${
                  isHovered && !disabled
                    ? 'drop-shadow-lg'
                    : ''
                }`}
              />
            </motion.button>
          );
        })}
      </div>
      
      {showLabel && (
        <motion.p 
          className="text-sm text-gray-600 font-medium"
          key={hoveredRating || rating}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {getRatingText(hoveredRating || rating)}
        </motion.p>
      )}
    </div>
  );
}
