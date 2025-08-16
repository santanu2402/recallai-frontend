// Mock data for RecallAI frontend development

export const mockUploads = [
  {
    upload_no: "mock-upload-1",
    file_name: "AI Research Paper.pdf",
    upload_time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    type: "pdf"
  },
  {
    upload_no: "mock-upload-2", 
    file_name: "Machine Learning Basics.docx",
    upload_time: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    type: "docx"
  },
  {
    upload_no: "mock-upload-3",
    video_name: "Introduction to Neural Networks",
    upload_time: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
    type: "youtube"
  }
];

export const mockChatResponses = {
  "mock-upload-1": [
    {
      userMessage: "What is the main conclusion of this paper?",
      botMessage: "Based on the AI research paper, the main conclusion is that transformer architectures have revolutionized natural language processing by providing better context understanding and scalability compared to previous RNN-based models.",
      timestamp: new Date(Date.now() - 1800000).toISOString()
    },
    {
      userMessage: "What are the key technical innovations mentioned?",
      botMessage: "The paper highlights several key innovations: 1) Self-attention mechanisms that allow parallel processing, 2) Positional encoding for sequence understanding, 3) Multi-head attention for capturing different types of relationships, and 4) Layer normalization for training stability.",
      timestamp: new Date(Date.now() - 1200000).toISOString()
    }
  ],
  "mock-upload-2": [
    {
      userMessage: "Can you explain supervised learning?", 
      botMessage: "Supervised learning is a machine learning approach where algorithms learn from labeled training data. The model learns to map inputs to correct outputs by analyzing examples, then makes predictions on new, unseen data. Common types include classification (predicting categories) and regression (predicting continuous values).",
      timestamp: new Date(Date.now() - 900000).toISOString()
    }
  ],
  "mock-upload-3": [
    {
      userMessage: "How do neural networks learn?",
      botMessage: "Neural networks learn through a process called backpropagation. They start with random weights, make predictions, calculate errors, and then adjust weights backward through the network to minimize these errors. This process repeats thousands of times until the network can accurately recognize patterns in the data.",
      timestamp: new Date(Date.now() - 600000).toISOString()
    }
  ]
};

export const simulateUploadResponse = (fileData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const uploadNo = `mock-upload-${Date.now()}`;
      resolve({
        upload_no: uploadNo,
        ...fileData
      });
    }, 1500); // Simulate upload delay
  });
};

export const simulateChatResponse = (question, uploadNo) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = [
        "Based on the uploaded content, here's what I found relevant to your question...",
        "According to the document, this topic is discussed in detail...",
        "The content suggests several key points about your query...",
        "From my analysis of the uploaded material, I can provide the following insights...",
        "The document contains relevant information that addresses your question..."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      resolve({
        clarified_question: question,
        answer: `${randomResponse} ${question.toLowerCase().includes('what') ? 'This involves understanding the core concepts and their practical applications.' : question.toLowerCase().includes('how') ? 'The process involves several steps and methodologies.' : 'This is an important topic that requires careful consideration of multiple factors.'}`
      });
    }, 2000); // Simulate API delay
  });
};