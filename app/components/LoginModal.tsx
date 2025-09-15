'use client';
import { useState } from 'react';
import { X, Mail, Lock, User, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import VerificationModal from './VerificationModal';
import ForgotPasswordModal from './ForgotPasswordModal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [showResendOption, setShowResendOption] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setShowResendOption(false);

    // Determine if input is email or username
    const isEmail = emailOrUsername.includes('@');
    const loginData = isEmail 
      ? { email: emailOrUsername, password }
      : { username: emailOrUsername, password };

    const result = await login(loginData);
    
    if (result.success) {
      onClose();
      setEmailOrUsername('');
      setPassword('');
    } else {
      setError(result.error || 'Invalid email/username or password');
      // Check if the error indicates unconfirmed user
      if (result.error && (
        result.error.includes('not confirmed') || 
        result.error.includes('UserNotConfirmedException') ||
        result.error.includes('Please confirm your email address')
      )) {
        setShowResendOption(true);
      }
    }
    
    setIsLoading(false);
  };

  const handleResendVerification = async () => {
    if (!emailOrUsername.includes('@')) {
      setError('Please enter your email address to resend verification');
      return;
    }

    setIsResending(true);
    setError('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailOrUsername }),
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        alert('Verification code sent! Please check your email.');
      } else {
        setError(data.error || 'Failed to resend verification code');
      }
    } catch (err) {
      setError('Failed to resend verification code');
    }

    setIsResending(false);
  };

  const handleConfirmEmail = () => {
    if (!emailOrUsername.includes('@')) {
      setError('Please enter your email address to confirm');
      return;
    }
    setShowVerificationModal(true);
  };

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false);
    setShowResendOption(false);
    setError('');
    alert('Email confirmed successfully! You can now log in.');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Login</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="emailOrUsername"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Enter Email"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aws-orange focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="mb-6 text-right">
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-sm text-aws-orange hover:text-aws-orange-dark font-medium"
              >
                Forgot your password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full aws-button flex items-center justify-center py-3"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <User className="h-5 w-5 mr-2" />
                  Login
                </>
              )}
            </button>

            {showResendOption && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 mb-3">
                  Your email is not confirmed. Please check your email for a verification code.
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleConfirmEmail}
                    className="w-full flex items-center justify-center py-2 px-4 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-sm font-medium transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="w-full flex items-center justify-center py-2 px-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-sm font-medium transition-colors"
                  >
                    {isResending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Resend Verification Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Demo credentials:</p>
              <p className="font-mono text-xs mt-1">
                admin@example.com / OAQsaQ1fn3!b
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Password requirements: minimum 6 characters
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-aws-orange hover:text-aws-orange-dark font-medium"
                  >
                    Create one
                  </button>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showVerificationModal && (
        <VerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          email={emailOrUsername}
          onVerificationSuccess={handleVerificationSuccess}
        />
      )}

      {showForgotPasswordModal && (
        <ForgotPasswordModal
          isOpen={showForgotPasswordModal}
          onClose={() => setShowForgotPasswordModal(false)}
          onBackToLogin={() => setShowForgotPasswordModal(false)}
        />
      )}
    </>
  );
} 