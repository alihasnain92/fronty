interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }

interface ApplicationStatus {
    id: string;
    status: 'pending' | 'approved' | 'rejected';
  }
  
interface AdminPanelProps {
    // Add props types if needed
  }