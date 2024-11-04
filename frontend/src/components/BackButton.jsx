import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react'; // Import the back arrow icon

const BackButton = (props) => {
  const router = useRouter();
  const {link}  = props;
  return (
    <button 
      onClick={() => router.push(link)} 
      className="btn btn-accent flex items-center"
      aria-label="Go Back"
    >
      <ArrowLeft />
    </button>
  );
};

export default BackButton;
