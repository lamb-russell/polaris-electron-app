import React, { useState, useEffect } from 'react';

const CatalogRoles = ({ cliPath, host, port, clientId, clientSecret }) => {
  const [roles, setRoles] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState({});
  const [selectedInfo, setSelectedInfo] = useState({
    catalog: '',
    role: ''
  });

  const [newRole, setNewRole] = useState('');  // For creating a new catalog role
  const [roleToDelete, setRoleToDelete] = useState('');  // For deleting a catalog role

  const fetchCatalogsWithRoles = async () => {
    const catalogArgs = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'catalogs', 'list'
    ];
  
    try {
      const catalogOutput = await window.api.runCommand(cliPath, catalogArgs);
      const catalogData = catalogOutput.split('\n').filter(line => line).map(line => JSON.parse(line));
      setCatalogs(catalogData);
  
      const newAssignedRoles = {};
      for (const catalog of catalogData) {
        const roleArgs = [
          '--host', host,
          '--port', port,
          '--client-id', clientId,
          '--client-secret', clientSecret,
          'catalog-roles', 'list',
          catalog.name // Pass the catalog name as a positional argument (e.g., "my_warehouse")
        ];
        const roleOutput = await window.api.runCommand(cliPath, roleArgs);
        const roleData = roleOutput.split('\n').filter(line => line).map(line => JSON.parse(line).name);
        newAssignedRoles[catalog.name] = roleData;
      }
      setAssignedRoles(newAssignedRoles);
    } catch (error) {
      console.error('Error fetching catalogs and roles:', error);
    }
  };
  

  // Function to fetch available catalog roles
  const fetchRoles = async () => {
    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'catalog-roles', 'list'
    ];

    try {
      const output = await window.api.runCommand(cliPath, args);
      const roleData = output.split('\n').filter(line => line).map(line => JSON.parse(line));
      setRoles(roleData);
    } catch (error) {
      console.error('Error fetching catalog roles:', error);
    }
  };

  const handleAssignRole = async () => {
    const { catalog, role } = selectedInfo;
    if (!catalog || !role) {
      alert('Please select both a catalog and a role.');
      return;
    }
  
    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'catalog-roles', 'grant',
      role, // Role is passed as positional argument (e.g., "catalog_admin")
      '--catalog', catalog, // Catalog is passed as a named argument (e.g., "my_warehouse")
      '--principal-role', role // Principal role for the catalog
    ];
  
    try {
      await window.api.runCommand(cliPath, args);
      alert('Role assigned successfully');
      fetchCatalogsWithRoles(); // Refresh roles
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  };
  
  

  const handleDeleteRole = async () => {
    const { catalog, role } = selectedInfo;
    if (!catalog || !role) {
      alert('Please select both a catalog and a role to remove.');
      return;
    }
  
    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'catalog-roles', 'revoke',
      role, // Role is passed as positional argument
      '--catalog', catalog, // Catalog is passed as a named argument
      '--principal-role', role // Principal role to revoke from the catalog
    ];
  
    try {
      await window.api.runCommand(cliPath, args);
      alert('Role removed successfully');
      fetchCatalogsWithRoles(); // Refresh roles
    } catch (error) {
      console.error('Error removing role:', error);
    }
  };
  

  const handleCreateRole = async () => {
    if (!newRole || !selectedInfo.catalog) {
      alert('Please enter a role name and select a catalog.');
      return;
    }
  
    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'catalog-roles', 'create',
      newRole, // Role name as a positional argument
      '--catalog', selectedInfo.catalog // Catalog as a named argument
    ];
  
    try {
      await window.api.runCommand(cliPath, args);
      alert(`Role "${newRole}" created successfully for catalog "${selectedInfo.catalog}"`);
      setNewRole(''); // Clear input
      fetchRoles(); // Refresh the roles list
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };
  

  // Function to delete a catalog role
  const handleDeleteCatalogRole = async () => {
    if (!roleToDelete) {
      alert('Please select a role to delete.');
      return;
    }

    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'catalog-roles', 'delete',
      roleToDelete  // Role is a positional argument
    ];

    try {
      await window.api.runCommand(cliPath, args);
      alert(`Role "${roleToDelete}" deleted successfully`);
      setRoleToDelete(''); // Clear input
      fetchRoles(); // Refresh the roles list
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const handleRefresh = async () => {
    await fetchCatalogsWithRoles();
    await fetchRoles();
  };
  
  useEffect(() => {
    fetchRoles();
    fetchCatalogsWithRoles();
  }, [cliPath, host, port, clientId, clientSecret]);

  return (
    <div>
      <h2>Catalog Roles Management</h2>
      <button onClick={handleRefresh}>Refresh Catalogs and Roles</button> {/* Refresh button */}
  
      <h3>Assign or Remove Role</h3>
      <div>
        <select
          value={selectedInfo.catalog}
          onChange={(e) => setSelectedInfo({ ...selectedInfo, catalog: e.target.value })}
        >
          <option value="">Select Catalog</option>
          {catalogs.map((catalog, index) => (
            <option key={index} value={catalog.name}>
              {catalog.name}
            </option>
          ))}
        </select>

        <select
          value={selectedInfo.role}
          onChange={(e) => setSelectedInfo({ ...selectedInfo, role: e.target.value })}
        >
          <option value="">Select Role</option>
          {roles.map((role, index) => (
            <option key={index} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>

        <button onClick={handleAssignRole}>Assign Role</button>
        <button onClick={handleDeleteRole}>Remove Role</button>
      </div>

      <h3>Create New Catalog Role</h3>
      <div>
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Enter new role name"
        />
        <button onClick={handleCreateRole}>Create Role</button>
      </div>

      <h3>Delete Catalog Role</h3>
      <div>
        <select
          value={roleToDelete}
          onChange={(e) => setRoleToDelete(e.target.value)}
        >
          <option value="">Select Role to Delete</option>
          {roles.map((role, index) => (
            <option key={index} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
        <button onClick={handleDeleteCatalogRole}>Delete Role</button>
      </div>

      <h3>Catalogs and Their Assigned Roles</h3>
      <table>
        <thead>
          <tr>
            <th>Catalog</th>
            <th>Assigned Roles</th>
          </tr>
        </thead>
        <tbody>
          {catalogs.length === 0 ? (
            <tr>
              <td colSpan="2">No catalogs available.</td>
            </tr>
          ) : (
            catalogs.map((catalog, index) => (
              <tr key={index}>
                <td>{catalog.name}</td>
                <td>
                  {assignedRoles[catalog.name]?.length
                    ? assignedRoles[catalog.name].join(', ')
                    : 'No roles assigned'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CatalogRoles;
