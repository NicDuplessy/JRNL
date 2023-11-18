import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import EntryIcon from './entry_icon.png';
import FulfillmentIcon from './fulfillment_icon.png';
import NavigationIcon from './navigation_icon.png';
import RequestIcon from './request_icon.png';
import AssetEntry from "./components/assetEntry";
import AssetRequest from "./components/assetRequest";
import AssetTracking from "./components/assetTracking";
import AssetFulfillment from "./components/assetFulfillment";
import JRNLLogo from './JRNL_No_text.png';


function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-logo-tile">
        <img src={JRNLLogo} alt="JRNL Logo" className="dashboard-logo" />
        <h1 className="dashboard-title">JRNL</h1>
        <p className="dashboard-subtitle">Asset Management Solutions</p>
      </div>
      <div className="dashboard-tiles-container">
        <DashboardTile icon={EntryIcon} label="ENTRY" to="/entry" />
        <DashboardTile icon={FulfillmentIcon} label="FULFILLMENT" to="/fulfillment" />
        <DashboardTile icon={NavigationIcon} label="TRACKING" to="/tracking" />
        <DashboardTile icon={RequestIcon} label="REQUEST" to="/request" />
      </div>
    </div>
  );
}

function DashboardTile({ icon, label, to }) {
  return (
    <Link to={to} className="dashboard-tile">
      <img src={icon} alt={label} />
      <p>{label}</p>
    </Link>
  );
}

function EntryView() {
  return (
    <div className="entry-view">
      <div className="logo-view">
        <img src={JRNLLogo} alt="JRNL Logo" className="dashboard-logo" />
        <h1 className="dashboard-title">ENTRY</h1>
        <p className="dashboard-subtitle">Add assets to the database.</p>
      </div>
      <div className="view-tiles-container">
        <div className="view-icon-container">
          <img src={EntryIcon} alt="Entry" className="view-icon" />
          {/* Removed the "ENTRY" heading here */}
        </div>
        <div className="asset-entry-container">
          <AssetEntry />
        </div>
      </div>
    </div>
  );
}

function TrackingView() {
  return (
    <div className="tracking-view">
      <div className="logo-view">
        <img src={JRNLLogo} alt="JRNL Logo" className="dashboard-logo" />
        <h1 className="dashboard-title">TRACKING</h1>
        <p className="dashboard-subtitle">Track assets throughout their lifecycle.</p>
      </div>
      <div className="view-tiles-container">
        <div className="view-icon-container" style={{ backgroundColor: '#51abb2' }}>
          <img src={NavigationIcon} alt="Tracking" className="view-icon" />
        </div>
        <div className="asset-entry-container">
          <AssetTracking />
        </div>
      </div>
    </div>
  );
}

function FulfillmentView() {
  return (
    <div className="fulfillment-view">
      <div className="logo-view">
        <img src={JRNLLogo} alt="JRNL Logo" className="dashboard-logo" />
        <h1 className="dashboard-title">FULFILLMENT</h1>
        <p className="dashboard-subtitle">View employee requests for assets.</p>
      </div>
      <div className="view-tiles-container">
        <div className="view-icon-container" style={{ backgroundColor: '#e16539' }}>
          <img src={FulfillmentIcon} alt="Fulfillment" className="view-icon" />
        </div>
        <div className="asset-entry-container">
          <AssetFulfillment />
        </div>
      </div>
    </div>
  );
}

function RequestView() {
  return (
    <div className="request-view">
      <div className="logo-view">
        <img src={JRNLLogo} alt="JRNL Logo" className="dashboard-logo" />
        <h1 className="dashboard-title">REQUEST</h1>
        <p className="dashboard-subtitle">New asset requisition and maintenance.</p>
      </div>
      <div className="view-tiles-container">
        <div className="view-icon-container" style={{ backgroundColor: '#e16539' }}>
          <img src={RequestIcon} alt="Request" className="view-icon" />
        </div>
        <div className="asset-entry-container">
          <AssetRequest />
        </div>
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/entry" element={<EntryView />} />
        <Route path="/request" element={<RequestView />} />
        <Route path="/fulfillment" element={<FulfillmentView />} />
        <Route path="/tracking" element={<TrackingView />} />
        <Route path="/" element={<Dashboard />} /> {/* Render the Dashboard component here */}
      </Routes>
    </Router>
  );
}


export default App;
