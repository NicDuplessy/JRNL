import React, { useState, useEffect } from "react";

function AssetEntry() {
  const [serialNum, setSerialNum] = useState("");
  const [models, setModels] = useState([]); // For model data
  const [conditions, setConditions] = useState([]); // For condition data
  const [statuses, setStatuses] = useState([]); // For status data
  const [employees, setEmployees] = useState([]); // For employee data
  const [stockrooms, setStockrooms] = useState([]); //For stockroom data
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedStockroom, setSelectedStockroom] = useState("");

  // Fetch data from the backend
  useEffect(() => {
    // Fetch models
    fetch("http://127.0.0.1:5000/models")
      .then((response) => response.json())
      .then((data) => setModels(data))
      .catch((error) => console.error("Error", error));

    // Fetch conditions
    fetch("http://127.0.0.1:5000/conditions")
      .then((response) => response.json())
      .then((data) => setConditions(data));

    // Fetch statuses
    fetch("http://127.0.0.1:5000/statuses")
      .then((response) => response.json())
      .then((data) => setStatuses(data));

    // Fetch employees
    fetch("http://127.0.0.1:5000/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data));

    fetch("http://127.0.0.1:5000/stockrooms")
      .then((response) => response.json())
      .then((data) => setStockrooms(data));
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "serialNum":
        setSerialNum(value);
        break;
      case "model":
        setSelectedModel(value);
        break;
      case "condition":
        setSelectedCondition(value);
        break;
      case "status":
        setSelectedStatus(value);
        break;
      case "assignedTo":
        setSelectedEmployee(value);
        break;
      case "stockroom":
        setSelectedStockroom(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Construct the asset data object from the state variables
    const assetData = {
      serialNum: serialNum,
      ModelID: selectedModel, // Ensure this matches the backend expectation
      condition_id: selectedCondition, // Ensure this matches the backend expectation
      status_id: selectedStatus, // Ensure this matches the backend expectation
      assignedTo: selectedEmployee,
      stockroom_id: selectedStockroom,
 
    };

    // POST request to the Flask backend
    fetch("http://127.0.0.1:5000/asset", {
      // Update the endpoint to '/asset'
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assetData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        // Handle success - for example, you might clear the form or display a success message
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors - for example, display an error message to the user
      });
  };

  return (
    <div>
      <h2>Asset Entry Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Serial Number:</label>
          <input
            type="text"
            name="serialNum"
            value={serialNum}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Model:</label>
          <select
            name="model"
            value={selectedModel}
            onChange={handleInputChange}
          >
            {models.map((m) => (
              <option key={m.ModelID} value={m.ModelID}>
                {m.ModelName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Condition:</label>
          <select
            name="condition"
            value={selectedCondition}
            onChange={handleInputChange}
          >
            {conditions.map((c) => (
              <option key={c.condition_id} value={c.condition_id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Status:</label>
          <select
            name="status"
            value={selectedStatus}
            onChange={handleInputChange}
          >
            {statuses.map((s) => (
              <option key={s.status_id} value={s.status_id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Assigned To (Employee):</label>
          <select
            name="assignedTo"
            value={selectedEmployee}
            onChange={handleInputChange}
          >
            {employees.map((e) => (
              <option key={e.EmployeeNumber} value={e.EmployeeNumber}>
                {e.FirstName} {e.LastName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Stockroom:</label>
          <select
            name="stockroom"
            value={selectedStockroom}
            onChange={handleInputChange}
          >
            {stockrooms.map((stockroom) => (
              <option key={stockroom.stockroom_id} value={stockroom.stockroom_id}>
                {stockroom.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default AssetEntry;
