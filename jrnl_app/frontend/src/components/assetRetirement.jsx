import React, { useState, useEffect } from "react";
// import axios from 'axios'; // Commented out backend integration for now

const AssetRetirement = () => {
  const [assets, setAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [criteria, setCriteria] = useState({
    serialNumber: "",
    model: "Select Model",
    employeeAssigned: "",
  });

  useEffect(() => {
    // Simulate fetching assets when the component mounts
    // Replace this with an actual backend API call
    const fetchedAssets = [
      {
        id: 1,
        name: "Asset 1",
        serialNumber: "SN001",
        model: "Spectre",
        employeeAssigned: "Employee A",
      },
      {
        id: 2,
        name: "Asset 2",
        serialNumber: "SN002",
        model: "Thinkpad",
        employeeAssigned: "Employee B",
      },
      // ... Add more assets here ...
    ];

    setAssets(fetchedAssets);
  }, []);

  const retireAssets = () => {
    // Simulate retiring assets - replace with actual backend integration
    console.log("Retiring assets:", selectedAssets);
    console.log("Criteria:", criteria);

    // Make a request to retire selected assets with specified criteria
    // axios.post('/api/retire', { selectedAssets, criteria }).then((response) => {
    //   // Update UI or show a success message
    //   // You may also want to handle errors here
    // });
  };

  const handleAssetSelection = (asset) => {
    // Toggle asset selection
    if (selectedAssets.includes(asset.id)) {
      setSelectedAssets(selectedAssets.filter((id) => id !== asset.id));
    } else {
      setSelectedAssets([...selectedAssets, asset.id]);
    }
  };

  return (
    <div>
      <div>
        <label>Serial Number:</label>
        <input
          type="text"
          value={criteria.serialNumber}
          placeholder="Serial Number"
          onChange={(e) =>
            setCriteria({ ...criteria, serialNumber: e.target.value })
          }
        />
      </div>
      <div>
        <label>Model:</label>
        <select
          value={criteria.model}
          onChange={(e) => setCriteria({ ...criteria, model: e.target.value })}
        >
          <option value="Select Model">Select Model</option>
          <option value="Spectre">Spectre</option>
          <option value="Thinkpad">Thinkpad</option>
          <option value="Zenbook">Zenbook</option>
          <option value="XPS">XPS</option>
          <option value="Macbook">Macbook</option>
        </select>
      </div>
      <div>
        <label>Employee Assigned:</label>
        <input
          type="text"
          value={criteria.employeeAssigned}
          placeholder="Assigned To"
          onChange={(e) =>
            setCriteria({ ...criteria, employeeAssigned: e.target.value })
          }
        />
      </div>
      {/* UI for displaying assets and selecting them */}
      <ul>
        {assets.map((asset) => (
          <li key={asset.id}>
            <input
              type="checkbox"
              checked={selectedAssets.includes(asset.id)}
              onChange={() => handleAssetSelection(asset)}
            />
            {asset.name} (Serial Number: {asset.serialNumber}, Model:{" "}
            {asset.model}, Employee Assigned: {asset.employeeAssigned})
          </li>
        ))}
      </ul>
      <button onClick={retireAssets}>Retire Selected Assets</button>
    </div>
  );
};

export default AssetRetirement;
