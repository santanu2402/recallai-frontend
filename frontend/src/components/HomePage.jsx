import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, Lock } from 'lucide-react';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartSession = () => {
    setIsModalOpen(true);
    setError('');
    setCode('');
  };

  const handleCodeSubmit = async () => {
    setIsLoading(true);
    setError('');

    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (code.toLowerCase().trim() === 'santanu') {
      // Set session timing
      const startTime = new Date().getTime();
      const endTime = startTime + (30 * 60 * 1000); // 30 minutes
      
      localStorage.setItem('startTime', startTime.toString());
      localStorage.setItem('endTime', endTime.toString());
      localStorage.setItem('uploads_array', JSON.stringify([]));
      localStorage.setItem('response_array', JSON.stringify([]));
      
      setIsModalOpen(false);
      navigate('/chat');
    } else {
      setError('Invalid code. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="text-center z-10 max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Brain className="w-12 h-12 text-cyan-400" />
            <motion.h1
              className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              RecallAI
            </motion.h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-300 mb-8 leading-relaxed"
          >
            Unlock the power of AI-driven document analysis and intelligent conversations.
            <br />
            <span className="text-cyan-400 font-medium">Upload. Ask. Discover.</span>
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Button
            onClick={handleStartSession}
            className="group relative px-8 py-4 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
          >
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5" />
              Start Session
              <motion.div
                className="w-2 h-2 bg-white rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 text-sm text-gray-500"
        >
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Secure 30-minute AI-powered sessions
          </div>
        </motion.div>
      </div>

      {/* Code Verification Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-center text-cyan-400">
                  Access Code Required
                </DialogTitle>
              </DialogHeader>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4 pt-4"
              >
                <div className="text-center text-gray-300 text-sm mb-6">
                  Enter your access code to begin your AI session
                </div>
                
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Enter access code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleCodeSubmit()}
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-sm"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCodeSubmit}
                    disabled={!code.trim() || isLoading}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-r-transparent rounded-full"
                      />
                    ) : (
                      'Verify'
                    )}
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;