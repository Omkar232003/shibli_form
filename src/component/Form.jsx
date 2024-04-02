import React, { useState, useEffect } from "react";
import { TextField, Button, Snackbar, LinearProgress } from "@mui/material";

const Form = () => {
  const [formData, setFormData] = useState({
    basicInfo: {
      name: "",
      email: "",
    },
    detailedInfo: {
      address: "",
      phoneNumber: "",
    },
  });

  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);
  const [submissionCompleted, setSubmissionCompleted] = useState(false);

  const totalSteps = 2;

  const percentage = Math.floor(((activeStep + 1) / totalSteps) * 100);

  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  const handleNext = () => {
    if (
      activeStep === 0 &&
      !formData.basicInfo.name &&
      !formData.basicInfo.email
    ) {
      setError("Please fill in all the required fields.");
    } else if (
      activeStep === 1 &&
      !formData.detailedInfo.address &&
      !formData.detailedInfo.phoneNumber
    ) {
      setError("Please fill in all the required fields.");
    } else {
      setError("");
      if (activeStep === totalSteps - 1) {
        setSubmissionCompleted(true);
      } else {
        setActiveStep(activeStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = () => {
    // Save form data to local storage
    localStorage.setItem("formData", JSON.stringify(formData));

    setOpenSuccessMessage(true);

    setFormData({
      basicInfo: {
        name: "",
        email: "",
      },
      detailedInfo: {
        address: "",
        phoneNumber: "",
      },
    });
    setActiveStep(0);
  };

  useEffect(() => {
    if (submissionCompleted) {
      const timer = setTimeout(() => {
        setSubmissionCompleted(false);
        localStorage.removeItem("formData");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submissionCompleted]);

  return (
    <div className="form-container">
      <h1>Techpaathsala Input Form</h1>
      <LinearProgress variant="determinate" value={percentage} />
      <div className="progress-percentage">{percentage}%</div>
      {activeStep === 0 && (
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="inputSection">
            <TextField
              type="text"
              name="name"
              placeholder="Name"
              value={formData.basicInfo.name}
              onChange={(e) => handleInputChange(e, "basicInfo")}
              required
            />
          </div>
          <TextField
            type="email"
            name="email"
            placeholder="Email"
            value={formData.basicInfo.email}
            onChange={(e) => handleInputChange(e, "basicInfo")}
            required
          />
        </div>
      )}
      {activeStep === 1 && (
        <div className="form-section">
          <h2>Detailed Information</h2>
          <div className="inputSection">
            <TextField
              type="text"
              name="address"
              placeholder="Address"
              value={formData.detailedInfo.address}
              onChange={(e) => handleInputChange(e, "detailedInfo")}
              required
            />
          </div>
          <TextField
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.detailedInfo.phoneNumber}
            onChange={(e) => handleInputChange(e, "detailedInfo")}
            required
          />
        </div>
      )}
      <div className="form-controls">
        {activeStep !== 0 && <Button onClick={handleBack}>Back</Button>}
        {error && <p className="error-message">{error}</p>}
        {!submissionCompleted && (
          <Button
            onClick={activeStep === totalSteps - 1 ? handleSubmit : handleNext}
          >
            {activeStep === totalSteps - 1 ? "Submit" : "Next"}
          </Button>
        )}
      </div>
      <Snackbar
        open={openSuccessMessage}
        autoHideDuration={6000}
        onClose={() => setOpenSuccessMessage(false)}
        message="Form submitted successfully!"
      />
      {submissionCompleted && <p>Thank you for submitting the form!</p>}
    </div>
  );
};

export default Form;
