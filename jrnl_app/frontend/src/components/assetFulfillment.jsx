import React, { useState, useEffect } from "react";

function AssetFulfillment() {
  const [requestTickets, setRequestTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [laptopModel, setLaptopModel] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function fetchLaptopModel(serialNumber) {
    // Fetch the ModelID from the asset table
    const response1 = await fetch(`http://127.0.0.1:5000/asset/${serialNumber}`);
    const data1 = await response1.json();
    const modelID = data1.ModelID;
  
    // Fetch the ModelName from the model table
    const response2 = await fetch(`http://127.0.0.1:5000/model/${modelID}`);
    const data2 = await response2.json();
    return data2.ModelName;
  }

  async function fetchEmployeeName(employeeNumber) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/employee/${employeeNumber}/name`);
      const data = await response.json();
      return `${data.firstName} ${data.lastName}`;
    } catch (error) {
      console.error('Error fetching employee name:', error);
    }
  }

    // Fetch the laptop model when the selected ticket changes
  useEffect(() => {
    if (selectedTicket && selectedTicket.SerialNumber) {
      fetchLaptopModel(selectedTicket.SerialNumber).then(setLaptopModel);
    }
  }, [selectedTicket]);

    // Fetch the employee name when the selected ticket changes
  useEffect(() => {
    if (selectedTicket) {
      fetchEmployeeName(selectedTicket.EmployeeNumber).then(setEmployeeName);
    }
  }, [selectedTicket]);

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

  function handleFormSubmit(event) {
    event.preventDefault();
  
    const data = {
      status_id: selectedTicket.status_id,
      condition_id: selectedTicket.condition_id,
      // Include any other data that needs to be updated
    };
  
    fetch(`http://127.0.0.1:5000/request/${selectedTicket.RequestNumber}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsSubmitted(true);
        } else {
          // Handle error
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <div className="asset-entry-form">
      <h2>Asset Fulfillment</h2>
      <form onSubmit={handleFormSubmit}>
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
              <span className="static-data">{selectedTicket.SerialNumber}</span>
            </div>
            <div>
              <label>Model:</label>
              <span className="static-data">{laptopModel}</span>
            </div>
            <div>
              <label>Employee Name:</label>
              <span className="static-data">{employeeName}</span>
            </div>
            <div>
              <label>Date:</label>
              <span className="static-data">{selectedTicket.Date}</span>
            </div>
            <div>
              <label>Issue:</label>
              <span className="static-data">{selectedTicket.Issue}</span>
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
              {isSubmitted && <p>Asset Status Updated</p>}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default AssetFulfillment;
