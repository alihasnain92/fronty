"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  Sparkles,
  GraduationCap,
  BookOpen,
  Phone,
  Calendar,
  FileQuestion,
  ArrowRight,
  LogIn,
  Moon,
  Sun,
  Mic,
  MicOff,
  Bell,
  User
} from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Utility function for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Welcome Modal Component
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
        className={`
          ${animationClass} 
          bg-gradient-to-br from-teal-50 to-blue-50 
          dark:from-gray-900 dark:to-gray-800
          flex items-center justify-center
          p-0 overflow-hidden
        `}
      >
        <div className="w-full max-w-md mx-auto p-8 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-2xl backdrop-blur-sm">
          <DialogHeader className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Sparkles 
                className="text-teal-500 dark:text-teal-400" 
                size={48} 
                strokeWidth={1.5} 
              />
            </div>
            <DialogTitle className="text-3xl font-bold text-teal-700 dark:text-teal-300 mb-2">
              Welcome Aboard!
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300 text-lg">
              Let's personalize your experience
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  w-full pl-10 p-3 
                  border-2 border-teal-200 dark:border-teal-700
                  rounded-lg 
                  focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400
                  transition-all duration-300
                  bg-white dark:bg-gray-700
                  text-gray-800 dark:text-gray-100
                "
                autoFocus
              />
            </div>
            
            <Button 
              type="submit" 
              className="
                w-full flex items-center justify-center gap-2 
                bg-teal-600 hover:bg-teal-700 
                dark:bg-teal-700 dark:hover:bg-teal-600
                text-white 
                p-3 rounded-lg 
                transition-all duration-300 ease-in-out 
                transform hover:scale-105 
                disabled:opacity-50
              "
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

// Browser Speech Recognition setup
const SpeechRecognition =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

// Typing Indicator Component
const TypingIndicator = ({ darkMode }) => (
  <div className="flex space-x-2 px-1">
    {[0, 1, 2].map((dot) => (
      <div
        key={dot}
        className={`w-2 h-2 rounded-full ${
          darkMode ? "bg-teal-400" : "bg-teal-600"
        } animate-bounce [animation-delay:-${dot * 0.15}s]`}
      />
    ))}
  </div>
);

// Chat Message Component
// Now it shows the user's name above user messages and "Assistant" above bot messages.
const ChatMessage = ({ message, isUser, darkMode, isTyping, userName }) => (
  <div
    className={cn("mb-4", isUser ? "flex flex-col items-end" : "flex flex-col items-start")}
  >
    <div className="mb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
      {isUser ? userName || "You" : "Assistant"}
    </div>
    <div
      className={cn(
        "max-w-[80%] rounded-xl p-4 shadow-md",
        isUser
          ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-tr-none"
          : darkMode
          ? "bg-gray-800 text-gray-200 rounded-tl-none"
          : "bg-white border border-teal-100 rounded-tl-none"
      )}
    >
      {isTyping ? (
        <TypingIndicator darkMode={darkMode} />
      ) : (
        <p
          className={cn(
            "text-sm leading-relaxed",
            isUser ? "text-white" : darkMode ? "text-gray-200" : "text-gray-700"
          )}
        >
          {message}
        </p>
      )}
    </div>
  </div>
);

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, onClick, darkMode }) => (
  <button
    onClick={() => onClick({ label, icon: Icon })}
    className={cn(
      "flex items-center gap-2 p-3 rounded-lg border transition-all duration-300 w-full",
      darkMode
        ? "border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
        : "border-teal-100 bg-gradient-to-br from-white to-teal-50/30 hover:to-teal-50 text-gray-700 hover:shadow-md hover:border-teal-200"
    )}
    aria-label={label}
  >
    <div
      className={cn(
        "p-1 rounded-md transition-colors",
        darkMode
          ? "bg-gray-700 text-teal-400"
          : "bg-teal-100 text-teal-700 group-hover:bg-teal-200"
      )}
    >
      <Icon className="h-4 w-4" />
    </div>
    <span className="font-medium text-sm">{label}</span>
  </button>
);

// Quick Actions Configuration
const quickActions = [
  {
    icon: BookOpen,
    label: "How to Apply",
    response: "Fetching application process details...",
  },
  {
    icon: GraduationCap,
    label: "Admission Requirements",
    response: "Fetching admission requirements...",
  },
  {
    icon: Calendar,
    label: "Programs Offered",
    response: "Fetching available programs...",
  },
  {
    icon: FileQuestion,
    label: "Financial Information",
    response: "Fetching financial information...",
  },
  {
    icon: Phone,
    label: "Contact Us",
    response: "Fetching contact information...",
  },
];

export default function AssistantLanding() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [querySubmitted, setQuerySubmitted] = useState(false);
  const [initialMessage, setInitialMessage] = useState(null);
  
  // New states related to follow-up logic
  const [responseCount, setResponseCount] = useState(0);
  const [waitingForMoreInfo, setWaitingForMoreInfo] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Store the user's name
  const [userName, setUserName] = useState('');
  useEffect(() => {
    const storedName = sessionStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // Effect for initial welcome message
  useEffect(() => {
    if (initialMessage) {
      setChatMessages([{ text: initialMessage, isUser: false }]);
      setQuerySubmitted(true);
    }
  }, [initialMessage]);

  // Speech Recognition Setup
  useEffect(() => {
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognitionRef.current = recognition;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setMessage(transcript);
      };
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
    } else {
      setError("Speech recognition is not supported in your browser.");
    }

    return () => recognitionRef.current && recognitionRef.current.stop();
  }, []);

  // Ask more info logic
  const maybeAskMoreInfo = () => {
    if (responseCount >= 0) {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { text: "Do you want more information about this?", isUser: false }
      ]);
      setWaitingForMoreInfo(true);
    }
  };

  // Quick Action Handler
  const handleQuickAction = async (action) => {
    if (sessionEnded) return;

    try {
      setQuerySubmitted(true);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { text: `What are the ${action.label.toLowerCase()}?`, isUser: true },
        { isTyping: true, isUser: false }
      ]);

      const response = await fetch("http://127.0.0.1:8000/api/query/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query: action.label }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setTimeout(() => {
        setChatMessages((prevMessages) => {
          const messages = prevMessages.slice(0, -1);
          return [...messages, { text: data.response, isUser: false }];
        });
        // Increase response count after a successful response
        setResponseCount((prev) => prev + 1);
        maybeAskMoreInfo();
        scrollToBottom();
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setChatMessages((prevMessages) => {
        const messages = prevMessages.slice(0, -1);
        return [
          ...messages,
          {
            text: "Sorry, I'm having trouble connecting to the server. Please make sure the backend server is running.",
            isUser: false,
          },
        ];
      });
    }
  };

  // Message Submission Handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || sessionEnded) return;

    // Check if we are waiting for user's yes/no to more info
    if (waitingForMoreInfo) {
      const userResponse = message.trim().toLowerCase();
      setChatMessages([...chatMessages, { text: message, isUser: true }]);
      setMessage("");

      if (userResponse === "yes") {
        // User wants more info, query the backend again
        setWaitingForMoreInfo(false);
        processUserInput("more info");
      } else if (userResponse === "no") {
        // End the session
        setWaitingForMoreInfo(false);
        setSessionEnded(true);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { text: "Okay, have a nice day!", isUser: false }
        ]);
      } else {
        // Invalid response, prompt again
        setWaitingForMoreInfo(true);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { text: "Please say 'yes' or 'no'.", isUser: false }
        ]);
      }

      return;
    }

    // Normal processing if we are not waiting for more info
    processUserInput(message);
  };

  // Process User Input
  const processUserInput = async (input) => {
    if (sessionEnded) return;

    setQuerySubmitted(true);
    setChatMessages((prevMessages) => [...prevMessages, { text: input, isUser: true }]);
    setMessage("");

    try {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { isTyping: true, isUser: false },
      ]);

      const response = await fetch("http://127.0.0.1:8000/api/query/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setTimeout(() => {
        setChatMessages((prevMessages) => {
          const messages = prevMessages.slice(0, -1);
          return [...messages, { text: data.response, isUser: false }];
        });
        // Increase response count after a successful server response
        setResponseCount((prev) => prev + 1);
        maybeAskMoreInfo();
        scrollToBottom();
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setChatMessages((prevMessages) => {
        const messages = prevMessages.slice(0, -1);
        return [
          ...messages,
          {
            text: "Sorry, I'm having trouble connecting to the server. Please make sure the backend server is running.",
            isUser: false,
          },
        ];
      });
    }
  };

  // Toggle Speech Recognition
  const toggleListening = () => {
    if (!isListening && recognitionRef.current) {
      recognitionRef.current.start();
    } else if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Scroll to Bottom of Chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Scroll Effect
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  return (
    <>
      <WelcomeModal setInitialMessage={setInitialMessage} />
      <div
        className={cn(
          "min-h-screen flex transition-colors duration-300",
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gradient-to-br from-teal-50 to-blue-50 text-gray-800"
        )}
      >
        {/* Sidebar */}
        <div
          className={cn(
            "w-64 border-r flex flex-col transition-colors duration-300",
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white/80 backdrop-blur-sm border-teal-100"
          )}
        >
          {/* Sidebar Header */}
          <div
            className={cn(
              "p-2 border-b flex items-center justify-between",
              darkMode ? "border-gray-700 bg-gray-800" : "border-teal-100 bg-gradient-to-r from-teal-50/50"
            )}
          >
            <h1
              className={cn(
                "font-semibold text-lg",
                darkMode ? "text-teal-400" : "bg-gradient-to-r from-teal-700 to-teal-500 bg-clip-text text-transparent"
              )}
            >
              Assistant
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                "p-2 rounded-full transition-colors",
                darkMode ? "bg-gray-700 text-teal-400 hover:bg-gray-600" : "bg-white text-gray-700 hover:bg-teal-100"
              )}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-4 flex-grow">
            <Link href="/enroll">
              <button
                className={cn(
                  "w-full py-2 px-4 mb-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md font-medium",
                  darkMode ? "bg-teal-600 hover:bg-teal-700 text-white" : "bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white"
                )}
              >
                Enroll Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((action, index) => (
                <QuickActionButton
                  key={index}
                  {...action}
                  onClick={() => handleQuickAction(action)}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header
            className={cn(
              "border-b p-2 transition-colors duration-300",
              darkMode ? "border-gray-700 bg-gray-800" : "border-teal-100 bg-white/80 backdrop-blur-sm"
            )}
          >
            <div className="flex items-center justify-end max-w-4xl mx-auto">
              <div className="flex items-center gap-4">
                <button
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-teal-100/50 text-teal-700"
                  )}
                >
                  <Bell className="h-5 w-5" />
                </button>
                <button
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-teal-100/50 text-teal-700"
                  )}
                >
                  <User className="h-5 w-5" />
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className={cn(
                    "px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm hover:shadow",
                    darkMode ? "bg-teal-600 hover:bg-teal-700 text-white" : "bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white"
                  )}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
              </div>
            </div>
          </header>

          {/* Main Chat Area */}
          <main className="flex-grow overflow-y-auto p-6 max-w-4xl mx-auto w-full">
            {!querySubmitted && (
              <div className="text-center mb-8">
                <h1
                  className={cn(
                    "text-3xl font-semibold mb-2",
                    darkMode ? "text-gray-200" : "text-gray-800"
                  )}
                >
                  How can I assist you today?
                </h1>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Access information about admissions, courses, and more. Get
                  instant answers to your questions.
                </p>
              </div>
            )}
            {chatMessages.length > 0 && (
              <div
                ref={chatContainerRef}
                className={cn(
                  "rounded-xl p-6 mb-8 max-h-[calc(100vh-200px)] overflow-y-auto",
                  darkMode ? "bg-gray-800/50" : "bg-gray-50/50"
                )}
              >
                {chatMessages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    message={msg.text}
                    isUser={msg.isUser}
                    darkMode={darkMode}
                    isTyping={msg.isTyping}
                    userName={userName}
                  />
                ))}
              </div>
            )}
          </main>

          {/* Footer with Message Input */}
          <footer
            className={cn(
              "border-t p-4 fixed bottom-0 left-0 w-full transition-colors duration-300",
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white/80 backdrop-blur-sm border-teal-100"
            )}
          >
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSendMessage} className="relative">
                <textarea
                  placeholder="Ask about admissions, courses, or any other queries..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={sessionEnded}
                  className={cn(
                    "w-full pr-24 py-3 px-4 min-h-[80px] resize-none rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent",
                    darkMode ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-teal-500" : "bg-white border-teal-100 text-gray-700 placeholder-gray-400 focus:ring-teal-500",
                    sessionEnded && "opacity-50 cursor-not-allowed"
                  )}
                />
                {!sessionEnded && (
                  <>
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={cn(
                        "absolute right-20 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors",
                        darkMode ? "bg-teal-600 hover:bg-teal-700 text-white" : "bg-teal-600 hover:bg-teal-500 text-white"
                      )}
                    >
                      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                    <button
                      type="submit"
                      className={cn(
                        "absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors",
                        darkMode ? "bg-teal-600 hover:bg-teal-700 text-white" : "bg-teal-600 hover:bg-teal-500 text-white"
                      )}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </>
                )}
              </form>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
