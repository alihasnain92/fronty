// src/components/TypingIndicator.js
const TypingIndicator = ({ darkMode }) => (
    <div className="flex space-x-2 px-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            darkMode ? "bg-teal-400" : "bg-teal-600"
          } animate-bounce`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );