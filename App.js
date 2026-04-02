import React, { useState } from 'react';

function App() {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    course: '',
    fee: 0
  });

  // Error State
  const [errors, setErrors] = useState({});

  // Course Fees (for UI display only)
  const courseFees = {
    "Computer Science": 50000,
    "Business Administration": 40000,
    "Mechanical Engineering": 45000,
    "Fine Arts": 30000
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "course") {
      setFormData({
        ...formData,
        course: value,
        fee: courseFees[value] || 0
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error while typing
    setErrors({ ...errors, [name]: '' });
  };

  // Validation Function
  const validate = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.course) {
      newErrors.course = "Please select a course";
    }

    return newErrors;
  };

  // Handle Submit (Connected to FastAPI)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          course: formData.course
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Registration Successful!
Student: ${data.data.fullName}
Course: ${data.data.course}
Total Fee: $${data.data.fee}`);

        // Reset form
        setFormData({
          fullName: '',
          email: '',
          course: '',
          fee: 0
        });

      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '450px',
      margin: '50px auto',
      border: '1px solid #ddd',
      borderRadius: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>

      <h2 style={{ textAlign: 'center', color: '#007bff' }}>
        College Registration
      </h2>

      <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
        Please enter your details below.
      </p>

      <form onSubmit={handleSubmit}>

        {/* Full Name */}
        <div style={{ marginBottom: '15px' }}>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: errors.fullName ? '1px solid red' : '1px solid #ccc'
            }}
          />
          {errors.fullName && (
            <p style={{ color: 'red', fontSize: '12px' }}>
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div style={{ marginBottom: '15px' }}>
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@college.edu"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: errors.email ? '1px solid red' : '1px solid #ccc'
            }}
          />
          {errors.email && (
            <p style={{ color: 'red', fontSize: '12px' }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Course */}
        <div style={{ marginBottom: '15px' }}>
          <label>Select Course:</label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: errors.course ? '1px solid red' : '1px solid #ccc'
            }}
          >
            <option value="">-- Choose a Program --</option>
            {Object.keys(courseFees).map(course => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          {errors.course && (
            <p style={{ color: 'red', fontSize: '12px' }}>
              {errors.course}
            </p>
          )}
        </div>

        {/* Fee Display */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <span>Calculated Tuition Fee:</span>
          <h3>${formData.fee.toLocaleString()}</h3>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '12px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Submit Registration
        </button>

      </form>
    </div>
  );
}

export default App;