import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Brain, Upload, Send, FileText, Youtube, Clock, MessageCircle, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import Footer from './Footer';
import LogoutModal from './LogoutModal';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const MAX_UPLOADS = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ChatPage = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const { toast } = useToast();
  
  // State management
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [uploads, setUploads] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeUpload, setActiveUpload] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadOptions, setUploadOptions] = useState({
    pdf: false,
    docx: false,
    youtube: false
  });
  const [uploadData, setUploadData] = useState({
    file: null,
    youtubeUrl: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  // Initialize session data
  useEffect(() => {
    const startTime = localStorage.getItem('startTime');
    const endTime = localStorage.getItem('endTime');
    
    if (!startTime || !endTime) {
      navigate('/');
      return;
    }

    const now = new Date().getTime();
    const remaining = Math.max(0, Math.floor((parseInt(endTime) - now) / 1000));
    setTimeRemaining(remaining);

    // Load existing uploads and count
    const existingUploads = JSON.parse(localStorage.getItem('uploads_array') || '[]');
    const existingCount = parseInt(localStorage.getItem('upload_count') || '0');
    setUploads(existingUploads);
    setUploadCount(existingCount);

    // Load existing chat history
    const existingHistory = JSON.parse(localStorage.getItem('response_array') || '[]');
    setChatHistory(existingHistory);

    // Set active upload if exists
    if (existingUploads.length > 0) {
      const lastActive = localStorage.getItem('active_upload');
      const activeUploadData = lastActive ? existingUploads.find(u => u.upload_no === lastActive) : existingUploads[0];
      setActiveUpload(activeUploadData || existingUploads[0]);
    }
  }, [navigate]);

  // Timer countdown with logout
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Show logout modal and then redirect
          setShowLogoutModal(true);
          setTimeout(() => {
            localStorage.clear();
            navigate('/');
          }, 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFileSize = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `File size must be less than ${formatFileSize(MAX_FILE_SIZE)}. Your file is ${formatFileSize(file.size)}.`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateUploadLimit = () => {
    if (uploadCount >= MAX_UPLOADS) {
      toast({
        title: "Upload limit reached",
        description: `You can only upload ${MAX_UPLOADS} files per session.`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleUploadSubmit = async () => {
    if (!validateUploadLimit()) return;

    setIsUploading(true);
    
    try {
      let response;
      let uploadInfo = {};
      
      if (uploadOptions.pdf && uploadData.file) {
        if (!validateFileSize(uploadData.file)) {
          setIsUploading(false);
          return;
        }
        
        const formData = new FormData();
        formData.append('file', uploadData.file);
        
        response = await axios.post(`${BACKEND_URL}/upload/file`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        uploadInfo = {
          file_name: uploadData.file.name,
          type: 'pdf',
          upload_time: new Date().toISOString(),
          size: uploadData.file.size
        };
      } else if (uploadOptions.docx && uploadData.file) {
        if (!validateFileSize(uploadData.file)) {
          setIsUploading(false);
          return;
        }
        
        const formData = new FormData();
        formData.append('file', uploadData.file);
        
        response = await axios.post(`${BACKEND_URL}/upload/file`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        uploadInfo = {
          file_name: uploadData.file.name,
          type: 'docx',
          upload_time: new Date().toISOString(),
          size: uploadData.file.size
        };
      } else if (uploadOptions.youtube && uploadData.youtubeUrl) {
        response = await axios.post(`${BACKEND_URL}/upload/youtube`, {
          url: uploadData.youtubeUrl
        });
        
        uploadInfo = {
          video_name: `YouTube Video - ${new Date().toLocaleTimeString()}`,
          type: 'youtube',
          upload_time: new Date().toISOString(),
          url: uploadData.youtubeUrl
        };
      }

      const newUpload = {
        upload_no: response.data.upload_no,
        ...uploadInfo
      };

      const updatedUploads = [newUpload, ...uploads];
      const newCount = uploadCount + 1;
      
      setUploads(updatedUploads);
      setUploadCount(newCount);
      localStorage.setItem('uploads_array', JSON.stringify(updatedUploads));
      localStorage.setItem('upload_count', newCount.toString());
      
      // Set as active upload
      setActiveUpload(newUpload);
      localStorage.setItem('active_upload', newUpload.upload_no);
      
      toast({
        title: "Upload successful",
        description: `${uploadInfo.file_name || uploadInfo.video_name} has been uploaded and is ready for chat.`,
      });
      
      setIsUploadModalOpen(false);
      setUploadOptions({ pdf: false, docx: false, youtube: false });
      setUploadData({ file: null, youtubeUrl: '' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.response?.data?.error || "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeUpload || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    // Add user message immediately
    const tempHistory = [...chatHistory, {
      userMessage,
      botMessage: '',
      timestamp: new Date().toISOString(),
      isLoading: true
    }];
    setChatHistory(tempHistory);

    try {
      const response = await axios.post(`${BACKEND_URL}/ask`, {
        question: userMessage,
        upload_no: activeUpload.upload_no
      });
      
      // Update with bot response
      const finalMessage = {
        userMessage,
        botMessage: response.data.answer,
        clarifiedQuestion: response.data.clarified_question,
        timestamp: new Date().toISOString(),
        isLoading: false
      };

      const finalHistory = [...chatHistory, finalMessage];
      setChatHistory(finalHistory);
      localStorage.setItem('response_array', JSON.stringify(finalHistory));
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        userMessage,
        botMessage: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        isLoading: false,
        isError: true
      };
      const errorHistory = [...chatHistory, errorMessage];
      setChatHistory(errorHistory);
      
      toast({
        title: "Chat error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = (upload) => {
    setActiveUpload(upload);
    localStorage.setItem('active_upload', upload.upload_no);
    
    // Clear current chat for new upload context
    setChatHistory([]);
    localStorage.setItem('response_array', JSON.stringify([]));
    
    toast({
      title: "Upload selected",
      description: `Now chatting with ${upload.file_name || upload.video_name}`,
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-6 border-b border-gray-700/50 backdrop-blur-sm bg-gray-900/50"
        >
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              RecallAI
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-400">
              {uploadCount}/{MAX_UPLOADS} uploads used
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border ${
              timeRemaining < 300 ? 'border-orange-500/50' : 'border-gray-700'
            }`}>
              <Clock className={`w-5 h-5 ${timeRemaining < 300 ? 'text-orange-400' : 'text-orange-400'}`} />
              <span className={`font-mono text-lg ${timeRemaining < 300 ? 'text-orange-400' : ''}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-1">
          {/* Left Sidebar - Uploads */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 bg-gray-800/30 border-r border-gray-700/50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-cyan-400">Uploads</h2>
                <Button
                  onClick={() => setIsUploadModalOpen(true)}
                  size="sm"
                  disabled={uploadCount >= MAX_UPLOADS}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add Upload
                </Button>
              </div>
              {uploadCount >= MAX_UPLOADS && (
                <div className="text-xs text-orange-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Upload limit reached
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {uploads.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No uploads yet</p>
                  <p className="text-xs">Upload documents to start chatting</p>
                </div>
              )}
              
              <AnimatePresence>
                {uploads.map((upload, index) => (
                  <motion.div
                    key={upload.upload_no}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleUploadClick(upload)}
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer group ${
                      activeUpload?.upload_no === upload.upload_no
                        ? 'bg-cyan-500/20 border-cyan-500/50'
                        : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-gray-700 group-hover:bg-gray-600 transition-colors">
                        {upload.type === 'youtube' ? (
                          <Youtube className="w-5 h-5 text-red-400" />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {upload.file_name || upload.video_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-400">
                            {new Date(upload.upload_time).toLocaleTimeString()}
                          </p>
                          {upload.size && (
                            <span className="text-xs text-gray-500">
                              • {formatFileSize(upload.size)}
                            </span>
                          )}
                        </div>
                        {activeUpload?.upload_no === upload.upload_no && (
                          <div className="flex items-center gap-1 mt-2">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            <span className="text-xs text-green-400">Active</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeUpload ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                    <MessageCircle className="w-5 h-5 text-cyan-400" />
                    <span className="text-cyan-400 font-medium">
                      Chatting with: {activeUpload.file_name || activeUpload.video_name}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Upload a document to start chatting</p>
                  <p className="text-gray-500 text-sm mt-2">PDF, DOCX files or YouTube links supported</p>
                </div>
              )}

              <AnimatePresence>
                {chatHistory.map((chat, index) => (
                  <div key={index} className="space-y-4">
                    {/* User Message */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-end"
                    >
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-2xl rounded-tr-md max-w-md shadow-lg">
                        <p>{chat.userMessage}</p>
                      </div>
                    </motion.div>

                    {/* Bot Message */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex justify-start"
                    >
                      <div className={`border p-4 rounded-2xl rounded-tl-md max-w-2xl shadow-lg ${
                        chat.isError 
                          ? 'bg-red-900/20 border-red-500/50' 
                          : 'bg-gray-800 border-gray-700'
                      }`}>
                        {chat.isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                            <span className="text-gray-400">Thinking...</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className={`leading-relaxed ${
                              chat.isError ? 'text-red-300' : 'text-gray-200'
                            }`}>
                              {chat.botMessage}
                            </p>
                            {chat.clarifiedQuestion && chat.clarifiedQuestion !== chat.userMessage && (
                              <div className="text-xs text-gray-500 border-t border-gray-700 pt-2 mt-2">
                                <span className="font-medium">Clarified: </span>
                                {chat.clarifiedQuestion}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            {activeUpload && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border-t border-gray-700/50 bg-gray-800/30"
              >
                <div className="flex gap-3">
                  <Input
                    placeholder="Ask a question about the uploaded content..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <Footer />
      </div>

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-cyan-400 flex items-center justify-between">
              Add New Upload
              <span className="text-sm text-gray-400 font-normal">
                {uploadCount}/{MAX_UPLOADS}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-300">Select upload type:</p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pdf"
                    checked={uploadOptions.pdf}
                    onCheckedChange={(checked) => 
                      setUploadOptions(prev => ({ ...prev, pdf: checked, docx: false, youtube: false }))
                    }
                  />
                  <label htmlFor="pdf" className="text-sm text-gray-300">
                    PDF Document <span className="text-gray-500">(max {formatFileSize(MAX_FILE_SIZE)})</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="docx"
                    checked={uploadOptions.docx}
                    onCheckedChange={(checked) => 
                      setUploadOptions(prev => ({ ...prev, docx: checked, pdf: false, youtube: false }))
                    }
                  />
                  <label htmlFor="docx" className="text-sm text-gray-300">
                    DOCX Document <span className="text-gray-500">(max {formatFileSize(MAX_FILE_SIZE)})</span>
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="youtube"
                    checked={uploadOptions.youtube}
                    onCheckedChange={(checked) => 
                      setUploadOptions(prev => ({ ...prev, youtube: checked, pdf: false, docx: false }))
                    }
                  />
                  <label htmlFor="youtube" className="text-sm text-gray-300">YouTube Link</label>
                </div>
              </div>
            </div>

            {(uploadOptions.pdf || uploadOptions.docx) && (
              <div>
                <Input
                  type="file"
                  accept={uploadOptions.pdf ? ".pdf" : ".docx"}
                  onChange={(e) => setUploadData(prev => ({ ...prev, file: e.target.files[0] }))}
                  className="bg-gray-800 border-gray-600"
                />
                {uploadData.file && (
                  <p className="text-xs text-gray-400 mt-2">
                    File size: {formatFileSize(uploadData.file.size)}
                    {uploadData.file.size > MAX_FILE_SIZE && (
                      <span className="text-red-400 ml-2">• Too large!</span>
                    )}
                  </p>
                )}
              </div>
            )}

            {uploadOptions.youtube && (
              <div>
                <Input
                  placeholder="Enter YouTube URL"
                  value={uploadData.youtubeUrl}
                  onChange={(e) => setUploadData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsUploadModalOpen(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUploadSubmit}
                disabled={
                  (!uploadOptions.pdf && !uploadOptions.docx && !uploadOptions.youtube) ||
                  ((uploadOptions.pdf || uploadOptions.docx) && (!uploadData.file || uploadData.file.size > MAX_FILE_SIZE)) ||
                  (uploadOptions.youtube && !uploadData.youtubeUrl) ||
                  isUploading ||
                  uploadCount >= MAX_UPLOADS
                }
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  'Upload'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Modal */}
      <LogoutModal isOpen={showLogoutModal} />
    </>
  );
};

export default ChatPage;