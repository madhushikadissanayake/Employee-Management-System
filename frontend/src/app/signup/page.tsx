'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, ArrowLeft } from 'lucide-react';
import SignupForm from '../../components/SignupForm';
import { useAuth } from '../../hooks/useAuth';
import { SignupFormData } from '../../types/auth';
import toast, { Toaster } from 'react-hot-toast';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { signup, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSignup = async (formData: Omit<SignupFormData, 'confirmPassword'>) => {
    setIsLoading(true);
    try {
      await signup(formData);
      toast.success('Account created successfully! Welcome to EMS.');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="flex justify-center items-center mb-6">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </h2>
        <p className="text-center text-sm text-gray-600">
          Join our Employee Management System
        </p>
      </div>

      {/* Signup Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          © 2025 Employee Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}