import React, { useState, useEffect } from "react";
import axios from "axios";

function AssetTracking() {
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [employeeNames, setEmployeeNames] = useState([]);
  const [selectedSerialNumber, setSelectedSerialNumber] = useState("");
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [assetInfo, setAssetInfo] = useState([]);

  const handleSearch = async () => {
    try {
      // Define the search criteria based on user input
      let searchCriteria = {};
      if (selectedSerialNumber) {
        searchCriteria.serialNumber = selectedSerialNumber;
      } else if (selectedEmployeeName) {
        searchCriteria.employeeName = selectedEmployeeName;
      } else {
        // Handle case where neither serial number nor employee name is provided
        alert("Please select a Serial Number or an Employee Name."); // Simple alert, or use a more sophisticated approach
        return;
      }

      // Send a request to the backend to fetch asset information
      const response = await axios.post(
        "http://127.0.0.1:5000/api/search-asset",
        searchCriteria
      );
      console.log("Response:", response);
      setAssetInfo(response.data);
      console.log("Asset Info:", assetInfo);
      console.log("Asset Info:", assetInfo.serialNumber);
    } catch (error) {
      console.error("Error fetching asset information:", error);
      alert("Failed to fetch asset information."); // Simple alert, or use a more sophisticated approach
    }
  };

  useEffect(() => {
    // Fetch Serial Numbers
    fetch("http://127.0.0.1:5000/serial-numbers")
      .then((response) => response.json())
      .then((data) => setSerialNumbers(data))
      .catch((error) => console.error("Error fetching serial numbers:", error));

    // Fetch Employee Names
    fetch("http://127.0.0.1:5000/employees") // Adjust if a different endpoint is used for employee names
      .then((response) => response.json())
      .then((data) => {
        const names = data.map((emp) => `${emp.FirstName} ${emp.LastName}`);
        setEmployeeNames(names);
      })
      .catch((error) => console.error("Error fetching employee names:", error));

    console.log("Updated asset info:", assetInfo);
  }, [assetInfo]);

  return (
    <div className="asset-entry-form">
      <h1>Asset Tracking</h1>
      <div>
        <label>Search by Serial Number:</label>
        <select
          onChange={(e) => setSelectedSerialNumber(e.target.value)}
          value={selectedSerialNumber}
        >
          <option value="">Select Serial Number</option>
          {serialNumbers.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Search by Employee Name:</label>
        <select
          onChange={(e) => setSelectedEmployeeName(e.target.value)}
          value={selectedEmployeeName}
        >
          <option value="">Select Employee Name</option>
          {employeeNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSearch}>Submit</button>
      {assetInfo && (
        <div>
          <h2>Asset Information</h2>
          {/* Render the asset information */}
          <p>Serial Number: {assetInfo.SerialNumber}</p>
          <p>Model: {assetInfo.ModelID}</p>
          <p>Employee Name: {assetInfo.employeeName}</p>
          <p>Status: {assetInfo.status_id}</p>
          <p>Condition: {assetInfo.condition_id}</p>
          <p>Stockroom: {assetInfo.stockroom_id}</p>
        </div>
      )}
    </div>
  );
}

export default AssetTracking;
