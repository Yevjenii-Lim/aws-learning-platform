'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Heart, 
  HeartOff, 
  Trash2, 
  Edit3,
  User,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

interface Comment {
  id: string;
  tutorialId: string;
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  replies: Comment[];
}

interface CommentsProps {
  tutorialId: string;
}

export default function Comments({ tutorialId }: CommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tutorials/${tutorialId}/comments`);
      const result = await response.json();
      
      if (result.success) {
        setComments(result.data);
      } else {
        setError('Failed to load comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [tutorialId]);

  // Add new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to comment');
      return;
    }

    if (!newComment.trim()) {
      setError('Please enter a comment');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`/api/tutorials/${tutorialId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      const result = await response.json();

      if (result.success) {
        setComments(prev => [result.data, ...prev]);
        setNewComment('');
      } else {
        setError(result.error || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!user) {
      setError('Please log in to delete comments');
      return;
    }

    try {
      setDeleting(commentId);
      setError(null);
      setShowDeleteModal(null);

      const response = await fetch(`/api/tutorials/${tutorialId}/comments`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId }),
      });

      const result = await response.json();

      if (result.success) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      } else {
        setError(result.error || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment');
    } finally {
      setDeleting(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-aws-orange" />
            Comments ({comments.length})
          </h3>
        </div>
      </div>

      {/* Comment Form */}
      {user && (
        <div className="p-6 border-b border-gray-200">
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this tutorial..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aws-orange focus:border-transparent resize-none"
                rows={3}
                maxLength={1000}
                disabled={submitting}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {newComment.length}/1000 characters
                </span>
                {error && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {error}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="flex items-center px-4 py-2 bg-aws-orange text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Comments List */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aws-orange mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start space-x-3">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-aws-orange text-white rounded-full flex items-center justify-center font-medium text-sm">
                        {getUserInitials(comment.userName)}
                      </div>
                    </div>

                    {/* Comment Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">
                          {comment.userName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                        {comment.updatedAt !== comment.createdAt && (
                          <span className="text-xs text-gray-400">(edited)</span>
                        )}
                      </div>
                      
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {comment.content}
                      </p>

                      {/* Comment Actions */}
                      <div className="flex items-center space-x-4 mt-3">
                        <button
                          className="flex items-center text-sm text-gray-500 hover:text-aws-orange transition-colors"
                          onClick={() => {
                            // TODO: Implement like functionality
                            console.log('Like comment:', comment.id);
                          }}
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          {comment.likes.length} {comment.likes.length === 1 ? 'like' : 'likes'}
                        </button>
                        
                        {user && (comment.userId === user.id || user.role === 'admin') && (
                          <button
                            className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                            onClick={() => setShowDeleteModal(comment.id)}
                            disabled={deleting === comment.id}
                          >
                            {deleting === comment.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Login Prompt */}
      {!user && (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="text-center">
            <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-3">
              Please log in to leave a comment and join the discussion.
            </p>
            <button
              onClick={() => {
                // TODO: Open login modal
                console.log('Open login modal');
              }}
              className="px-4 py-2 bg-aws-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Log In to Comment
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🗑️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Comment</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this comment? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteComment(showDeleteModal)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
