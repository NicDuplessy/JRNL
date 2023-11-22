import React, { useState, useEffect } from "react";

function AssetRequests() {
  const [requestNumber, setRequestNumber] = useState(""); // For the next request number
  const [serialNumbers, setSerialNumbers] = useState([]); // For serial numbers from the asset table
  const [employees, setEmployees] = useState([]); // For employee data
  const [selectedEmployee, setSelectedEmployee] = useState(""); // Selected employee
  const [issue, setIssue] = useState(""); // Issue description
  const [isSubmitted, setIsSubmitted] = useState(false); // Submission status
  const [selectedSerialNumber, setSelectedSerialNumber] = useState("");
  const [requestDate, setRequestDate] = useState(""); // State for the date
  const [conditions, setConditions] = useState(""); // For condition data
  const [statuses, setStatuses] = useState("");

  // Fetch data from the backend
  useEffect(() => {
    // Fetch next request number
    fetch("http://127.0.0.1:5000/next-request-number")
      .then((response) => response.json())
      .then((data) => setRequestNumber(data.nextRequestNumber))
      .catch((error) => console.error("Error fetching request number:", error));

    // Fetch statuses
    fetch("http://127.0.0.1:5000/statuses")
      .then((response) => response.json())
      .then((data) => setStatuses(data));

    // Fetch conditions
    fetch("http://127.0.0.1:5000/conditions")
      .then((response) => response.json())
      .then((data) => setConditions(data));

    // Fetch serial numbers
    fetch("http://127.0.0.1:5000/serial-numbers") // Update the URL to the new endpoint
      .then((response) => response.json())
      .then((data) => setSerialNumbers(data))
      .catch((error) => console.error("Error fetching serial numbers:", error));

    // Fetch employees (similar to assetEntry)
    fetch("http://127.0.0.1:5000/employees")
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error fetching employees:", error));

    if (selectedEmployee) {
      fetch(`http://127.0.0.1:5000/employee-status/${selectedEmployee}`)
        .then((response) => response.json())
        .then((data) => setStatuses(data.status)); // Assuming the response has a `status` property

      fetch(`http://127.0.0.1:5000/employee-condition/${selectedEmployee}`)
        .then((response) => response.json())
        .then((data) => setConditions(data.condition)); // Assuming the response has a `condition` property
      fetch(`http://127.0.0.1:5000/employee/${selectedEmployee}/asset`)
        .then((response) => response.json())
        .then((data) => {
          if (data.SerialNumber) {
            setSelectedSerialNumber(data.SerialNumber);
          } else {
            // Handle the case where the employee has no asset
            setSelectedSerialNumber("");
          }
        })
        .catch((error) => {
          console.error("Error fetching employee asset:", error);
          setSelectedSerialNumber(""); // Reset or handle error
        });

      const fetchEmployeeAssetDetails = async () => {
        if (selectedEmployee) {
          try {
            // Fetch asset details for the selected employee
            const response = await fetch(
              `http://127.0.0.1:5000/employee/${selectedEmployee}/asset`
            );
            const assetData = await response.json();
            if (assetData.SerialNumber) {
              setSelectedSerialNumber(assetData.SerialNumber); // Set the serial number
            } else {
              setSelectedSerialNumber(""); // No asset found for the selected employee
            }
          } catch (error) {
            console.error("Error fetching employee asset details:", error);
          }
        }
      };

      fetchEmployeeAssetDetails();
    }
  }, [selectedEmployee]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "assignedTo":
        setSelectedEmployee(value);
        break;
      case "issue":
        setIssue(value);
        break;
      case "requestDate":
        setRequestDate(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const requestData = {
      RequestNumber: requestNumber,
      EmployeeNumber: selectedEmployee,
      SerialNumber: selectedSerialNumber,
      Issue: issue,
      Date: requestDate,
      status_id: statuses,
      condition_id: conditions,
    };

    // POST request to Flask backend
    fetch("http://127.0.0.1:5000/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        setIsSubmitted(true);
        // Handle success
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsSubmitted(false);
        // Handle errors
      });
  };

  return (
    <div className="asset-entry-form">
      <h2>Asset Request Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Request Number:</label>
          <input type="text" value={requestNumber} disabled />
        </div>
        <div>
          <label>Serial Number:</label>
          <input type="text" value={selectedSerialNumber} disabled />
        </div>
        <div>
          <label>Assigned To (Employee):</label>
          <select
            name="assignedTo"
            value={selectedEmployee}
            onChange={handleInputChange}
          >
            {employees.map((e) => (
              <option key={e.EmployeeNumber} value={e.EmployeeNumber}>
                {e.FirstName} {e.LastName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Issue:</label>
          <input
            type="text"
            name="issue"
            maxLength="255"
            value={issue}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="requestDate"
            value={requestDate}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Status Number:</label>
          <input type="text" value={statuses} />
        </div>
        <div>
          <label>Condition Number:</label>
          <input type="text" value={conditions} />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      {isSubmitted && <p>Form submitted successfully!</p>}
    </div>
  );
}

export default AssetRequests;
