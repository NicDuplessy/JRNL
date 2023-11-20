
import React, { useState, useEffect } from "react";

const AssetStatusUpdate = () => {
  const [assets, setAssets] = useState([]);
  const [statuses, setStatuses] = useState([]);
  
  // Fetch assets and statuses when the component mounts
  useEffect(() => {
    // Fetch assets
    fetch("/api/assets")
      .then((response) => response.json())
      .then((data) => {
        setAssets(data);
      });

    // Fetch statuses
    fetch("/api/statuses")
      .then((response) => response.json())
      .then((data) => {
        setStatuses(data);
      });
  }, []);
  
  // Handle status change
  const handleStatusChange = (assetId, newStatus) => {
    fetch(`/api/assets/${assetId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Asset status updated") {
        // Update the local state to reflect the change
        const updatedAssets = assets.map((asset) => {
          if (asset.id === assetId) {
            asset.status = newStatus;
          }
          return asset;
        });
        setAssets(updatedAssets);
      }
    });
  };

  return (
    <div>
      <h2>Update Asset Status</h2>
      <ul>
        {assets.map((asset) => (
          <li key={asset.id}>
            {asset.serialNum} - 
            <select
              value={asset.status}
              onChange={(e) => handleStatusChange(asset.id, e.target.value)}
            >
              {statuses.map((status) => (
                <option key={status.id} value={status.name}>
                  {status.name}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetStatusUpdate;
