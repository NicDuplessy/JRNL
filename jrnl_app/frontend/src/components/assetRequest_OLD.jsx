import React, { useState, useEffect } from 'react';

function AssetRequests() {
  const [requestNumber, setRequestNumber] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [issue, setIssue] = useState('');
  const [assetData, setAssetData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch next available request number
  useEffect(() => {
    fetch('/api/requests/next-request-number')
      .then((response) => response.json())
      .then((data) => setRequestNumber(data.nextRequestNumber));
  }, []);

  // Fetch asset data
  useEffect(() => {
    fetch('/api/assets')
      .then((response) => response.json())
      .then((data) => setAssetData(data.assets));
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'employeeName':
        setEmployeeName(value);
        break;
      case 'serialNumber':
        setSerialNumber(value);
        break;
      case 'issue':
        setIssue(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Construct the asset request data object
    const assetRequestData = {
      requestNumber,
      employeeName,
      serialNumber,
      issue,
    };

    // Send a POST request to create the asset request
    fetch('/api/requests/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assetRequestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setIsSubmitted(true);

        // Update the status of the asset to 'under maintenance'
        fetch(`/api/assets/${serialNumber}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ statusId: 1 }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            console.log('Asset status updated successfully');
          })
          .catch((error) => {
            console.error('Error updating asset status:', error);
          });
      })
      .catch((error) => {
        console.error('Error submitting asset request:', error);
        setIsSubmitted(false);
      });
  };

  return (
    <div className="asset-request-form">
      <h2>Asset Request Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Request Number:</label>
          <input
            type="text"
            name="requestNumber"
            value={requestNumber}
            disabled
          />
        </div>
        <div>
          <label>Employee Name:</label>
          <select
            name="employeeName"
            value={employeeName}
            onChange={handleInputChange}
          >
            {assetData.map((asset) => (
              <option key={asset.assetID} value={asset.assetID}>
                {asset.assetName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Serial Number:</label>
          <select
            name="serialNumber"
            value={serialNumber}
            onChange={handleInputChange}
          >
