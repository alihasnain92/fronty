import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

const AgreementForm = ({ onValidation }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    setShowError(!checked);
    onValidation?.(checked);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">AGREEMENT</h2>
          </div>

          {/* Undertaking Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Undertaking</h3>
            <ul className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>If my percentage as per my upcoming results is less than the eligibility criteria of my admission in bachelors' program will be cancelled.</li>
              <li>If the announcement as per the of Sindh government regarding 3% additional grace marks being allotted to students is made redundant, this condition will not facilitate the admission process and the admission will be cancelled.</li>
              <li>Fees will not be refunded if the admission is cancelled in any circumstances.</li>
            </ul>
          </div>

          {/* Fee Refund Policy */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Refund Policy</h3>
            <p className="text-gray-700 mb-2">Withdrawals from university are entitled to refund of fee according to the following schedule:</p>
            <ul className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Within one week of the commencement of classes 100% of tuition fee.</li>
              <li>Within two weeks of commencement of classes 50% of tuition fees.</li>
              <li>After two weeks of commencement of classes No refund.</li>
            </ul>
          </div>

          {/* Attendance Policy */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Policy</h3>
            <p className="text-gray-700">
              Attendance in person, at all prescribed and elective lectures and seminars is mandatory. Maximum of 20% absences 
              are allowed in a subject to cater for emergencies, sickness etc. There is no provision of leaves in excess of the 
              allowance mentioned above. 20% or more absences in a subject will result in 'F' grade in that subject. Any student, 
              who fails to comply with the rules, forfeits the right to appear at the examination in the course concerned. Such a 
              situation shall earn the student 'F' (failure) in the course.
            </p>
          </div>

          {/* Disability Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Release of Information about Disability</h3>
            <p className="text-gray-700">
              The data about your physical and/or mental health contained within Admission form will be kept confidential in 
              accordance with the university's Disability Policy. The information will be shared with the Admission Department 
              and members of the Accessibility Committee to provide necessary support during the application process, interview 
              and entrance test.
            </p>
          </div>

          {/* Agreement Checkbox */}
          <div className="mt-8 pt-6 border-t">
            <div className="space-y-2">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreement"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className={`mt-1 h-4 w-4 rounded border-gray-300 
                    focus:ring-2 focus:ring-offset-2
                    ${isChecked 
                      ? 'text-teal-600 focus:ring-teal-500' 
                      : 'text-gray-300 focus:ring-red-500'
                    }
                    ${showError ? 'border-red-500' : 'border-gray-300'}
                  `}
                  required
                />
                <label htmlFor="agreement" className="ml-3 text-sm text-gray-700">
                  I have read and agree to all the terms and conditions mentioned above
                  <span className="text-red-500 ml-1">*</span>
                </label>
              </div>
              
              {showError && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>You must agree to the terms and conditions to proceed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementForm;