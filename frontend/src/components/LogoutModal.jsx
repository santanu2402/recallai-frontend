import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from './ui/dialog';
import { Brain, Clock, Sparkles } from 'lucide-react';

const LogoutModal = ({ isOpen, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={() => {}}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md" hideCloseButton>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="text-center py-6"
            >
              {/* Icon with animation */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="relative">
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(34, 211, 238, 0.3)",
                        "0 0 40px rgba(34, 211, 238, 0.6)",
                        "0 0 20px rgba(34, 211, 238, 0.3)",
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Brain className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  {/* Animated sparkles */}
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute -bottom-1 -left-1"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  >
                    <Clock className="w-5 h-5 text-orange-400" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
              >
                Session Complete!
              </motion.h2>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3 mb-8"
              >
                <p className="text-xl font-semibold text-white">
                  Thanks for using RecallAI
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Your 30-minute AI-powered session has ended. All your data has been securely cleared from our systems.
                </p>
              </motion.div>

              {/* Auto-redirect notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-cyan-400 border-r-transparent rounded-full"
                  />
                  <span className="text-sm text-gray-300">
                    Redirecting to homepage in 3 seconds...
                  </span>
                </div>
              </motion.div>

              {/* Background decoration */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                  className="absolute top-4 left-4 w-2 h-2 bg-cyan-400/30 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                  className="absolute bottom-6 right-6 w-3 h-3 bg-blue-500/30 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                />
                <motion.div
                  className="absolute top-1/2 right-4 w-1 h-1 bg-purple-500/40 rounded-full"
                  animate={{
                    y: [-5, 5, -5],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                />
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;