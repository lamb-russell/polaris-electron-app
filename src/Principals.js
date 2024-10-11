import React, { useState, useEffect } from 'react';

const Principals = ({ cliPath, host, port, clientId, clientSecret }) => {
  const [principals, setPrincipals] = useState([]);
  const [newPrincipal, setNewPrincipal] = useState({
    name: '',
    type: 'SERVICE' // Default type, update if you have other types
  });

  // Function to fetch the list of principals from the Polaris CLI
  const fetchPrincipals = async () => {
    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'principals', 'list'
    ];

    try {
      const output = await window.api.runCommand(cliPath, args);
      const principalData = output.split('\n').filter(line => line).map(JSON.parse);
      setPrincipals(principalData);
    } catch (error) {
      console.error('Error fetching principals:', error);
    }
  };

  // Function to create a new principal
  const handleCreatePrincipal = async () => {
    const { name, type } = newPrincipal;
    if (!name) {
      alert('Principal name is required');
      return;
    }

    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'principals', 'create', name,
      '--type', type // Optional, if you want to support other types
    ];

    try {
      await window.api.runCommand(cliPath, args);
      alert('Principal created successfully');
      setNewPrincipal({ name: '', type: 'SERVICE' }); // Reset the form
      fetchPrincipals();  // Refresh the list after creation
    } catch (error) {
      console.error('Error creating principal:', error);
    }
  };

  // Function to delete a principal
  const handleDeletePrincipal = async (name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the principal "${name}"?`);
    if (!confirmDelete) return;

    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'principals', 'delete', name
    ];

    try {
      await window.api.runCommand(cliPath, args);
      alert('Principal deleted successfully');
      fetchPrincipals();  // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting principal:', error);
    }
  };

  // Fetch principals when the component is first mounted
  useEffect(() => {
    fetchPrincipals();
  }, [cliPath, host, port, clientId, clientSecret]);

  return (
    <div>
      <h2>Principals</h2>

      <button onClick={fetchPrincipals}>List Principals</button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Created Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {principals.length === 0 ? (
            <tr>
              <td colSpan="4">No principals available.</td>
            </tr>
          ) : (
            principals.map((principal, index) => (
              <tr key={index}>
                <td>{principal.name}</td>
                <td>{principal.type || 'N/A'}</td>
                <td>{principal.createTimestamp}</td>
                <td>
                  <button onClick={() => handleDeletePrincipal(principal.name)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h3>Create New Principal</h3>
      <input
        type="text"
        placeholder="Principal Name"
        value={newPrincipal.name}
        onChange={(e) => setNewPrincipal({ ...newPrincipal, name: e.target.value })}
      />
      <select
        value={newPrincipal.type}
        onChange={(e) => setNewPrincipal({ ...newPrincipal, type: e.target.value })}
      >
        <option value="SERVICE">SERVICE</option>
        {/* Add other types if necessary */}
      </select>
      <button onClick={handleCreatePrincipal}>Create Principal</button>
    </div>
  );
};

export default Principals;
