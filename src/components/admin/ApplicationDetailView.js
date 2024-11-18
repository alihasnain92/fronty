import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, User, FileText, Award, Home, Phone, Book, LinkIcon } from 'lucide-react';

const ApplicationDetailView = ({ application, onClose }) => {
  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const InfoSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, value }) => (
    <div className="mb-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-gray-900">{value}</p>
    </div>
  );

  const DocumentPreview = ({ label, src }) => (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <div className="relative aspect-[3/2]">
        <img 
          src={src}
          alt={label}
          className="rounded-lg object-cover w-full h-full"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <span>Application {application.id}</span>
              {getStatusBadge(application.status)}
            </CardTitle>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto flex-1 p-6">
          <div className="grid gap-6">
            {/* Profile Overview */}
            <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <img 
                src={application.studentInfo.profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {`${application.studentInfo.firstName} ${application.studentInfo.lastName}`}
                </h2>
                <p className="text-gray-600">{application.admissionInfo.program}</p>
                <p className="text-sm text-gray-500 mt-1">Applied on {application.submissionDate}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <InfoSection title="Personal Information" icon={User}>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Email" value={application.studentInfo.email} />
                  <Field label="Phone" value={application.studentInfo.phoneNumber} />
                  <Field label="Date of Birth" value={application.basicInfo.dateOfBirth} />
                  <Field label="Gender" value={application.basicInfo.gender} />
                  <Field label="Nationality" value={application.basicInfo.nationality} />
                  <Field label="CNIC" value={application.basicInfo.cnicNumber} />
                </div>
              </InfoSection>

              {/* Admission Details */}
              <InfoSection title="Admission Details" icon={Award}>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Program" value={application.admissionInfo.program} />
                  <Field label="Major" value={application.admissionInfo.major} />
                  <Field label="Campus" value={application.admissionInfo.campus} />
                  <Field label="Shift" value={application.admissionInfo.shift} />
                  <Field label="Type" value={application.admissionInfo.admissionType} />
                  <Field 
                    label="Entry Test Status" 
                    value={application.isTestUnlocked ? "Unlocked" : "Locked"}
                  />
                </div>
              </InfoSection>

              {/* Academic Background */}
              <InfoSection title="Academic Background" icon={Book}>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-3">Matriculation</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Field 
                        label="Board" 
                        value={application.academicInfo.matriculation.boardUniversity} 
                      />
                      <Field 
                        label="Marks" 
                        value={`${application.academicInfo.matriculation.obtainedMarks}/${application.academicInfo.matriculation.totalMarks}`} 
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-3">Intermediate</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Field 
                        label="Board" 
                        value={application.academicInfo.intermediate.boardUniversity} 
                      />
                      <Field 
                        label="Marks" 
                        value={`${application.academicInfo.intermediate.obtainedMarks}/${application.academicInfo.intermediate.totalMarks}`} 
                      />
                    </div>
                  </div>
                </div>
              </InfoSection>

              {/* Contact Information */}
              <InfoSection title="Contact Information" icon={Phone}>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-3">Current Address</h4>
                    <Field 
                      label="Address" 
                      value={`${application.residenceInfo.present.address}, ${application.residenceInfo.present.area}, ${application.residenceInfo.present.city} - ${application.residenceInfo.present.postalCode}`} 
                    />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium mb-3">Guardian Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Name" value={application.guardianInfo.name} />
                      <Field label="Relation" value={application.guardianInfo.relationship} />
                      <Field label="Contact" value={application.guardianInfo.contactNumber} />
                      <Field label="Occupation" value={application.guardianInfo.occupation} />
                    </div>
                  </div>
                </div>
              </InfoSection>
            </div>

            {/* Documents */}
            <InfoSection title="Submitted Documents" icon={LinkIcon}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DocumentPreview label="CNIC Front" src={application.documents.nicFront} />
                <DocumentPreview label="CNIC Back" src={application.documents.nicBack} />
                <DocumentPreview label="Matric Certificate" src={application.documents.matricCertificate} />
                <DocumentPreview label="Inter Certificate" src={application.documents.intermediateMarksheet} />
              </div>
            </InfoSection>

            {/* Action Buttons */}
            {application.status === 'pending' && (
              <div className="flex gap-4 mt-6">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Approve & Unlock Test
                </button>
                <button className="flex-1 border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                  Reject Application
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationDetailView;