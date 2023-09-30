import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav className="Menu">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/asset-entry">Asset Entry</Link>
        </li>
        <li>
          <Link to="/asset-request">Asset Request</Link>
        </li>
        <li>
          <Link to="/asset-retirement">Asset Retirement</Link>
        </li>
        <li>
          <Link to="/asset-fulfillment">Asset Fulfillment</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
