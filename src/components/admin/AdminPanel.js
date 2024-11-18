// src/components/admin/AdminPanel.js
"use client";
import React, { useState } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import ApplicationDetailView from "./ApplicationDetailView";


// Button Component
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Card Component
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Badge Component
const Badge = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      className
    )}
    {...props}
  />
));
Badge.displayName = "Badge";

// Icons Components
const Search = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-search", className)}
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const Filter = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-filter", className)}
    {...props}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const Eye = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-eye", className)}
    {...props}
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const Check = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-check", className)}
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const X = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-x", className)}
    {...props}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const User = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-user", className)}
    {...props}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const FileText = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-file-text", className)}
    {...props}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </svg>
);

// Sample application data structure
const sampleApplications = [
  {
    id: "APP001",
    studentInfo: {
      profilePhoto: "/placeholder.jpg",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phoneNumber: "+1234567890",
    },
    admissionInfo: {
      currentQualification: "Intermediate",
      admissionType: "Regular",
      program: "BS Computer Science",
      major: "Software Engineering",
      campus: "Main Campus",
      shift: "Morning",
    },
    basicInfo: {
      fatherName: "Robert Doe",
      gender: "Male",
      dateOfBirth: "1999-05-15",
      nationality: "Pakistani",
      religion: "Islam",
      cnicNumber: "12345-1234567-1",
      province: "Punjab",
      disability: {
        hasDisability: false,
        details: "",
      },
    },
    residenceInfo: {
      present: {
        address: "123 Main St",
        city: "Lahore",
        area: "Johar Town",
        postalCode: "54000",
      },
      permanent: {
        address: "123 Main St",
        city: "Lahore",
        area: "Johar Town",
        postalCode: "54000",
      },
    },
    guardianInfo: {
      name: "Robert Doe",
      relationship: "Father",
      contactNumber: "+1234567891",
      cnicNumber: "12345-1234567-2",
      education: "Masters",
      occupation: "Engineer",
      organization: "Tech Corp",
      designation: "Senior Engineer",
      email: "robert@example.com",
    },
    academicInfo: {
      matriculation: {
        educationSystem: "Matric",
        boardUniversity: "Lahore Board",
        institute: "City School",
        passingYear: "2018",
        groupMajor: "Science",
        resultStatus: "Passed",
        rollNumber: "12345",
        obtainedMarks: "950",
        totalMarks: "1100",
      },
      intermediate: {
        educationSystem: "FSc",
        boardUniversity: "Lahore Board",
        institute: "Government College",
        passingYear: "2020",
        groupMajor: "Pre-Engineering",
        resultStatus: "Passed",
        rollNumber: "67890",
        obtainedMarks: "880",
        totalMarks: "1100",
      },
    },
    documents: {
      nicFront: "/placeholder.jpg",
      nicBack: "/placeholder.jpg",
      matricMarksheet: "/placeholder.jpg",
      intermediateMarksheet: "/placeholder.jpg",
      guardianCNIC: "/placeholder.jpg",
      matricCertificate: "/placeholder.jpg",
      intermediatePartOne: "/placeholder.jpg",
    },
    status: "pending",
    isTestUnlocked: false,
    submissionDate: "2024-11-15",
  },
];

// Main AdminPanel Component
const AdminPanel = () => {
  const [applications, setApplications] = useState(sampleApplications);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtering logic
  const filteredApplications = applications.filter(
    (app) =>
      app.studentInfo.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.studentInfo.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.admissionInfo.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-200 text-yellow-800",
      approved: "bg-green-200 text-green-800",
      rejected: "bg-red-200 text-red-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-sm ${statusStyles[status]}`}
      >
        {status}
      </span>
    );
  };

  const handleUnlockTest = (applicationId) => {
    setApplications(
      applications.map((app) =>
        app.id === applicationId
          ? { ...app, isTestUnlocked: true, status: "approved" }
          : app
      )
    );
  };

  const handleReject = (applicationId) => {
    setApplications(
      applications.map((app) =>
        app.id === applicationId
          ? { ...app, status: "rejected", isTestUnlocked: false }
          : app
      )
    );
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Admission Applications Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 text-sm">Total Applications</div>
              <div className="text-2xl font-bold">{applications.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 text-sm">Approved</div>
              <div className="text-2xl font-bold">
                {applications.filter((app) => app.status === "approved").length}
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-yellow-600 text-sm">Pending Review</div>
              <div className="text-2xl font-bold">
                {applications.filter((app) => app.status === "pending").length}
              </div>
            </div>
          </div>
          {/* Search and Filter Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, ID, or program..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Applications Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Student Name</th>
                  <th className="p-4 text-left">Program</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Submission Date</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application) => (
                  <tr
                    key={application.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4">{application.id}</td>
                    <td className="p-4">
                      {`${application.studentInfo.firstName} ${application.studentInfo.lastName}`}
                    </td>
                    <td className="p-4">{application.admissionInfo.program}</td>
                    <td className="p-4">
                      {application.admissionInfo.admissionType}
                    </td>
                    <td className="p-4">{application.submissionDate}</td>
                    <td className="p-4">
                      {getStatusBadge(application.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(application)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {application.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600"
                              onClick={() => handleUnlockTest(application.id)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleReject(application.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailView
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
