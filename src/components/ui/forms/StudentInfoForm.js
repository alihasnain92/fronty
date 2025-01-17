import React, { useState, useEffect } from 'react';
import { Upload, X, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';

const StudentInfoForm = ({ formData = {}, onChange, onValidation }) => {
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(formData.photoPreview || '');
  const [isDragOver, setIsDragOver] = useState(false);

  // Styling constants
  const sectionClass = "bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = (error) => `
    w-full p-3 border rounded-lg transition-all duration-200
    ${error 
      ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-400' 
      : 'border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100'
    }
    hover:border-teal-300
  `;

  // Form Field Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let fieldErrors = { ...errors };
    
    switch (name) {
      case 'firstName':
        fieldErrors.firstName = !value?.trim() ? 'First name is required' : '';
        break;
      case 'lastName':
        fieldErrors.lastName = !value?.trim() ? 'Last name is required' : '';
        break;
      case 'email':
        fieldErrors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? 'Please enter a valid email address'
          : '';
        break;
      case 'phone':
        fieldErrors.phone = !/^[\d\s-+()]{10,}$/.test(value)
          ? 'Please enter a valid phone number'
          : '';
        break;
      default:
        break;
    }

    setErrors(fieldErrors);
    return !Object.values(fieldErrors).some(error => error);
  };

  // Validate all fields and check if form is complete
  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    let formErrors = {};
    let isValid = true;

    // Check all required fields
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        formErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        isValid = false;
      } else {
        validateField(field, formData[field]);
      }
    });

    // Check photo
    if (!formData.photo && !previewUrl) {
      formErrors.photo = 'Profile photo is required';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Photo Upload Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handlePhotoFile(file);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) handlePhotoFile(file);
  };

  const handlePhotoFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Photo size should be less than 5MB' }));
      return;
    }

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, photo: 'Please upload a JPG or PNG file' }));
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onChange({ ...formData, photo: file, photoPreview: url });
    setErrors(prev => ({ ...prev, photo: '' }));
  };

  const removePhoto = () => {
    setPreviewUrl('');
    onChange({ ...formData, photo: null, photoPreview: null });
    setErrors(prev => ({ ...prev, photo: 'Profile photo is required' }));
  };

  // Validation Effect
  useEffect(() => {
    if (onValidation) {
      const isValid = validateForm();
      onValidation(isValid);
    }
  }, [formData, previewUrl]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className={sectionClass}>
        <div className="flex items-center mb-6">
          <Camera className="w-6 h-6 text-teal-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Student Information</h2>
        </div>

        {/* Photo Upload Section */}
        <div className="mb-8">
          <label className={labelClass}>
            Profile Photo <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-8">
            {previewUrl ? (
              <div className="relative group">
                <img 
                  src={previewUrl} 
                  alt="Profile Preview" 
                  className="w-40 h-40 rounded-lg object-cover border-2 border-teal-500 transition-all duration-300 group-hover:border-4"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg" />
                <button
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 shadow-lg"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                className="relative"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/jpeg,image/png"
                  onChange={handlePhotoChange}
                  className="hidden"
                  required
                />
                <label
                  htmlFor="photo"
                  className={`
                    flex flex-col items-center justify-center w-40 h-40 
                    border-2 border-dashed rounded-lg cursor-pointer 
                    transition-all duration-300
                    ${isDragOver ? 'border-teal-500 bg-teal-50' : errors.photo ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50'}
                  `}
                >
                  <Upload className={`w-8 h-8 mb-2 ${errors.photo ? 'text-red-400' : 'text-teal-500'}`} />
                  <span className={`text-sm ${errors.photo ? 'text-red-500' : 'text-gray-600'}`}>
                    {isDragOver ? 'Drop photo here' : 'Upload Photo'}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Click or drag & drop</span>
                </label>
              </div>
            )}

            <div className="flex-1">
              <div className={`p-4 rounded-lg ${errors.photo ? 'bg-red-50 border border-red-100' : 'bg-teal-50 border border-teal-100'}`}>
                <h3 className="font-medium text-gray-700 mb-2">Photo Requirements:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 mr-2" />
                    Maximum file size: 5MB
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 mr-2" />
                    Supported formats: JPG, PNG
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-teal-500 mr-2" />
                    Recent passport-sized photo
                  </li>
                </ul>
              </div>
              {errors.photo && (
                <div className="flex items-center mt-2 text-red-500">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{errors.photo}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ''}
              onChange={handleChange}
              className={inputClass(errors.firstName)}
              placeholder="Enter your first name"
              required
            />
            {errors.firstName && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.firstName}</span>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ''}
              onChange={handleChange}
              className={inputClass(errors.lastName)}
              placeholder="Enter your last name"
              required
            />
            {errors.lastName && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.lastName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className={labelClass}>
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className={inputClass(errors.email)}
              placeholder="your.email@example.com"
              required
            />
            {errors.email && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.email}</span>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className={inputClass(errors.phone)}
              placeholder="+92-XXX-XXXXXXX"
              required
            />
            {errors.phone && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoForm;


// import React, { useState, useEffect } from 'react';
// import { Upload, X, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';

// const StudentInfoForm = ({ formData = {}, onChange, onValidation }) => {
//   const [errors, setErrors] = useState({});
//   const [previewUrl, setPreviewUrl] = useState(formData.photoPreview || '');
//   const [isDragOver, setIsDragOver] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState('');

//   // Styling constants
//   const sectionClass = "bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300";
//   const labelClass = "block text-sm font-medium text-gray-700 mb-1";
//   const inputClass = (error) => `
//     w-full p-3 border rounded-lg transition-all duration-200
//     ${error 
//       ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-400' 
//       : 'border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100'
//     }
//     hover:border-teal-300
//   `;

//   // Form Field Handlers
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     onChange({ ...formData, [name]: value });
//     validateField(name, value);
//   };

//   const validateField = (name, value) => {
//     let fieldErrors = { ...errors };
    
//     switch (name) {
//       case 'firstName':
//         fieldErrors.firstName = !value?.trim() ? 'First name is required' : '';
//         break;
//       case 'lastName':
//         fieldErrors.lastName = !value?.trim() ? 'Last name is required' : '';
//         break;
//       case 'email':
//         fieldErrors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
//           ? 'Please enter a valid email address'
//           : '';
//         break;
//       case 'phone':
//         fieldErrors.phone = !/^[\d\s-+()]{10,}$/.test(value)
//           ? 'Please enter a valid phone number'
//           : '';
//         break;
//       default:
//         break;
//     }

//     setErrors(fieldErrors);
//     return !Object.values(fieldErrors).some(error => error);
//   };

//   // Form submission handler
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);
//     setSubmitError('');

//     try {
//       const submitData = new FormData();

//             // Append photo file if exists
//             if (formData.photo) {
//               submitData.append('profile_photo', formData.photo);
//             }
      
//       // Append form fields
//       submitData.append('first_name', formData.firstName);
//       submitData.append('last_name', formData.lastName);
//       submitData.append('email', formData.email);
//       submitData.append('phone_number', formData.phone);
//       submitData.append('steps', 'step_1');
      

  
//       // Log the FormData contents
//       for (let pair of submitData.entries()) {
//         console.log(pair[0] + ': ' + pair[1]);
//       }
  
//       const response = await fetch('http://localhost:3001/students', {
//         method: 'POST',
//         // headers: {
//         //   'Accept': 'application/json',
//         // },
//         body: submitData,
//       });
  
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.log('Error response:', errorText);
//         throw new Error(errorText || 'Failed to submit form');
//       }
  
//       const result = await response.json();
//       console.log('Form submitted successfully:', result);
      
//     } catch (error) {
//       console.error('Form submission error:', error);
//       setSubmitError(error.message || 'Failed to submit form. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Validate all fields and check if form is complete
//   const validateForm = () => {
//     const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
//     let formErrors = {};
//     let isValid = true;

//     // Check all required fields
//     requiredFields.forEach(field => {
//       if (!formData[field]?.trim()) {
//         formErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
//         isValid = false;
//       } else {
//         validateField(field, formData[field]);
//       }
//     });

//     // Check photo
//     if (!formData.photo && !previewUrl) {
//       formErrors.photo = 'Profile photo is required';
//       isValid = false;
//     }

//     setErrors(formErrors);
//     return isValid;
//   };

//   // Photo Upload Handlers
//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragOver(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragOver(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragOver(false);
//     const file = e.dataTransfer.files[0];
//     if (file) handlePhotoFile(file);
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) handlePhotoFile(file);
//   };

//   const handlePhotoFile = (file) => {
//     if (file.size > 5 * 1024 * 1024) {
//       setErrors(prev => ({ ...prev, photo: 'Photo size should be less than 5MB' }));
//       return;
//     }

//     const validTypes = ['image/jpeg', 'image/png'];
//     if (!validTypes.includes(file.type)) {
//       setErrors(prev => ({ ...prev, photo: 'Please upload a JPG or PNG file' }));
//       return;
//     }

//     const url = URL.createObjectURL(file);
//     setPreviewUrl(url);
//     onChange({ ...formData, photo: file, photoPreview: url });
//     setErrors(prev => ({ ...prev, photo: '' }));
//   };

//   const removePhoto = () => {
//     setPreviewUrl('');
//     onChange({ ...formData, photo: null, photoPreview: null });
//     setErrors(prev => ({ ...prev, photo: 'Profile photo is required' }));
//   };

//   // Validation Effect
//   useEffect(() => {
//     if (onValidation) {
//       const isValid = validateForm();
//       onValidation(isValid);
//     }
//   }, [formData, previewUrl]);

//   return (
//     <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
//       <div className={sectionClass}>
//         <div className="flex items-center mb-6">
//           <Camera className="w-6 h-6 text-teal-500 mr-2" />
//           <h2 className="text-2xl font-bold text-gray-800">Student Information</h2>
//         </div>

//         {/* Photo Upload Section */}
//         <div className="mb-8">
//           <label className={labelClass}>
//             Profile Photo <span className="text-red-500">*</span>
//           </label>
//           <div className="flex items-center gap-8">
//             {previewUrl ? (
//               <div className="relative group">
//                 <img 
//                   src={previewUrl} 
//                   alt="Profile Preview" 
//                   className="w-40 h-40 rounded-lg object-cover border-2 border-teal-500 transition-all duration-300 group-hover:border-4"
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg" />
//                 <button
//                   onClick={removePhoto}
//                   className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 shadow-lg"
//                   type="button"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             ) : (
//               <div
//                 className="relative"
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//               >
//                 <input
//                   type="file"
//                   id="photo"
//                   name="photo"
//                   accept="image/jpeg,image/png"
//                   onChange={handlePhotoChange}
//                   className="hidden"
//                   required
//                 />
//                 <label
//                   htmlFor="photo"
//                   className={`
//                     flex flex-col items-center justify-center w-40 h-40 
//                     border-2 border-dashed rounded-lg cursor-pointer 
//                     transition-all duration-300
//                     ${isDragOver ? 'border-teal-500 bg-teal-50' : errors.photo ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50'}
//                   `}
//                 >
//                   <Upload className={`w-8 h-8 mb-2 ${errors.photo ? 'text-red-400' : 'text-teal-500'}`} />
//                   <span className={`text-sm ${errors.photo ? 'text-red-500' : 'text-gray-600'}`}>
//                     {isDragOver ? 'Drop photo here' : 'Upload Photo'}
//                   </span>
//                   <span className="text-xs text-gray-500 mt-1">Click or drag & drop</span>
//                 </label>
//               </div>
//             )}

//             <div className="flex-1">
//               <div className={`p-4 rounded-lg ${errors.photo ? 'bg-red-50 border border-red-100' : 'bg-teal-50 border border-teal-100'}`}>
//                 <h3 className="font-medium text-gray-700 mb-2">Photo Requirements:</h3>
//                 <ul className="space-y-2">
//                   <li className="flex items-center text-sm text-gray-600">
//                     <CheckCircle2 className="w-4 h-4 text-teal-500 mr-2" />
//                     Maximum file size: 5MB
//                   </li>
//                   <li className="flex items-center text-sm text-gray-600">
//                     <CheckCircle2 className="w-4 h-4 text-teal-500 mr-2" />
//                     Supported formats: JPG, PNG
//                   </li>
//                   <li className="flex items-center text-sm text-gray-600">
//                     <CheckCircle2 className="w-4 h-4 text-teal-500 mr-2" />
//                     Recent passport-sized photo
//                   </li>
//                 </ul>
//               </div>
//               {errors.photo && (
//                 <div className="flex items-center mt-2 text-red-500">
//                   <AlertCircle className="w-4 h-4 mr-1" />
//                   <span className="text-sm">{errors.photo}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Personal Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className={labelClass}>
//               First Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName || ''}
//               onChange={handleChange}
//               className={inputClass(errors.firstName)}
//               placeholder="Enter your first name"
//               required
//             />
//             {errors.firstName && (
//               <div className="flex items-center mt-1 text-red-500">
//                 <AlertCircle className="w-4 h-4 mr-1" />
//                 <span className="text-sm">{errors.firstName}</span>
//               </div>
//             )}
//           </div>

//           <div>
//             <label className={labelClass}>
//               Last Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName || ''}
//               onChange={handleChange}
//               className={inputClass(errors.lastName)}
//               placeholder="Enter your last name"
//               required
//             />
//             {errors.lastName && (
//               <div className="flex items-center mt-1 text-red-500">
//                 <AlertCircle className="w-4 h-4 mr-1" />
//                 <span className="text-sm">{errors.lastName}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Contact Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//           <div>
//             <label className={labelClass}>
//               Email Address <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email || ''}
//               onChange={handleChange}
//               className={inputClass(errors.email)}
//               placeholder="your.email@example.com"
//               required
//             />
//             {errors.email && (
//               <div className="flex items-center mt-1 text-red-500">
//                 <AlertCircle className="w-4 h-4 mr-1" />
//                 <span className="text-sm">{errors.email}</span>
//               </div>
//             )}
//           </div>

//           <div>
//             <label className={labelClass}>
//               Phone Number <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone || ''}
//               onChange={handleChange}
//               className={inputClass(errors.phone)}
//               placeholder="+92-XXX-XXXXXXX"
//               required
//             />
//             {errors.phone && (
//               <div className="flex items-center mt-1 text-red-500">
//                 <AlertCircle className="w-4 h-4 mr-1" />
//                 <span className="text-sm">{errors.phone}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Submit Button and Error Message */}
//         <div className="mt-8">
//           {submitError && (
//             <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center">
//               <AlertCircle className="w-5 h-5 mr-2" />
//               {submitError}
//             </div>
//           )}
          
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`
//               w-full py-3 px-6 rounded-lg text-white font-medium
//               transition-all duration-300
//               ${isSubmitting 
//                 ? 'bg-gray-400 cursor-not-allowed' 
//                 : 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700'
//               }
//             `}
//           >
//             {isSubmitting ? (
//               <span className="flex items-center justify-center">
//                <svg 
//                   className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
//                   xmlns="http://www.w3.org/2000/svg" 
//                   fill="none" 
//                   viewBox="0 0 24 24"
//                 >
//                   <circle 
//                     className="opacity-25" 
//                     cx="12" 
//                     cy="12" 
//                     r="10" 
//                     stroke="currentColor" 
//                     strokeWidth="4"
//                   />
//                   <path 
//                     className="opacity-75" 
//                     fill="currentColor" 
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   />
//                 </svg>
//                 Submitting...
//               </span>
//             ) : (
//               'Submit'
//             )}
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default StudentInfoForm;
                