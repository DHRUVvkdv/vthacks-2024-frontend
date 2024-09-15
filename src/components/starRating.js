import React from 'react';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`text-lg ${
            index < fullStars
              ? 'text-orange-400'
              : index === fullStars && hasHalfStar
              ? 'text-orange-400'
              : 'text-gray-300'
          }`}
        >
          {index < fullStars ? '★' : index === fullStars && hasHalfStar ? '½' : '☆'}
        </span>
      ))}
    </div>
  );
};

export default StarRating;