import React, { useState, useEffect } from "react";

function AssetFulfillment() {
  // State variables to manage ticket information and asset status
  const [ticket, setTicket] = useState(null);
  const [assetsAvailable, setAssetsAvailable] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // useEffect to simulate fetching ticket and asset data
  useEffect(() => {
    // Simulate fetching ticket data
    // Replace with actual API call to retrieve ticket details
    const fetchTicketData = async () => {
      // Example ticket data
      const ticketData = {
        id: 1,
        assetRequest: "Request details from user",
        status: "Assigned",
        // ... other ticket information ...
      };
      setTicket(ticketData);
    };

    // Simulate fetching available assets from the stockroom
    // Replace with actual API call to retrieve asset data
    const fetchAvailableAssets = async () => {
      // Example asset data
      const availableAssets = [
        { id: 1, name: "Asset 1", status: "Available" },
        { id: 2, name: "Asset 2", status: "Available" },
        // ... other available assets ...
      ];
      setAssetsAvailable(availableAssets);
    };

    fetchTicketData();
    fetchAvailableAssets();
  }, []);

  // Function to update asset status and close the ticket
  const fulfillAssetRequest = () => {
    // Simulate updating asset status and closing the ticket
    // Replace with actual API calls to update asset and ticket data
    console.log("Asset request fulfilled:", selectedAsset);
    console.log("Ticket closed:", ticket);

    // Clear selected asset
    setSelectedAsset(null);
  };

  return (
    <div>
      <h2>Asset Fulfillment</h2>
      {ticket && (
        <div>
          <h3>Ticket Details</h3>
          <p>Request: {ticket.assetRequest}</p>
          <p>Status: {ticket.status}</p>
          {/* ... other ticket information ... */}
        </div>
      )}
      {assetsAvailable.length > 0 && (
        <div>
          <h3>Available Assets</h3>
          <ul>
            {assetsAvailable.map((asset) => (
              <li key={asset.id}>
                <label>
                  <input
                    type="radio"
                    name="selectedAsset"
                    value={asset.id}
                    checked={selectedAsset === asset.id}
                    onChange={() => setSelectedAsset(asset.id)}
                  />
                  {asset.name} (Status: {asset.status})
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedAsset && (
        <div>
          <button onClick={fulfillAssetRequest}>Fulfill Asset Request</button>
        </div>
      )}
    </div>
  );
}

export default AssetFulfillment;
