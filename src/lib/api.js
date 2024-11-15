const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const submitEnrollment = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admissions/submit_application/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit application');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const uploadDocument = async (admissionCode, file, type) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  formData.append('admission_code', admissionCode);

  try {
    const response = await fetch(`${API_BASE_URL}/documents/upload/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload document');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const checkAdmissionStatus = async (admissionCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admissions/${admissionCode}/status/`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to check admission status');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const processPayment = async (admissionCode, paymentDetails) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/process/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        admission_code: admissionCode,
        ...paymentDetails,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to process payment');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};