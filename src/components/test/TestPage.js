"use client";

import React, { useState, useEffect, useRef, useId } from "react";
import {
  Clock,
  Brain,
  CheckCircle,
  Code,
  Database,
  Globe,
  Lock,
  Cloud,
  Monitor,
  RefreshCw,
  BookOpen,
  Zap,
  ChevronRight,
  GitBranch,
  Box,
  Award,
  Wand2,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const Card = ({ children, className = "", ...props }) => (
  <div
    className={`rounded-2xl border border-gray-200 bg-white text-gray-950 shadow-md ${className}`}
    {...props}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`flex flex-col space-y-3 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3
    className={`text-2xl font-semibold leading-tight tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Progress = ({ value = 0, className = "", ...props }) => (
  <div
    className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
    {...props}
  >
    <div
      className="h-full flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
      style={{ width: `${value}%` }}
    />
  </div>
);

// Questions array
const questions = [
  {
    id: 1,
    question:
      "Explain what an algorithm is and provide a real-world example of how algorithms are used in daily life.",
    hint: "Think about step-by-step processes you follow in everyday activities, like cooking or navigation.",
    icon: <Code />,
    category: "Fundamentals",
    expectedLength: 200,
    difficulty: "Beginner",
    timeEstimate: 5,
    points: 10,
    tags: ["algorithms", "basics", "real-world-applications"],
    relatedTopics: ["flowcharts", "pseudocode", "problem-solving"],
  },
  {
    id: 2,
    question:
      "Compare and contrast Object-Oriented Programming (OOP) and Functional Programming paradigms. What are the key differences and when would you choose one over the other?",
    hint: "Consider aspects like state management, code organization, and how data is transformed in each paradigm.",
    icon: <Code />,
    category: "Programming Paradigms",
    expectedLength: 300,
    difficulty: "Intermediate",
    timeEstimate: 8,
    points: 15,
    tags: ["oop", "functional-programming", "paradigms"],
    relatedTopics: ["immutability", "inheritance", "pure-functions"],
  },
  {
    id: 3,
    question:
      "Describe how cloud computing has transformed modern software development. Include specific examples of cloud services and their impact on scalability and deployment.",
    hint: "Think about infrastructure, deployment processes, and how teams collaborate in cloud environments.",
    icon: <Cloud />,
    category: "Cloud Computing",
    expectedLength: 250,
    difficulty: "Intermediate",
    timeEstimate: 7,
    points: 12,
    tags: ["cloud", "devops", "infrastructure"],
    relatedTopics: ["aws", "azure", "microservices"],
  },
  {
    id: 4,
    question:
      "Explain the concept of time complexity in algorithms using Big O notation. Provide examples of O(1), O(n), and O(n²) algorithms.",
    hint: "Consider how the number of operations grows as the input size increases.",
    icon: <Clock />,
    category: "Algorithm Analysis",
    expectedLength: 275,
    difficulty: "Advanced",
    timeEstimate: 10,
    points: 20,
    tags: ["complexity", "algorithms", "performance"],
    relatedTopics: ["space-complexity", "algorithm-efficiency", "optimization"],
  },
  {
    id: 5,
    question:
      "What are the key principles of secure software development? Discuss common vulnerabilities and best practices for preventing security breaches.",
    hint: "Consider authentication, data protection, and common attack vectors.",
    icon: <Lock />,
    category: "Security",
    expectedLength: 300,
    difficulty: "Advanced",
    timeEstimate: 8,
    points: 18,
    tags: ["security", "best-practices", "vulnerabilities"],
    relatedTopics: ["encryption", "authentication", "authorization"],
  },
  {
    id: 6,
    question:
      "Describe the role of databases in modern applications. Compare different types of databases (SQL vs NoSQL) and their use cases.",
    hint: "Think about data structure, scalability requirements, and query patterns.",
    icon: <Database />,
    category: "Databases",
    expectedLength: 250,
    difficulty: "Intermediate",
    timeEstimate: 7,
    points: 15,
    tags: ["databases", "sql", "nosql"],
    relatedTopics: ["data-modeling", "query-optimization", "acid"],
  },
  {
    id: 7,
    question:
      "Explain how version control systems like Git help in software development. Describe the basic workflow and common commands.",
    hint: "Consider collaboration aspects and how changes are tracked over time.",
    icon: <GitBranch />,
    category: "Development Tools",
    expectedLength: 225,
    difficulty: "Beginner",
    timeEstimate: 6,
    points: 10,
    tags: ["git", "version-control", "collaboration"],
    relatedTopics: ["branching", "merging", "conflict-resolution"],
  },
  {
    id: 8,
    question:
      "Discuss the importance of responsive web design and describe key techniques for creating mobile-friendly websites.",
    hint: "Think about different screen sizes, user experience, and performance considerations.",
    icon: <Monitor />,
    category: "Web Development",
    expectedLength: 250,
    difficulty: "Intermediate",
    timeEstimate: 7,
    points: 15,
    tags: ["responsive-design", "web", "mobile"],
    relatedTopics: ["media-queries", "flexbox", "grid"],
  },
  {
    id: 9,
    question:
      "Explain how artificial intelligence and machine learning are transforming software development. Provide specific examples of AI/ML applications.",
    hint: "Consider both development tools and end-user applications of AI/ML.",
    icon: <Brain />,
    category: "AI & ML",
    expectedLength: 300,
    difficulty: "Advanced",
    timeEstimate: 10,
    points: 20,
    tags: ["ai", "machine-learning", "automation"],
    relatedTopics: ["neural-networks", "deep-learning", "data-science"],
  },
  {
    id: 10,
    question:
      "Describe the principles of clean code and explain why it's important. Provide examples of how to improve code readability and maintainability.",
    hint: "Think about naming conventions, code organization, and documentation.",
    icon: <Code />,
    category: "Code Quality",
    expectedLength: 250,
    difficulty: "Intermediate",
    timeEstimate: 7,
    points: 15,
    tags: ["clean-code", "best-practices", "maintainability"],
    relatedTopics: ["refactoring", "solid-principles", "documentation"],
  },
  {
    id: 11,
    question:
      "Explain the concept of API design and REST principles. How do APIs enable communication between different software systems?",
    hint: "Consider HTTP methods, status codes, and API versioning.",
    icon: <Globe />,
    category: "Web Services",
    expectedLength: 275,
    difficulty: "Intermediate",
    timeEstimate: 8,
    points: 15,
    tags: ["api", "rest", "web-services"],
    relatedTopics: ["http", "microservices", "api-security"],
  },
  {
    id: 12,
    question:
      "Discuss the impact of containerization (e.g., Docker) on modern software development and deployment. Include benefits and potential challenges.",
    hint: "Think about scalability, consistency across environments, and orchestration.",
    icon: <Box />,
    category: "DevOps",
    expectedLength: 275,
    difficulty: "Advanced",
    timeEstimate: 9,
    points: 18,
    tags: ["containers", "docker", "devops"],
    relatedTopics: ["kubernetes", "microservices", "ci-cd"],
  },
];

// Circular Timer Component
const CircularTimer = ({ timeLeft, totalTime, showWarning }) => {
  const gradientId = `timer-gradient-${useId()}`;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / totalTime) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox="0 0 120 120"
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          className="transition-all duration-1000"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference - progress,
          }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor={timeLeft <= 300 ? "#EF4444" : "#3B82F6"}
            />
            <stop
              offset="100%"
              stopColor={timeLeft <= 300 ? "#DC2626" : "#8B5CF6"}
            />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`text-2xl font-bold font-mono ${
            timeLeft <= 300
              ? "text-red-600"
              : "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          }`}
        >
          {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
};

// Progress Steps Component
const ProgressSteps = ({ current, total }) => (
  <div className="flex items-center justify-center gap-2">
    {Array.from({ length: total }).map((_, index) => (
      <div
        key={index}
        className={`relative group ${index <= current ? "cursor-pointer" : ""}`}
      >
        <div
          className={`w-3 h-3 rounded-full transition-all duration-300
            ${
              index === current
                ? "bg-blue-600 ring-4 ring-blue-100"
                : index < current
                ? "bg-green-500"
                : "bg-gray-200"
            }`}
        />
        {index < total - 1 && (
          <div
            className={`absolute top-1.5 -right-3 w-2 h-0.5
              ${index < current ? "bg-green-500" : "bg-gray-200"}`}
          />
        )}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded">
            Q{index + 1}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const QuestionCard = ({
  question,
  answer,
  onAnswerChange,
  onSubmit,
  submitted,
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleAnswerChange = (e) => {
    const text = e.target.value;
    onAnswerChange(text);
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      typingTimeoutRef.current = null;
    }, 1000);
  };

  const getWordCount = (text) =>
    text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-tr from-pink-400/20 to-yellow-400/20 rounded-full blur-3xl" />

      <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100/50">
        <div className="space-y-8">
          {/* Question header */}
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-inner ring-1 ring-purple-100">
                {question.icon || <Code className="w-7 h-7 text-blue-600" />}
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
                  {question.question}
                </h2>

                {/* Question metadata and hint button */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/80 text-blue-700 rounded-xl ring-1 ring-blue-100">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{question.timeEstimate} mins</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50/80 text-emerald-700 rounded-xl ring-1 ring-emerald-100">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-medium">{question.difficulty}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-sm bg-purple-50/80 text-purple-700 px-5 py-2 rounded-xl
                      hover:bg-purple-100/80 transition-all duration-300
                      flex items-center gap-2 font-medium ring-1 ring-purple-100
                      hover:shadow-md"
                  >
                    <Zap className="w-4 h-4" />
                    {showHint ? "Hide Hint" : "Show Hint"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hint content */}
          {showHint && (
            <div className="p-5 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-2xl text-purple-700 text-sm border border-purple-100/50 shadow-sm">
              <div className="flex items-start gap-4">
                <Sparkles className="w-5 h-5 text-purple-500 mt-0.5" />
                <p className="leading-relaxed">{question.hint}</p>
              </div>
            </div>
          )}

          {/* Answer textarea */}
          <div className="relative">
            <textarea
              value={answer}
              onChange={handleAnswerChange}
              disabled={submitted}
              className={`w-full h-72 p-6 rounded-2xl resize-none transition-all duration-300
                ${submitted ? "bg-gray-50" : "focus:ring-2 focus:ring-blue-400"}
                border-2 ${isTyping ? "border-blue-400" : "border-gray-200"}
                text-gray-800 text-lg leading-relaxed
                shadow-sm focus:shadow-lg
                ${isTyping ? "shadow-blue-100" : ""}`}
              placeholder="Type your answer here..."
              aria-label="Your answer"
            />
            <div className="absolute bottom-4 left-6 text-sm text-gray-400">
              {getWordCount(answer)} words
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end items-center gap-4">
            {!submitted && (
              <>
                <button
                  className="px-6 py-3.5 rounded-xl font-medium 
                    transition-all duration-300 flex items-center gap-2
                    bg-gradient-to-r from-purple-500 to-pink-500 text-white
                    hover:from-purple-600 hover:to-pink-600
                    shadow-[0_0_20px_rgba(168,85,247,0.3 x)]
                    hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]
                    hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Humanize
                </button>
                <button
                  onClick={onSubmit}
                  disabled={!answer?.trim()}
                  className={`px-6 py-3.5 rounded-xl font-medium
                    transition-all duration-300 flex items-center gap-2
                    ${
                      answer?.trim()
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  Submit Answer
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
            {submitted && (
              <div className="flex items-center text-green-600 font-medium bg-green-50/80 px-4 py-2 rounded-xl ring-1 ring-green-100">
                <CheckCircle className="w-5 h-5 mr-2" />
                Answer submitted
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TestPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submittedQuestions, setSubmittedQuestions] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Time warning effect
  useEffect(() => {
    if (timeLeft <= 300 && !showTimeWarning) {
      setShowTimeWarning(true);
    }
  }, [timeLeft, showTimeWarning]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Timer card */}
          <div className="bg-white/95 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100/50">
            <div className="flex flex-col items-center space-y-3">
              <CircularTimer
                timeLeft={timeLeft}
                totalTime={30 * 60}
                showWarning={showTimeWarning}
              />
              <span className="text-sm font-medium text-gray-600">
                Time Remaining
              </span>
            </div>
          </div>

          {/* Progress card */}
          <div className="md:col-span-2 bg-white/95 backdrop-blur-2xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100/50">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl ring-1 ring-purple-100">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-700">
                  Your Progress
                </span>
              </div>

              <ProgressSteps
                current={currentQuestionIndex}
                total={questions.length}
              />

              <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span>{submittedQuestions.size} completed</span>
                <span>{questions.length - submittedQuestions.size} remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question section */}
        <QuestionCard
          question={questions[currentQuestionIndex]}
          answer={answers[questions[currentQuestionIndex]?.id] || ""}
          onAnswerChange={(text) =>
            setAnswers((prev) => ({
              ...prev,
              [questions[currentQuestionIndex].id]: text,
            }))
          }
          onSubmit={() => {
            setSubmittedQuestions((prev) => {
              const newSet = new Set(prev);
              newSet.add(questions[currentQuestionIndex].id);
              return newSet;
            });
            if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex((prev) => prev + 1);
            }
          }}
          submitted={submittedQuestions.has(questions[currentQuestionIndex]?.id)}
        />
      </div>
    </div>
  );
};

export default TestPage;