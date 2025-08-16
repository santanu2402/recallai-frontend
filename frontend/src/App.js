import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ChatPage from './components/ChatPage';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;