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
    // You can handle the form submission here
    // For example, you can log the form values to the console
    console.log({
      serialNum,
      status,
      model,
      condition,
      assignedTo,
    });

    // You can also send the form data to an API or perform other actions here
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
      <input
        type="text"
        name="status"
        placeholder="Status"
        value={status}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="model"
        placeholder="Model"
        value={model}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="condition"
        placeholder="Condition"
        value={condition}
        onChange={handleInputChange}
      />
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
