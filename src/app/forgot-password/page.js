"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/api/forgot-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setShowError(false);
        setTimeout(() => {
          setShowSuccess(false);
          router.push('/login');
        }, 3000);
      } else {
        setShowError(true);
        setShowSuccess(false);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setShowError(true);
      setShowSuccess(false);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg p-8 border border-teal-100"
      >
        <Link
          href="/login"
          className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to Login
        </Link>

        <div className="text-center">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-3xl font-semibold text-teal-700 mb-2"
          >
            Forgot Password?
          </motion.h2>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-sm text-teal-600"
          >
            Enter your email to reset your password
          </motion.p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-teal-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border border-teal-200 placeholder-teal-400 text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm bg-teal-50"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
            >
              Reset Password
            </button>
          </motion.div>
        </form>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="mt-4 p-3 rounded-md bg-green-50 border border-green-200"
            >
              <div className="text-center text-green-600 font-medium">
                Password reset link has been sent to your email
              </div>
              <div className="text-center text-green-500 text-sm mt-1">
                Redirecting to login page...
              </div>
            </motion.div>
          )}
          {showError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="mt-4 p-3 rounded-md bg-red-50 border border-red-200"
            >
              <div className="text-center text-red-600 font-medium">
                Email not found
              </div>
              <div className="text-center text-red-500 text-sm mt-1">
                Please check your email and try again
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="text-center text-sm text-gray-500 mt-4"
        >
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-teal-600 hover:text-teal-500"
          >
            Sign in here
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Loading animation for success redirect */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 right-8"
          >
            <motion.div
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-8 h-8 border-t-2 border-teal-500 border-solid rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForgotPassword;