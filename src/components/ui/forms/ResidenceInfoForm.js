import React, { useState, useEffect } from 'react';
import { Home, AlertCircle, Info } from 'lucide-react';

const CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Peshawar",
  "Quetta",
  "Multan",
  "Faisalabad",
  "Hyderabad",
  "Sialkot"
];

const KARACHI_AREAS = [
  // Central District
  "Gulberg",
  "Liaquatabad",
  "New Karachi",
  "North Nazimabad",
  "North Karachi",
  // East District
  "Gulshan-e-Iqbal",
  "Federal B Area",
  "Jamshed Town",
  "Ferozabad",
  "Gulzar-e-Hijri",
  "Mustafa Taj Colony",
  // West District
  "Orangi",
  "Baldia",
  "Manghopir",
  "SITE",
  // South District
  "Clifton",
  "Defence Housing Authority",
  "Saddar",
  "Lyari",
  // Malir District
  "Malir",
  "Landhi",
  "Korangi",
  "Model Colony",
  // Korangi District
  "Korangi Industrial Area",
  "Shah Faisal Colony",
  "Bin Qasim Town",
  // Other
  "Other Area"
];

const ResidenceInfoForm = ({ formData = {}, onChange, onValidation }) => {
  const [errors, setErrors] = useState({});
  const [sameAsPresentAddress, setSameAsPresentAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const updatedData = { ...formData };

    if (name.startsWith('present')) {
      updatedData[name] = value;

      // Update permanent address if checkbox is checked
      if (sameAsPresentAddress) {
        const permanentName = name.replace('present', 'permanent');
        updatedData[permanentName] = updatedData[name];
      }
    } else if (name.startsWith('permanent')) {
      updatedData[name] = value;
    } else if (name === 'sameAsPresentAddress') {
      // Handle checkbox change
      setSameAsPresentAddress(e.target.checked);

      if (e.target.checked) {
        updatedData.permanentAddress = formData.presentAddress || '';
        updatedData.permanentCity = formData.presentCity || '';
        updatedData.permanentArea = formData.presentArea || '';
        updatedData.permanentPostalCode = formData.presentPostalCode || '';

        // Validate permanent fields
        validateField('permanentAddress', updatedData.permanentAddress, updatedData);
        validateField('permanentCity', updatedData.permanentCity, updatedData);
        validateField('permanentArea', updatedData.permanentArea, updatedData);
        validateField('permanentPostalCode', updatedData.permanentPostalCode, updatedData);
      } else {
        updatedData.permanentAddress = '';
        updatedData.permanentCity = '';
        updatedData.permanentArea = '';
        updatedData.permanentPostalCode = '';

        // Clear errors
        setErrors((prevErrors) => ({
          ...prevErrors,
          permanentAddress: '',
          permanentCity: '',
          permanentArea: '',
          permanentPostalCode: '',
        }));
      }
    }

    onChange(updatedData);
    validateField(name, value, updatedData);
  };

  const validateField = (name, value, updatedData) => {
    let fieldErrors = { ...errors };

    switch (name) {
      case 'presentAddress':
      case 'permanentAddress':
        fieldErrors[name] = !value?.trim() ? 'Address is required' : '';
        break;

      case 'presentCity':
      case 'permanentCity':
        fieldErrors[name] = !value ? 'City is required' : '';
        break;

      case 'presentArea':
      case 'permanentArea':
        fieldErrors[name] = !value ? 'Area is required' : '';
        break;

      case 'presentPostalCode':
      case 'permanentPostalCode':
        if (name === 'presentPostalCode' || (name === 'permanentPostalCode' && value)) {
          if (!/^\d{5}$/.test(value)) {
            fieldErrors[name] = 'Please enter a valid 5-digit postal code';
          } else {
            fieldErrors[name] = '';
          }
        } else {
          fieldErrors[name] = '';
        }
        break;

      default:
        break;
    }

    setErrors(fieldErrors);
    return !Object.values(fieldErrors).some(error => error);
  };

  // Format postal code input
  const handlePostalCodeChange = (e) => {
    const { name, value } = e.target;
    const numbers = value.replace(/[^\d]/g, '').slice(0, 5);
    handleChange({ target: { name, value: numbers } });
  };

  // Validation Effect
  useEffect(() => {
    const requiredFields = [
      'presentAddress',
      'presentCity',
      'presentArea',
      'presentPostalCode',
      'permanentAddress',
      'permanentCity',
      'permanentArea',
    ];

    const isValid = !Object.values(errors).some(error => error) &&
      requiredFields.every(field => formData[field]);

    onValidation?.(isValid);
  }, [errors, formData, onValidation]);

  const submitForm = async (e) => {
    e.preventDefault();

    const requiredFields = [
      'presentAddress',
      'presentCity',
      'presentArea',
      'presentPostalCode',
      'permanentAddress',
      'permanentCity',
      'permanentArea',
    ];

    let isValid = true;
    requiredFields.forEach((field) => {
      isValid = validateField(field, formData[field], formData) && isValid;
    });

    if (!isValid) return;

    setIsSubmitting(true);

    const payload = {
      student_id: formData.student_id,
      present_address: formData.presentAddress,
      present_city: formData.presentCity,
      present_area: formData.presentArea,
      present_postal_code: formData.presentPostalCode,
      permanent_address: formData.permanentAddress,
      permanent_city: formData.permanentCity,
      permanent_area: formData.permanentArea,
      permanent_postal_code: formData.permanentPostalCode,
    };

    try {
      const response = await fetch("http://localhost:3001/residence-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error while submitting the form:", errorDetails);
        throw new Error(`Failed to submit the form: ${JSON.stringify(errorDetails)}`);
      }

      console.log("Residence info saved successfully");
      if (typeof onValidation === "function") {
        onValidation(true);
      }
    } catch (error) {
      console.error("Error:", error);
      if (typeof onValidation === "function") {
        onValidation(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submitForm}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Form Guidelines */}
        <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-100">
          <h4 className="font-medium text-amber-800 mb-2 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Important Information
          </h4>
          <ul className="list-disc list-inside space-y-2 text-sm text-amber-700">
            <li>All fields marked with <span className="text-red-500">*</span> are mandatory</li>
            <li>For Karachi, select your area from the dropdown</li>
            <li>For other cities, please type your area name</li>
            <li>Postal code is required for present address</li>
            <li>Use the checkbox to copy present address details to permanent address</li>
            <li>Please ensure all address details are accurate and match your official documents</li>
          </ul>
        </div>

        {/* Present Address Section */}
        <div className={sectionClass}>
          <div className="flex items-center mb-6">
            <Home className="w-6 h-6 text-teal-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">Present Address</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Address */}
            <div>
              <label htmlFor="presentAddress" className={labelClass}>
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="presentAddress"
                name="presentAddress"
                value={formData.presentAddress || ''}
                onChange={handleChange}
                className={`${inputClass(errors.presentAddress)} min-h-[80px]`}
                placeholder="Enter your complete present address"
                required
              />
              {errors.presentAddress && (
                <div className="flex items-center mt-1 text-red-500">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{errors.presentAddress}</span>
                </div>
              )}
            </div>

            {/* City, Area, Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City */}
              <div>
                <label htmlFor="presentCity" className={labelClass}>
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  id="presentCity"
                  name="presentCity"
                  value={formData.presentCity || ''}
                  onChange={handleChange}
                  className={inputClass(errors.presentCity)}
                  required
                >
                  <option value="">Select City</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.presentCity && (
                  <div className="flex items-center mt-1 text-red-500">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errors.presentCity}</span>
                  </div>
                )}
              </div>

              {/* Area */}
              <div>
                <label htmlFor="presentArea" className={labelClass}>
                  Area <span className="text-red-500">*</span>
                </label>
                {formData.presentCity === 'Karachi' ? (
                  <select
                    id="presentArea"
                    name="presentArea"
                    value={formData.presentArea || ''}
                    onChange={handleChange}
                    className={inputClass(errors.presentArea)}
                    required
                  >
                    <option value="">Select Area</option>
                    {KARACHI_AREAS.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="presentArea"
                    name="presentArea"
                    value={formData.presentArea || ''}
                    onChange={handleChange}
                    className={inputClass(errors.presentArea)}
                    placeholder="Enter your area"
                    required
                  />
                )}
                {errors.presentArea && (
                  <div className="flex items-center mt-1 text-red-500">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errors.presentArea}</span>
                  </div>
                )}
              </div>

              {/* Postal Code */}
              <div>
                <label htmlFor="presentPostalCode" className={labelClass}>
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="presentPostalCode"
                  type="text"
                  name="presentPostalCode"
                  value={formData.presentPostalCode || ''}
                  onChange={handlePostalCodeChange}
                  className={inputClass(errors.presentPostalCode)}
                  placeholder="Enter 5-digit postal code"
                  maxLength={5}
                  required
                />
                {errors.presentPostalCode && (
                  <div className="flex items-center mt-1 text-red-500">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errors.presentPostalCode}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Permanent Address Section */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Home className="w-6 h-6 text-teal-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">Permanent Address</h2>
            </div>
            <div className="flex items-center">
              <input
                id="sameAsPresentAddress"
                type="checkbox"
                name="sameAsPresentAddress"
                checked={sameAsPresentAddress}
                onChange={handleChange}
                className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
              />
              <label htmlFor="sameAsPresentAddress" className="ml-2 text-sm text-gray-600">
                Same as Present Address
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Address */}
            <div>
              <label htmlFor="permanentAddress" className={labelClass}>
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="permanentAddress"
                name="permanentAddress"
                value={formData.permanentAddress || ''}
                onChange={handleChange}
                className={`${inputClass(errors.permanentAddress)} min-h-[80px]`}
                placeholder="Enter your complete permanent address"
                disabled={sameAsPresentAddress}
                required
              />
              {errors.permanentAddress && (
                <div className="flex items-center mt-1 text-red-500">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{errors.permanentAddress}</span>
                </div>
              )}
            </div>

            {/* City, Area, Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City */}
              <div>
                <label htmlFor="permanentCity" className={labelClass}>
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  id="permanentCity"
                  name="permanentCity"
                  value={formData.permanentCity || ''}
                  onChange={handleChange}
                  className={inputClass(errors.permanentCity)}
                  disabled={sameAsPresentAddress}
                  required
                >
                  <option value="">Select City</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.permanentCity && (
                  <div className="flex items-center mt-1 text-red-500">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errors.permanentCity}</span>
                  </div>
                )}
              </div>

              {/* Area */}
              <div>
                <label htmlFor="permanentArea" className={labelClass}>
                  Area <span className="text-red-500">*</span>
                </label>
                {formData.permanentCity === 'Karachi' ? (
                  <select
                    id="permanentArea"
                    name="permanentArea"
                    value={formData.permanentArea || ''}
                    onChange={handleChange}
                    className={inputClass(errors.permanentArea)}
                    disabled={sameAsPresentAddress}
                    required
                  >
                    <option value="">Select Area</option>
                    {KARACHI_AREAS.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="permanentArea"
                    name="permanentArea"
                    value={formData.permanentArea || ''}
                    onChange={handleChange}
                    className={inputClass(errors.permanentArea)}
                    placeholder="Enter your area"
                    disabled={sameAsPresentAddress}
                    required
                  />
                )}
                {errors.permanentArea && (
                  <div className="flex items-center mt-1 text-red-500">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errors.permanentArea}</span>
                  </div>
                )}
              </div>

              {/* Postal Code */}
              <div>
                <label htmlFor="permanentPostalCode" className={labelClass}>
                  Postal Code
                </label>
                <input
                  id="permanentPostalCode"
                  type="text"
                  name="permanentPostalCode"
                  value={formData.permanentPostalCode || ''}
                  onChange={handlePostalCodeChange}
                  className={inputClass(errors.permanentPostalCode)}
                  placeholder="Enter 5-digit postal code (optional)"
                  maxLength={5}
                  disabled={sameAsPresentAddress}
                />
                {errors.permanentPostalCode && (
                  <div className="flex items-center mt-1 text-red-500">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{errors.permanentPostalCode}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Save Information"}
        </button>
      </div>
    </form>
  );
};

export default ResidenceInfoForm;
