'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, MessageCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import StarRating from './StarRating';

interface TutorialRatingProps {
  tutorialId: string;
  serviceId: string;
}

interface RatingData {
  rating: number;
  totalRatings: number;
  averageRating: number;
  userRating?: number;
}

export default function TutorialRating({ tutorialId, serviceId }: TutorialRatingProps) {
  const { user } = useAuth();
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch rating data
  const fetchRatingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tutorials/${tutorialId}/rating`);
      const result = await response.json();
      
      if (result.success) {
        setRatingData(result.data);
      } else {
        setError('Failed to load rating data');
      }
    } catch (error) {
      console.error('Error fetching rating data:', error);
      setError('Failed to load rating data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatingData();
  }, [tutorialId]);

  // Submit rating
  const handleRatingSubmit = async (rating: number) => {
    if (!user) {
      setError('Please log in to rate this tutorial');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      const response = await fetch(`/api/tutorials/${tutorialId}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });

      const result = await response.json();

      if (result.success) {
        setRatingData(result.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError('Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  // Format rating display
  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  // Get rating color based on value
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-yellow-600';
    if (rating >= 1.5) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-aws-orange"></div>
          <span className="ml-2 text-gray-600">Loading ratings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-500" />
          Rate This Tutorial
        </h3>
        {ratingData && ratingData.totalRatings > 0 && (
          <div className="text-right">
            <div className={`text-2xl font-bold ${getRatingColor(ratingData.averageRating)}`}>
              {formatRating(ratingData.averageRating)}
            </div>
            <div className="text-sm text-gray-500">
              {ratingData.totalRatings} rating{ratingData.totalRatings !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      {/* Rating Display */}
      {ratingData && ratingData.totalRatings > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(ratingData.averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              Average rating: {formatRating(ratingData.averageRating)}/5
            </span>
          </div>
        </div>
      )}

      {/* Rating Input */}
      {user ? (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              {ratingData?.userRating 
                ? `You rated this tutorial ${ratingData.userRating} star${ratingData.userRating !== 1 ? 's' : ''}`
                : 'How would you rate this tutorial?'
              }
            </p>
            
            <StarRating
              rating={ratingData?.userRating || 0}
              onRatingChange={handleRatingSubmit}
              disabled={submitting}
              size="lg"
              showLabel={true}
            />
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Rating submitted successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <div className="flex items-center justify-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <MessageCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-gray-400 mb-2">
            <Star className="h-8 w-8 mx-auto" />
          </div>
          <p className="text-gray-600 mb-3">
            Please log in to rate this tutorial
          </p>
          <button
            onClick={() => {
              // TODO: Open login modal
              console.log('Open login modal');
            }}
            className="px-4 py-2 bg-aws-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Log In to Rate
          </button>
        </div>
      )}

      {/* Rating Stats */}
      {ratingData && ratingData.totalRatings > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{ratingData.totalRatings} total ratings</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              <span>{formatRating(ratingData.averageRating)} average</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
