import React, { useState, useEffect } from "react";

function AssetFulfillment() {
  // State variables to manage ticket information and asset status
  const [models, setModels] = useState([]); //for model data
  const [employees, setEmployees] = useState([]); //for employee data
  const [requests, setRequests] = useState([]); //for request data
  const [statuses, setStatuses] = useState([]); //for status data
  const [conditions, setConditions] = useState([]); // For condition data
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedRequest, setSelectedRequest] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // useEffect to fetch models and employee information
  useEffect(() => {
    //fetch models
    fetch("http://127.0.0.1:500/models")
      .then((response) => response.json())
      .then((data) => setModels(data))
      .catch((error) => console.error("Error retrieving models", error));

    //fetch employees
    fetch("http://127.0.0.1:5000/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error retrieving employees", error));

    // Fetch conditions
    fetch("http://127.0.0.1:5000/conditions")
      .then((response) => response.json())
      .then((data) => setConditions(data));

    // Fetch statuses
    fetch("http://127.0.0.1:5000/statuses")
      .then((response) => response.json())
      .then((data) => setStatuses(data));
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "model":
        setSelectedModel(value);
        break;
      case "assignedTo":
        setSelectedEmployee(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    //Construct requestData  object from the state variables
    const requestData = {
      ModelID: selectedModel,
      assignedTo: selectedEmployee,
    };

    //POST request to Flask backend
  };

  return (
    <div>
      <h2>Asset Fulfillment</h2>
      <div>
        <button>Fulfill Asset Request</button>
      </div>
    </div>
  );
}

export default AssetFulfillment;
