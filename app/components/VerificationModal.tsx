'use client';
import { useState } from 'react';
import { X, Mail, CheckCircle } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess: () => void;
}

export default function VerificationModal({ isOpen, onClose, email, onVerificationSuccess }: VerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/confirm-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          confirmationCode: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Verification successful
        onVerificationSuccess();
        onClose();
        setVerificationCode('');
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }

    setIsLoading(false);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setError('Verification code resent! Please check your email.');
      } else {
        // Handle specific error cases
        if (data.error && data.error.includes('already confirmed')) {
          setError('Your account is already verified. You can now log in.');
        } else if (data.error && data.error.includes('Cannot resend codes')) {
          setError('Please wait a moment before requesting another code, or try logging in if you\'ve already verified your account.');
        } else {
          setError(data.error || 'Failed to resend verification code. Please try again later.');
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }

    setIsResending(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Verify Your Email</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <Mail className="h-12 w-12 text-aws-orange mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Check your email
            </h3>
            <p className="text-gray-600">
              We've sent a verification code to:
            </p>
            <p className="font-medium text-gray-900 mt-1">{email}</p>
          </div>

          {error && (
            <div className={`mb-4 p-3 rounded ${
              error.includes('resent') 
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900 placeholder-gray-500 text-center text-lg tracking-widest"
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                pattern="[0-9]{6}"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full aws-button flex items-center justify-center py-3 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Verify Email
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-aws-orange hover:text-aws-orange-dark font-medium text-sm disabled:opacity-50"
            >
              {isResending ? 'Resending...' : 'Resend verification code'}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              The verification code will expire in 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
