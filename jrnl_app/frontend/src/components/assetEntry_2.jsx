import React, { useState } from "react";

function AssetEntry() {
  const [serialNum, setSerialNum] = useState("");
  const [status, setStatus] = useState("");
  const [model, setModel] = useState("");
  const [condition, setCondition] = useState("");
  const [stockroomNum, setStockroomNum] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [notes, setNotes] = useState("");
  const [specs, setSpecs] = useState("");

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
      case "stockroomNum":
        setStockroomNum(value);
        break;
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "notes":
        setNotes(value);
        break;
      case "specs":
        setSpecs(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    console.log({
      serialNum,
      status,
      model,
      condition,
      stockroomNum,
      assignedTo: { firstName, lastName },
      notes,
      specs,
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
      <select name="status" value={status} onChange={handleInputChange}>
        <option value="">Select Status</option>
        <option value="In Use">In Use</option>
        <option value="Available">Available</option>
        <option value="On Order">On Order</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Unknown">Unknown</option>
        <option value="Retired">Retired</option>
      </select>
      <select name="model" value={model} onChange={handleInputChange}>
        <option value="">Select Model</option>
        <option value="ThinkPad">ThinkPad</option>
        <option value="MacBook">MacBook</option>
        <option value="Spectre">Spectre</option>
      </select>
      <select name="condition" value={condition} onChange={handleInputChange}>
        <option value="">Select Condition</option>
        <option value="New">New</option>
        <option value="Good">Good</option>
        <option value="Fair">Fair</option>
        <option value="Unknown">Unknown</option>
        <option value="Scrap">Scrap</option>
      </select>
      <input
        type="text"
        name="stockroomNum"
        placeholder="Stockroom Number"
        value={stockroomNum}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={firstName}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={lastName}
        onChange={handleInputChange}
      />
      <textarea
        name="notes"
        placeholder="Notes"
        maxLength={300}
        value={notes}
        onChange={handleInputChange}
      ></textarea>
      <input
        type="text"
        name="specs"
        placeholder="Technical Specifications (e.g. CPU/RAM)"
        value={specs}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default AssetEntry;
