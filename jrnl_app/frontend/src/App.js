import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import BrowserRouter, Route, Routes
import "./App.css";
import AssetEntry from "./components/assetEntry";
import AssetRequest from "./components/assetRequest";
import AssetRetirement from "./components/assetRetirement";
import AssetFulfillment from "./components/assetFulfillment";
import Navigation from "./components/Navigation";

function App() {
  return (
    <Router>
      <div>
        <header className="App-header">
          <h1>JRNL</h1>
          <h2>Asset Management</h2>
        </header>
        <body class="Navbar">
          <Navigation />
          <Routes>
            <Route class="Home" exact path="/" element={<Home />} />
            <Route class="Entry" path="/asset-entry" element={<AssetEntry />} />
            <Route
              class="Request"
              path="/asset-request"
              element={<AssetRequest />}
            />
            <Route
              class="Retirement"
              path="/asset-retirement"
              element={<AssetRetirement />}
            />
            <Route
              class="Fulfillment"
              path="/asset-fulfillment"
              element={<AssetFulfillment />}
            />
          </Routes>
        </body>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h1 class="Home-page">Welcome to JRNL Asset Management</h1>
      <p class="Home-page">
        This is the home page of our asset management application. You can use
        the navigation menu to access different features.
      </p>
    </div>
  );
}

export default App;
