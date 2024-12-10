import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
  
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, ArrowRight } from 'lucide-react';

const WelcomeModal = ({ setInitialMessage }) => {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // Check if we've already shown the modal in this session
    const hasSeenModal = sessionStorage.getItem('hasSeenWelcomeModal');
    if (hasSeenModal) {
      setOpen(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      // Add exit animation
      setAnimationClass('animate-fadeOut');
      
      // Slight delay to allow animation before closing
      setTimeout(() => {
        sessionStorage.setItem('hasSeenWelcomeModal', 'true');
        sessionStorage.setItem('userName', name.trim());
        setInitialMessage(`Hi ${name}! Welcome to our chat assistant. How can I help you today?`);
        setHasSubmitted(true);
        setOpen(false);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className={`fixed inset-0 w-full h-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center p-0 ${animationClass}`}
        style={{ 
          background: 'linear-gradient(135deg, #0694a2, #3abab4)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="w-full max-w-md mx-auto p-8 bg-white/90 rounded-xl shadow-2xl backdrop-blur-sm">
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-3xl font-bold text-teal-700 mb-2">
              Welcome Aboard!
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-lg">
              Let's personalize your experience
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 p-3 border-2 border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                autoFocus
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
              disabled={!name.trim()}
            >
              Start Chatting <ArrowRight className="ml-2" size={20} />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;