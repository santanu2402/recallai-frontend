import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Code } from 'lucide-react';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="relative z-10 py-6 px-6 border-t border-gray-700/30 bg-gray-900/20 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-gray-400"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center gap-2">
            <span>Built and generated with</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Heart className="w-4 h-4 text-red-400 fill-current" />
            </motion.div>
            <span>by</span>
            <motion.span
              className="font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.1 }}
            >
              santanu
            </motion.span>
          </div>
          
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="hidden sm:inline">•</span>
            <span>for code visit</span>
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600 transition-all duration-200 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              <Code className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
              <span className="text-gray-300 group-hover:text-white transition-colors font-medium">
                GitHub
              </span>
            </motion.a>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="mt-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 text-xs text-gray-500">
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
            <span>Powered by AI • RecallAI v1.0</span>
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;