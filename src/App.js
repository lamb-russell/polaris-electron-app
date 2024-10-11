import React, { useState } from 'react';
import './App.css';
import Catalogs from './Catalogs';
import Principals from './Principals';
import PrincipalRoles from './PrincipalRoles';

// Access environment variables
const DEFAULT_POLARIS_CLI_PATH = process.env.REACT_APP_POLARIS_CLI_PATH || './polaris';
const DEFAULT_HOST = process.env.REACT_APP_POLARIS_HOST || 'localhost';
const DEFAULT_PORT = process.env.REACT_APP_POLARIS_PORT || '8181';
const DEFAULT_CLIENT_ID = process.env.REACT_APP_POLARIS_CLIENT_ID || '';
const DEFAULT_CLIENT_SECRET = process.env.REACT_APP_POLARIS_CLIENT_SECRET || '';

function App() {
  const [cliPath, setCliPath] = useState(DEFAULT_POLARIS_CLI_PATH);
  const [host, setHost] = useState(DEFAULT_HOST);
  const [port, setPort] = useState(DEFAULT_PORT);
  const [clientId, setClientId] = useState(DEFAULT_CLIENT_ID);
  const [clientSecret, setClientSecret] = useState(DEFAULT_CLIENT_SECRET);

  return (
    <div className="App">
      <header>Polaris Management GUI</header>

      <section className="config-section">
        <h3>Polaris CLI Configuration</h3>
        <div className="config-fields">
          <input
            type="text"
            placeholder="Polaris CLI Path"
            value={cliPath}
            onChange={(e) => setCliPath(e.target.value)}
          />
          <input
            type="text"
            placeholder="Host"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          />
          <input
            type="text"
            placeholder="Port"
            value={port}
            onChange={(e) => setPort(e.target.value)}
          />
          <input
            type="text"
            placeholder="Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
          <input
            type="password"
            placeholder="Client Secret"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
          />
        </div>
      </section>

      <section className="catalog-section">
        <h3>Catalogs</h3>
        <Catalogs
          cliPath={cliPath}  
          host={host}
          port={port}
          clientId={clientId}
          clientSecret={clientSecret}
        />
      </section>

      <section className="principal-section">
        <h3>Principals</h3>
        {/* Pass CLI configuration as props to the Principals component */}
        <Principals
          cliPath={cliPath}  
          host={host}
          port={port}
          clientId={clientId}
          clientSecret={clientSecret}
        />
      </section>

      <section className="roles-section">
        <h3>Principal Roles</h3>
        {/* Pass CLI configuration as props to the PrincipalRoles component */}
        <PrincipalRoles
          cliPath={cliPath}  
          host={host}
          port={port}
          clientId={clientId}
          clientSecret={clientSecret}
        />
      </section>
    </div>
  );
}

export default App;
