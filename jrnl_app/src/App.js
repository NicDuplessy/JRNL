import logo from "./logo.svg";
import "./App.css";
import AssetEntry from "./components/assetEntry";
import AssetRequest from "./components/assetRequest";

function App() {
  return (
    <div>
      <header>
        <h1>JRNL</h1>
        <h2>Asset Management </h2>
      </header>
      <body>
        <section>
          <h3>Asset Entry</h3>
          <AssetEntry />
        </section>
        <section>
          <h3>Asset Request</h3>
          <AssetRequest />
        </section>
      </body>
    </div>
  );
}

export default App;
