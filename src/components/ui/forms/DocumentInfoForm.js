import React, { useState, useEffect } from 'react';
import {
  Upload,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  Eye,
} from 'lucide-react';

const DocumentInfoForm = ({ formData = {}, onChange, onValidation }) => {
  const [errors, setErrors] = useState({});
  const [dragOverId, setDragOverId] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);

  // Document lists
  const requiredDocuments = [
    'NIC Front',
    'NIC Back',
    'Matric Marksheet',
    'Intermediate Marksheet Part 2',
    "Guardian's CNIC",
  ];

  const optionalDocuments = [
    'Matric Certificate',
    'Intermediate Part 1 Marksheet',
  ];

  // Initialize formData for documents if not present
  useEffect(() => {
    const initFormData = { ...formData };
    [...requiredDocuments, ...optionalDocuments].forEach((doc) => {
      if (!initFormData[doc]) {
        initFormData[doc] = null;
      }
    });
    onChange(initFormData);
  }, []);

  // Document Upload Handlers
  const handleFileChange = (e, docName) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file, docName);
  };

  const handleFileUpload = (file, docName) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [docName]: 'File size should be less than 5MB',
      }));
      return;
    }

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [docName]: 'Please upload a JPG or PNG file',
      }));
      return;
    }

    const url = URL.createObjectURL(file);
    onChange({ ...formData, [docName]: { file, preview: url } });
    setErrors((prev) => ({ ...prev, [docName]: '' }));
  };

  const removeFile = (docName) => {
    onChange({ ...formData, [docName]: null });
    setErrors((prev) => ({
      ...prev,
      [docName]: requiredDocuments.includes(docName)
        ? 'This document is required'
        : '',
    }));
  };

  // Drag and Drop Handlers
  const handleDragOver = (e, docName) => {
    e.preventDefault();
    setDragOverId(docName);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e, docName) => {
    e.preventDefault();
    setDragOverId(null);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file, docName);
  };

  // Modal Handlers
  const openModal = (imageSrc) => {
    setViewingImage(imageSrc);
  };

  const closeModal = () => {
    setViewingImage(null);
  };

  // Validation Effect
  useEffect(() => {
    if (onValidation) {
      const isValid = validateForm();
      onValidation(isValid);
    }
  }, [formData]);

  // Validate all required documents are uploaded
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    requiredDocuments.forEach((doc) => {
      if (!formData[doc]) {
        formErrors[doc] = 'This document is required';
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  };

  // Reusable Component for Document Upload
  const DocumentUploader = ({ docName, isRequired }) => (
    <div key={docName}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {docName} {isRequired && <span className="text-red-500">*</span>}
      </label>
      {formData[docName] && formData[docName].preview ? (
        <div className="relative group w-40 h-40">
          <img
            src={formData[docName].preview}
            alt={`${docName} Preview`}
            className="w-full h-full rounded-lg object-cover border-2 border-teal-500 transition-all duration-300 group-hover:border-4"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg" />
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={() => openModal(formData[docName].preview)}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-lg"
              type="button"
              aria-label="View Document"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => removeFile(docName)}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 shadow-lg"
              type="button"
              aria-label="Delete Document"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`relative`}
          onDragOver={(e) => handleDragOver(e, docName)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, docName)}
        >
          <input
            type="file"
            id={docName}
            name={docName}
            accept="image/jpeg,image/png"
            onChange={(e) => handleFileChange(e, docName)}
            className="hidden"
          />
          <label
            htmlFor={docName}
            className={`
              flex flex-col items-center justify-center w-40 h-40 
              border-2 border-dashed rounded-lg cursor-pointer 
              transition-all duration-300
              ${
                dragOverId === docName
                  ? 'border-teal-500 bg-teal-50 scale-105'
                  : errors[docName]
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50'
              }
            `}
          >
            <Upload
              className={`w-8 h-8 mb-2 ${
                errors[docName] ? 'text-red-400' : 'text-teal-500'
              } ${dragOverId === docName ? 'animate-bounce' : ''}`}
            />
            <span
              className={`text-sm ${
                errors[docName] ? 'text-red-500' : 'text-gray-600'
              }`}
            >
              {dragOverId === docName ? 'Drop document here' : 'Upload Document'}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Click or drag & drop
            </span>
          </label>
        </div>
      )}
      {errors[docName] && (
        <div className="flex items-center mt-1 text-red-500">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span className="text-sm">{errors[docName]}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Required Documents Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center mb-6">
          <FileText className="w-6 h-6 text-teal-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Required Documents
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requiredDocuments.map((doc) => (
            <DocumentUploader key={doc} docName={doc} isRequired={true} />
          ))}
        </div>
      </div>

      {/* Optional Documents Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center mb-6">
          <FileText className="w-6 h-6 text-teal-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Optional Documents
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {optionalDocuments.map((doc) => (
            <DocumentUploader key={doc} docName={doc} isRequired={false} />
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {viewingImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={closeModal}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={viewingImage}
              alt="Document Preview"
              className="max-w-full max-h-[80vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentInfoForm;
