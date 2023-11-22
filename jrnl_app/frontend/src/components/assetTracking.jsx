import React, { useState } from 'react';
import axios from 'axios'; // You can use Axios for making API requests

function AssetTracking() {
  const [searchType, setSearchType] = useState('serialNumber'); // Default to searching by serial number
  const [searchValue, setSearchValue] = useState('');
  const [assetDetails, setAssetDetails] = useState(null);

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Make an API request to fetch asset details based on the selected search type and value
    try {
      const response = await axios.get(`/api/asset-tracking?searchType=${searchType}&searchValue=${searchValue}`);
      setAssetDetails(response.data);
    } catch (error) {
      console.error('Error fetching asset details:', error);
      // Handle errors as needed
    }
  };

  return (
    <div>
      <h2>Asset Tracking</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Search By:
            <select value={searchType} onChange={handleSearchTypeChange}>
              <option value="serialNumber">Serial Number</option>
              <option value="employeeName">Employee Name</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Search Value:
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchValueChange}
            />
          </label>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      {assetDetails && (
        <div>
          <h3>Asset Details</h3>
          <p>Serial Number: {assetDetails.serialNumber}</p>
          <p>Model: {assetDetails.model}</p>
          <p>Employee Name: {assetDetails.employeeName}</p>
          <p>Status: {assetDetails.status}</p>
          <p>Condition: {assetDetails.condition}</p>
          <p>Stockroom: {assetDetails.stockroom}</p>
        </div>
      )}
    </div>
  );
}

export default AssetTracking;
