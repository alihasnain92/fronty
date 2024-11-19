import { useState } from "react";

const CreateStudent = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    profileImage: null,
  });

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        profileImage: e.target.files[0],
      }));
    }
  };

  // Submit form data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct FormData to handle file uploads
    const formDataToSend = new FormData();
    formDataToSend.append("first_name", formData.first_name);
    formDataToSend.append("last_name", formData.last_name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone_number", formData.phone_number);
    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }

    try {
      const response = await fetch("http://localhost:3000/students", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to create student");
      }

      const data = await response.json();
      alert("Student created successfully!");
      console.log(data);
    } catch (error) {
      console.error(error);
      alert("Error creating student");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        className="w-full max-w-md p-4 bg-gray-100 rounded shadow"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4">Create Student</h2>

        {/* First Name */}
        <label className="block mb-2 font-semibold">First Name</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        {/* Last Name */}
        <label className="block mb-2 font-semibold">Last Name</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        {/* Email */}
        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        {/* Phone Number */}
        <label className="block mb-2 font-semibold">Phone Number</label>
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />

        {/* Profile Photo */}
        <label className="block mb-2 font-semibold">Profile Photo</label>
        <input
          type="file"
          name="profileImage"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Create Student
        </button>
      </form>
    </div>
  );
};

export default CreateStudent;
