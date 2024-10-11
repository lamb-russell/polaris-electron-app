import React, { useState } from 'react';

const Catalogs = ({ cliPath, host, port, clientId, clientSecret }) => {
  const [catalogs, setCatalogs] = useState([]);
  const [newCatalog, setNewCatalog] = useState({
    name: '',
    type: '',
    storageType: '',
    baseLocation: ''
  });

  // Function to fetch the list of catalogs from the Polaris CLI
  const fetchCatalogs = async () => {
    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'catalogs', 'list'
    ];

    try {
      const output = await window.api.runCommand(cliPath, args);  // Use cliPath here
      const catalogData = output.split('\n').filter(line => line).map(JSON.parse);
      setCatalogs(catalogData);
    } catch (error) {
      console.error('Error fetching catalogs:', error);
    }
  };

  // Function to create a new catalog using the CLI
  const handleCreateCatalog = async () => {
    const { name, type, storageType, baseLocation } = newCatalog;

    if (!name || !type || !storageType || !baseLocation) {
      alert('Please fill in all fields before creating a catalog.');
      return;
    }

    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'catalogs', 'create', name,
      '--type', type,
      '--storage-type', storageType,
      '--default-base-location', baseLocation
    ];

    try {
      await window.api.runCommand(cliPath, args);  // Use cliPath here
      alert('Catalog created successfully');
      setNewCatalog({
        name: '',
        type: '',
        storageType: '',
        baseLocation: ''
      }); // Reset the form after creation
      fetchCatalogs(); // Refresh the catalog list
    } catch (error) {
      console.error('Error creating catalog:', error);
    }
  };

  // Function to delete a catalog
  const handleDeleteCatalog = async (catalogName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the catalog "${catalogName}"?`);
    if (!confirmDelete) return;

    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'catalogs', 'delete', catalogName
    ];

    try {
      await window.api.runCommand(cliPath, args);  // Use cliPath here
      alert('Catalog deleted successfully');
      fetchCatalogs(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting catalog:', error);
    }
  };

  return (
    <div>
      <h2>Catalogs</h2>

      {/* Add the "List Catalogs" button here */}
      <button onClick={fetchCatalogs}>List Catalogs</button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Storage Type</th>
            <th>Base Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {catalogs.length === 0 ? (
            <tr>
              <td colSpan="5">No catalogs available.</td>
            </tr>
          ) : (
            catalogs.map((catalog, index) => (
              <tr key={index}>
                <td>{catalog.name}</td>
                <td>{catalog.type}</td>
                <td>{catalog.storageConfigInfo?.storageType}</td>
                <td>{catalog.properties?.['default-base-location']}</td>
                <td>
                  <button onClick={() => handleDeleteCatalog(catalog.name)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h3>Create New Catalog</h3>
      <input
        type="text"
        placeholder="Catalog Name"
        value={newCatalog.name}
        onChange={(e) => setNewCatalog({ ...newCatalog, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Catalog Type"
        value={newCatalog.type}
        onChange={(e) => setNewCatalog({ ...newCatalog, type: e.target.value })}
      />
      <input
        type="text"
        placeholder="Storage Type"
        value={newCatalog.storageType}
        onChange={(e) => setNewCatalog({ ...newCatalog, storageType: e.target.value })}
      />
      <input
        type="text"
        placeholder="Base Location"
        value={newCatalog.baseLocation}
        onChange={(e) => setNewCatalog({ ...newCatalog, baseLocation: e.target.value })}
      />
      <button onClick={handleCreateCatalog}>Create Catalog</button>
    </div>
  );
};

export default Catalogs;
