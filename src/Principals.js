// Principals.js
import React, { useState, useEffect } from 'react';

const Principals = () => {
  const [principals, setPrincipals] = useState([]);
  const [newPrincipal, setNewPrincipal] = useState({ name: '' });

  const fetchPrincipals = async () => {
    try {
      const output = await window.api.runCommand('polaris', ['principals', 'list']);
      const principalData = output.split('\n').map(JSON.parse);
      setPrincipals(principalData);
    } catch (error) {
      console.error('Error fetching principals:', error);
    }
  };

  const handleCreatePrincipal = async () => {
    const { name } = newPrincipal;
    if (!name) {
      alert('Principal name is required');
      return;
    }

    try {
      await window.api.runCommand('polaris', ['principals', 'create', name]);
      alert('Principal created successfully');
      fetchPrincipals(); // Refresh the list
    } catch (error) {
      console.error('Error creating principal:', error);
    }
  };

  const handleDeletePrincipal = async (name) => {
    try {
      await window.api.runCommand('polaris', ['principals', 'delete', name]);
      alert('Principal deleted successfully');
      fetchPrincipals(); // Refresh the list
    } catch (error) {
      console.error('Error deleting principal:', error);
    }
  };

  useEffect(() => {
    fetchPrincipals();
  }, []);

  return (
    <div>
      <h2>Principals</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Client ID</th>
            <th>Type</th>
            <th>Created Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {principals.map((principal, index) => (
            <tr key={index}>
              <td>{principal.name}</td>
              <td>{principal.clientId}</td>
              <td>{principal.type || 'N/A'}</td>
              <td>{principal.createTimestamp}</td>
              <td>
                <button onClick={() => handleDeletePrincipal(principal.name)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Create New Principal</h3>
      <input
        type="text"
        placeholder="Principal Name"
        value={newPrincipal.name}
        onChange={(e) => setNewPrincipal({ ...newPrincipal, name: e.target.value })}
      />
      <button onClick={handleCreatePrincipal}>Create Principal</button>
    </div>
  );
};

export default Principals;
