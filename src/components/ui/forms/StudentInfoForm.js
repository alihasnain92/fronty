// import React, { useState, useEffect } from 'react';
// import { Upload, X, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';

// const StudentInfoForm = ({ formData = {}, onChange, onValidation }) => {
//   const [errors, setErrors] = useState({});
//   const [previewUrl, setPreviewUrl] = useState(formData.photoPreview || '');
//   const [isDragOver, setIsDragOver] = useState(false);

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
//     <div className="space-y-8 max-w-4xl mx-auto">
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
//       </div>
//     </div>
//   );
// };

// export default StudentInfoForm;

import React, { useState, useEffect } from "react";
import { Upload, X, Camera, AlertCircle, CheckCircle2 } from "lucide-react";

const StudentInfoForm = ({ formData = {}, onChange, onValidation }) => {
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(
    formData.profileImagePreview || ""
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Styling constants
  const sectionClass =
    "bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = (error) =>
    `
    w-full p-3 border rounded-lg transition-all duration-200
    ${
      error
        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-400"
        : "border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
    }
    hover:border-teal-300
  `;

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const validateField = (name, value) => {
    let fieldErrors = { ...errors };
    switch (name) {
      case "first_name":
        fieldErrors.first_name = !value?.trim() ? "First name is required" : "";
        break;
      case "last_name":
        fieldErrors.lastName = !value?.trim() ? "Last name is required" : "";
        break;
      case "email":
        fieldErrors.email = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Please enter a valid email address"
          : "";
        break;
      case "phone_number":
        fieldErrors.phone = !/^[\d\s-+()]{10,}$/.test(value)
          ? "Please enter a valid phone number"
          : "";
        break;
      default:
        break;
    }
    setErrors(fieldErrors);
    return !Object.values(fieldErrors).some((error) => error);
  };

  const validateForm = () => {
    const requiredFields = ["first_name", "lastName", "email", "phone"];
    let formErrors = {};
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        formErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
        isValid = false;
      } else {
        validateField(field, formData[field]);
      }
    });

    if (!formData.profileImage && !previewUrl) {
      formErrors.profileImage = "Profile photo is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) handlePhotoFile(file);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handlePhotoFile(file);
  };

  const handlePhotoFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Photo size should be less than 5MB",
      }));
      return;
    }

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Please upload a JPG or PNG file",
      }));
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onChange({ ...formData, profileImage: file, profileImagePreview: url });
    setErrors((prev) => ({ ...prev, profileImage: "" }));
  };

  const removePhoto = () => {
    setPreviewUrl("");
    onChange({ ...formData, profileImage: null, profileImagePreview: null });
    setErrors((prev) => ({
      ...prev,
      profileImage: "Profile photo is required",
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const form = new FormData();

    // Map formData keys directly to schema field names
    const schemaMappedData = {
      profileImage: formData.profileImage, // Binary field for profile photo
      first_name: formData.first_name, // Already correctly named
      last_name: formData.last_name || formData.lastName, // Ensure consistency for last name
      email: formData.email,
      phone_number: formData.phone_number || formData.phone, // Map phone to phone_number
    };

    // Append mapped data to FormData
    Object.entries(schemaMappedData).forEach(([key, value]) => {
      if (key === "profile_photo" && value instanceof File) {
        form.append(key, value);
      } else if (value !== undefined && value !== null) {
        form.append(key, value);
      }
    });

    // Log form data to verify
    for (let [key, value] of form.entries()) {
      console.log(`Form field: ${key}, Value:`, value);
    }

    try {
      const response = await fetch("http://localhost:3001/students", {
        method: "POST",
        body: form,
      });

      // console.log("Response Status:", response.status);
      // console.log("Response Body:", await response.json());

      if (!response.ok) {
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        };

        try {
          const responseBody = await response.json();
          errorDetails.body = responseBody;
        } catch (e) {
          const responseBody = await response.text();
          errorDetails.body = responseBody;
        }

        console.error("Error while submitting the form:", errorDetails);
        throw new Error(
          `Failed to submit the form: ${JSON.stringify(errorDetails)}`
        );
      }

      console.log("Form submitted successfully");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className={sectionClass}>
        <div className="flex items-center mb-6">
          <Camera className="w-6 h-6 text-teal-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Student Information
          </h2>
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
                  name="profileImage"
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
                    ${
                      isDragOver
                        ? "border-teal-500 bg-teal-50"
                        : errors.profileImage
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-teal-400 hover:bg-teal-50"
                    }
                  `}
                >
                  <Upload
                    className={`w-8 h-8 mb-2 ${
                      errors.profileImage ? "text-red-400" : "text-teal-500"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      errors.profileImage ? "text-red-500" : "text-gray-600"
                    }`}
                  >
                    {isDragOver ? "Drop photo here" : "Upload Photo"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Click or drag & drop
                  </span>
                </label>
              </div>
            )}

            <div className="flex-1">
              <div
                className={`p-4 rounded-lg ${
                  errors.profileImage
                    ? "bg-red-50 border border-red-100"
                    : "bg-teal-50 border border-teal-100"
                }`}
              >
                <h3 className="font-medium text-gray-700 mb-2">
                  Photo Requirements:
                </h3>
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
              {errors.profileImage && (
                <div className="flex items-center mt-2 text-red-500">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{errors.profileImage}</span>
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
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleChange}
              className={inputClass(errors.first_name)}
              placeholder="Enter your first name"
              required
            />
            {errors.first_name && (
              <div className="flex items-center mt-1 text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.first_name}</span>
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
              value={formData.lastName || ""}
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
              value={formData.email || ""}
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
              value={formData.phone || ""}
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

      <button
        onClick={submitForm}
        type="submit"
        className="w-full mt-6 p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

export default StudentInfoForm;
