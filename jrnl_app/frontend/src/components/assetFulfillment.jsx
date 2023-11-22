import React, { useState, useEffect } from "react";

function AssetFulfillment() {
  const [requestTickets, setRequestTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    // Fetch request tickets with status_id equal to 1 and sorted by date
    fetch("http://127.0.0.1:5000/request-tickets")
      .then((response) => response.json())
      .then((data) => {
        // Sort request tickets by date
        const sortedTickets = data.sort((a, b) => new Date(b.Date) - new Date(a.Date));
        setRequestTickets(sortedTickets);
      })
      .catch((error) => console.error("Error fetching request tickets:", error));

    // Fetch statuses
    fetch("http://127.0.0.1:5000/statuses")
      .then((response) => response.json())
      .then((data) => setStatuses(data))
      .catch((error) => console.error("Error fetching statuses:", error));

    // Fetch conditions
    fetch("http://127.0.0.1:5000/conditions")
      .then((response) => response.json())
      .then((data) => setConditions(data))
      .catch((error) => console.error("Error fetching conditions:", error));
  }, []);

  const handleTicketSelect = (event) => {
    const selectedTicketId = event.target.value;
    const ticket = requestTickets.find((t) => t.RequestNumber === Number(selectedTicketId));
    setSelectedTicket(ticket);
  };

  const handleStatusChange = (event) => {
    // Update the status of the selected ticket in the component state
    setSelectedTicket({
      ...selectedTicket,
      status_id: Number(event.target.value),
    });
  };

  const handleConditionChange = (event) => {
    // Update the condition of the selected ticket in the component state
    setSelectedTicket({
      ...selectedTicket,
      condition_id: Number(event.target.value),
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Update the request ticket in the database with the new status and condition
    fetch(`http://127.0.0.1:5000/update-request-ticket/${selectedTicket.RequestNumber}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedTicket),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Request ticket updated successfully:", data);
        // Handle success
      })
      .catch((error) => {
        console.error("Error updating request ticket:", error);
        // Handle errors
      });
  };

  return (
    <div className="asset-fulfillment">
      <h2>Asset Fulfillment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Request:</label>
          <select onChange={handleTicketSelect}>
            <option value="">Select a Request</option>
            {requestTickets.map((ticket) => (
              <option key={ticket.RequestNumber} value={ticket.RequestNumber}>
                {ticket.RequestNumber} - {ticket.Date}
              </option>
            ))}
          </select>
        </div>
        {selectedTicket && (
          <div>
            <h3>Request Details</h3>
            <div>
              <label>Serial Number:</label>
              <span>{selectedTicket.SerialNumber}</span>
            </div>
            <div>
              <label>Model:</label>
              <span>{selectedTicket.ModelID}</span>
            </div>
            <div>
              <label>Employee Name:</label>
              <span>{selectedTicket.EmployeeNumber}</span>
            </div>
            <div>
              <label>Date:</label>
              <span>{selectedTicket.Date}</span>
            </div>
            <div>
              <label>Issue:</label>
              <span>{selectedTicket.Issue}</span>
            </div>
            <div>
              <label>Status:</label>
              <select value={selectedTicket.status_id} onChange={handleStatusChange}>
                {statuses.map((status) => (
                  <option key={status.status_id} value={status.status_id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Condition:</label>
              <select value={selectedTicket.condition_id} onChange={handleConditionChange}>
                {conditions.map((condition) => (
                  <option key={condition.condition_id} value={condition.condition_id}>
                    {condition.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button type="submit">Submit</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default AssetFulfillment;
