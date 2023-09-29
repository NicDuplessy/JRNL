import React, { useState } from "react";

function AssetRequest() {
  const [typeDevice, setTypeDevice] = useState("");
  const [requester, setRequester] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "typeDevice":
        setTypeDevice(value);
        break;
      case "requester":
        setRequester(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    // You can handle the form submission here
    // For example, you can log the form values to the console
    console.log({
      typeDevice,
      requester,
    });

    // You can also send the form data to an API or perform other actions here
  };

  return (
    <div>
      <select
        name="typeDevice"
        value={typeDevice}
        onChange={handleInputChange}
        placeholder="Model Needed"
      >
        <option value="">Select Model Needed</option>
        <option value="Spectre">Spectre</option>
        <option value="ThinkPad">ThinkPad</option>
        <option value="Zenbook">Zenbook</option>
        <option value="XPS">XPS</option>
        <option value="MacBook">MacBook</option>
      </select>
      <input
        type="text"
        name="requester"
        placeholder="Your name"
        value={requester}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default AssetRequest;
