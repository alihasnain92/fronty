const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className="w-8 h-8 border-t-2 border-teal-500 border-solid rounded-full"
      />
    </div>
  );
  
  export default LoadingSpinner;