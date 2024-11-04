import React, { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ImageUpload = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded,setIsUploaded] = useState(false)

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('image', file);

    try {
        const token = localStorage.getItem("token")
      const response = await fetch('http://localhost:3001/api/profile/image', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        credentials:'include',
        body:formData
      });

      console.log(response.body)

      if (response.ok) {
        setUploadProgress(100);
        setTimeout(() => setIsModalOpen(false), 2000);
        setIsModalOpen(false)
        toast.success("Image uploaded!")
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
  });
  

  return (
    <div className="relative">
      <ToastContainer />

      {/* Upload Button */}
      <button
        className="flex items-center space-x-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        onClick={() => setIsModalOpen(true)}
      >
        <Upload className="w-5 h-5" />
        <span>{props.text}</span>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Upload Image</h2>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-blue-500">Drop the files here...</p>
              ) : (
                <p>Drag and drop an image here, or click to select a file</p>
              )}
            </div>

            {isUploading && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Uploading...</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
