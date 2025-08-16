# RecallAI - Frontend-Backend Integration Contracts

## API Contracts

### 1. File Upload Endpoint
**URL**: `POST /api/upload/file`
**Content-Type**: `multipart/form-data`
**Request Body**:
```
file: File (PDF or DOCX)
```
**Response**:
```json
{
  "upload_no": "uuid-string"
}
```

### 2. YouTube Upload Endpoint  
**URL**: `POST /api/upload/youtube`
**Content-Type**: `application/json`
**Request Body**:
```json
{
  "url": "https://youtube.com/watch?v=..."
}
```
**Response**:
```json
{
  "upload_no": "uuid-string"
}
```

### 3. Chat/Ask Endpoint
**URL**: `POST /api/ask`
**Content-Type**: `application/json`
**Request Body**:
```json
{
  "question": "user question string",
  "upload_no": "uuid-string"
}
```
**Response**:
```json
{
  "clarified_question": "processed question",
  "answer": "AI response"
}
```

## Current Mock Data to Replace

### Mock Uploads (utils/mock.js)
Currently using:
```javascript
mockUploads = [
  {
    upload_no: "mock-upload-1",
    file_name: "AI Research Paper.pdf", 
    upload_time: ISO_STRING,
    type: "pdf"
  },
  // ... more mock uploads
]
```

**Backend Integration**: Replace `simulateUploadResponse()` calls with actual API calls to `/api/upload/file` and `/api/upload/youtube`

### Mock Chat Responses (utils/mock.js)
Currently using:
```javascript
mockChatResponses = {
  "upload-id": [
    {
      userMessage: "question",
      botMessage: "response", 
      timestamp: ISO_STRING
    }
  ]
}
```

**Backend Integration**: Replace `simulateChatResponse()` calls with actual API calls to `/api/ask`

## Backend Implementation Requirements

### 1. Convert Flask to FastAPI
- Migrate existing Flask endpoints to FastAPI with `/api` prefix
- Maintain same request/response formats
- Add proper CORS configuration
- Add error handling and validation

### 2. MongoDB Integration
- Store uploaded documents and their processed chunks
- Store chat history per session
- Implement cleanup after 30 minutes

### 3. Required Environment Variables
- `GROQ_API_KEY`: For AI responses
- Any other required API keys for document processing

## Frontend-Backend Integration Changes

### 1. Remove Mock Dependencies
**Files to Update**:
- `ChatPage.jsx`: Replace `simulateUploadResponse` and `simulateChatResponse` with actual API calls
- Remove imports from `utils/mock.js`

### 2. API Integration Points
**Upload Functionality**:
```javascript
// Replace in ChatPage.jsx handleUploadSubmit()
const formData = new FormData();
formData.append('file', uploadData.file);
const response = await axios.post(`${API}/upload/file`, formData);
```

**Chat Functionality**: 
```javascript  
// Replace in ChatPage.jsx handleSendMessage()
const response = await axios.post(`${API}/ask`, {
  question: userMessage,
  upload_no: activeUpload.upload_no
});
```

### 3. Error Handling
- Add proper error states for failed uploads
- Add network error handling for chat requests
- Show user-friendly error messages

### 4. Loading States  
- Upload progress indicators
- Chat response loading animations
- Proper disabled states during API calls

## Session Management
- Frontend handles 30-minute timer and localStorage cleanup
- Backend cleanup runs independently every 30 minutes
- No session persistence across page refreshes (by design)

## File Storage
- Backend stores temporary files in `/tmp`
- Files automatically cleaned up after 30 minutes
- No permanent file storage required