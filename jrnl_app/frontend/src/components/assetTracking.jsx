import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AssetTracking() {
  // Define state variables
  const [serialNumber, setSerialNumber] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [assetInfo, setAssetInfo] = useState(null);

  // Function to handle the search and fetch asset information
  const searchAsset = async () => {
    try {
      // Define the search criteria based on user input
      let searchCriteria = {};

      if (serialNumber) {
        searchCriteria.serialNumber = serialNumber;
      } else if (employeeName) {
        searchCriteria.employeeName = employeeName;
      } else {
        // Handle case where neither serial number nor employee name is provided
        return;
      }

      // Send a request to the backend to fetch asset information
      const response = await axios.post('/api/search-asset', searchCriteria);

      // Update the assetInfo state with the fetched data
      setAssetInfo(response.data);
    } catch (error) {
      // Handle errors, e.g., display an error message to the user
      console.error('Error fetching asset information:', error);
    }
  };

  // Render the component
  return (
    <div>
      <h1>Asset Tracking</h1>
      <div>
        <label>Search by Serial Number:</label>
        <select
          onChange={(e) => setSerialNumber(e.target.value)}
          value={serialNumber}
        >
          <option value="">Select Serial Number</option>
          {/* Populate the dropdown with serial numbers from the database */}
          {serialNumbers.map((serial) => (
            <option key={serial} value={serial}>
              {serial}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Search by Employee Name:</label>
        <select
          onChange={(e) => setEmployeeName(e.target.value)}
          value={employeeName}
        >
          <option value="">Select Employee Name</option>
          {/* Populate the dropdown with employee names from the database */}
          {employeeNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={searchAsset}>Submit</button>

      {/* Display asset information if available */}
      {assetInfo && (
        <div>
          <h2>Asset Information</h2>
          <p>Serial Number: {assetInfo.serialNumber}</p>
          <p>Model: {assetInfo.model}</p>
          <p>Employee Name: {assetInfo.employeeName}</p>
          <p>Status: {assetInfo.status}</p>
          <p>Condition: {assetInfo.condition}</p>
          <p>Stockroom: {assetInfo.stockroom}</p>
        </div>
      )}
    </div>
  );
}

export default AssetTracking;
