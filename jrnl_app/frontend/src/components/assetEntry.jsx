import React, { useState } from "react";

function AssetEntry() {
  const [serialNum, setSerialNum] = useState("");
  const [status, setStatus] = useState("");
  const [model, setModel] = useState("");
  const [condition, setCondition] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "serialNum":
        setSerialNum(value);
        break;
      case "status":
        setStatus(value);
        break;
      case "model":
        setModel(value);
        break;
      case "condition":
        setCondition(value);
        break;
      case "assignedTo":
        setAssignedTo(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    const formData = {
      name: serialNum, // Assuming serialNum is being used as the asset name
      description: model, // Assuming model is being used as the description
      location: assignedTo,
      status: status,
    };

    fetch("http://localhost:5000/assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          console.log(data.message); // Log success message from server
        } else {
          console.error("Error:", data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <input
        type="text"
        name="serialNum"
        placeholder="Serial Number"
        value={serialNum}
        onChange={handleInputChange}
      />
      <select
        name="status"
        value={status}
        onChange={handleInputChange}
        placeholder="Status"
      >
        <option value="">Select Status</option>
        <option value="In Use">In Use</option>
        <option value="Available">Available</option>
        <option value="On Order">On Order</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Unknown">Unknown</option>
        <option value="Retired">Retired</option>
      </select>
      <select
        name="model"
        value={model}
        onChange={handleInputChange}
        placeholder="Model"
      >
        <option value="">Select Model</option>
        <option value="Spectre">Spectre</option>
        <option value="ThinkPad">ThinkPad</option>
        <option value="Zenbook">Zenbook</option>
        <option value="XPS">XPS</option>
        <option value="MacBook">MacBook</option>
      </select>
      <select
        name="condition"
        value={condition}
        onChange={handleInputChange}
        placeholder="Condition"
      >
        <option value="">Select Condition</option>
        <option value="New">New</option>
        <option value="Good">Good</option>
        <option value="Fair">Fair</option>
        <option value="Unknown">Unknown</option>
        <option value="Scrap">Scrap</option>
      </select>
      <input
        type="text"
        name="assignedTo"
        placeholder="Assigned To"
        value={assignedTo}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default AssetEntry;
