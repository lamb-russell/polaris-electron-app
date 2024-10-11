import React, { useState, useEffect } from 'react';

const PrincipalRoles = ({ cliPath, host, port, clientId, clientSecret }) => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({
    principalRole: '',
  });
  const [grantInfo, setGrantInfo] = useState({
    principal: '',
    principalRole: ''
  });
  const [revokeInfo, setRevokeInfo] = useState({
    principal: '',
    principalRole: ''
  });

  // Function to fetch the list of principal roles from the Polaris CLI
  const fetchPrincipalRoles = async () => {
    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'principal-roles', 'list'
    ];

    try {
      const output = await window.api.runCommand(cliPath, args);
      const roleData = output.split('\n').filter(line => line).map(JSON.parse);
      setRoles(roleData);
    } catch (error) {
      console.error('Error fetching principal roles:', error);
    }
  };

  // Function to create a new principal role
  const handleCreateRole = async () => {
    const { principalRole } = newRole;
    if (!principalRole) {
      alert('Role name is required');
      return;
    }

    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'principal-roles', 'create', principalRole
    ];

    try {
      await window.api.runCommand(cliPath, args);
      alert('Principal role created successfully');
      setNewRole({ principalRole: '' });
      fetchPrincipalRoles();  // Refresh the list after creation
    } catch (error) {
      console.error('Error creating principal role:', error);
    }
  };

  // Function to delete a principal role
  const handleDeleteRole = async (principalRole) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the role "${principalRole}"?`);
    if (!confirmDelete) return;

    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'principal-roles', 'delete', principalRole
    ];

    try {
      await window.api.runCommand(cliPath, args);
      alert('Principal role deleted successfully');
      fetchPrincipalRoles();  // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting principal role:', error);
    }
  };

  // Function to grant a principal role to a principal
  const handleGrantRole = async () => {
    const { principal, principalRole } = grantInfo;
    if (!principal || !principalRole) {
      alert('Both principal and principal role are required');
      return;
    }

    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'principal-roles', 'grant', principalRole,
      '--principal', principal
    ];

    try {
      await window.api.runCommand(cliPath, args);
      alert('Principal role granted successfully');
      setGrantInfo({ principal: '', principalRole: '' });
      fetchPrincipalRoles();  // Refresh the list after granting
    } catch (error) {
      console.error('Error granting principal role:', error);
    }
  };

  // Function to revoke a principal role from a principal
  const handleRevokeRole = async () => {
    const { principal, principalRole } = revokeInfo;
    if (!principal || !principalRole) {
      alert('Both principal and principal role are required');
      return;
    }

    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'principal-roles', 'revoke', principalRole,
      '--principal', principal
    ];

    try {
      await window.api.runCommand(cliPath, args);
      alert('Principal role revoked successfully');
      setRevokeInfo({ principal: '', principalRole: '' });
      fetchPrincipalRoles();  // Refresh the list after revoking
    } catch (error) {
      console.error('Error revoking principal role:', error);
    }
  };

  useEffect(() => {
    fetchPrincipalRoles();
  }, [cliPath, host, port, clientId, clientSecret]);

  return (
    <div>
      <h2>Principal Roles</h2>

      <button onClick={fetchPrincipalRoles}>List Principal Roles</button>

      <table>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Principal</th>
            <th>Catalog</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.length === 0 ? (
            <tr>
              <td colSpan="4">No principal roles available.</td>
            </tr>
          ) : (
            roles.map((role, index) => (
              <tr key={index}>
                <td>{role.name}</td>
                <td>{role.principal || 'N/A'}</td>
                <td>{role.catalog || 'N/A'}</td>
                <td>
                  <button onClick={() => handleDeleteRole(role.name)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h3>Create New Principal Role</h3>
      <input
        type="text"
        placeholder="Principal Role"
        value={newRole.principalRole}
        onChange={(e) => setNewRole({ ...newRole, principalRole: e.target.value })}
      />
      <button onClick={handleCreateRole}>Create Role</button>

      <h3>Grant Role to Principal</h3>
      <input
        type="text"
        placeholder="Principal"
        value={grantInfo.principal}
        onChange={(e) => setGrantInfo({ ...grantInfo, principal: e.target.value })}
      />
      <input
        type="text"
        placeholder="Principal Role"
        value={grantInfo.principalRole}
        onChange={(e) => setGrantInfo({ ...grantInfo, principalRole: e.target.value })}
      />
      <button onClick={handleGrantRole}>Grant Role</button>

      <h3>Revoke Role from Principal</h3>
      <input
        type="text"
        placeholder="Principal"
        value={revokeInfo.principal}
        onChange={(e) => setRevokeInfo({ ...revokeInfo, principal: e.target.value })}
      />
      <input
        type="text"
        placeholder="Principal Role"
        value={revokeInfo.principalRole}
        onChange={(e) => setRevokeInfo({ ...revokeInfo, principalRole: e.target.value })}
      />
      <button onClick={handleRevokeRole}>Revoke Role</button>
    </div>
  );
};

export default PrincipalRoles;
