import React, { useState, useEffect } from 'react';

const PrincipalRoles = ({ cliPath, host, port, clientId, clientSecret }) => {
  const [roles, setRoles] = useState([]);
  const [principals, setPrincipals] = useState([]);
  const [principalRoles, setPrincipalRoles] = useState([]);  // To track which roles are assigned to principals

  const [selectedInfo, setSelectedInfo] = useState({
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

  // Function to fetch roles assigned to a specific principal
  const fetchPrincipalRolesForPrincipal = async (principal) => {
    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'principal-roles', 'list',
      '--principal', principal
    ];

    try {
      const output = await window.api.runCommand(cliPath, args);
      const assignedRoles = output.split('\n').filter(line => line).map(JSON.parse);
      return assignedRoles;
    } catch (error) {
      console.error(`Error fetching roles for principal ${principal}:`, error);
      return [];
    }
  };

  // Function to load all principals with their assigned roles
  const loadPrincipalRoles = async () => {
    const principalRoleAssignments = [];

    for (const principal of principals) {
      const assignedRoles = await fetchPrincipalRolesForPrincipal(principal.name);
      principalRoleAssignments.push({ principal: principal.name, roles: assignedRoles });
    }

    setPrincipalRoles(principalRoleAssignments);
  };

  // Function to assign a role to a principal
  const handleAssignRole = async () => {
    const { principal, principalRole } = selectedInfo;
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
      alert('Role assigned successfully');
      loadPrincipalRoles();  // Reload the list after assignment
    } catch (error) {
      console.error('Error assigning role to principal:', error);
    }
  };

  // Function to revoke a role from a principal
  const handleRevokeRole = async () => {
    const { principal, principalRole } = selectedInfo;
    if (!principal || !principalRole) {
      alert('Both principal and principal role are required to revoke');
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
      alert('Role revoked successfully');
      loadPrincipalRoles();  // Reload the list after revocation
    } catch (error) {
      console.error('Error revoking role from principal:', error);
    }
  };

  useEffect(() => {
    fetchPrincipals();
    fetchPrincipalRoles();
  }, [cliPath, host, port, clientId, clientSecret]);

  // After principals are loaded, fetch the roles assigned to them
  useEffect(() => {
    if (principals.length > 0) {
      loadPrincipalRoles();
    }
  }, [principals]);

  return (
    <div>
      <h2>Principal Roles</h2>

      {/* Shared dropdowns for both assigning and revoking roles */}
      <h3>Assign or Revoke Role for a Principal</h3>
      <select
        value={selectedInfo.principal}
        onChange={(e) => setSelectedInfo({ ...selectedInfo, principal: e.target.value })}
      >
        <option value="">Select Principal</option>
        {principals.map((principal) => (
          <option key={principal.name} value={principal.name}>
            {principal.name}
          </option>
        ))}
      </select>

      <select
        value={selectedInfo.principalRole}
        onChange={(e) => setSelectedInfo({ ...selectedInfo, principalRole: e.target.value })}
      >
        <option value="">Select Principal Role</option>
        {roles.map((role) => (
          <option key={role.name} value={role.name}>
            {role.name}
          </option>
        ))}
      </select>

      {/* Buttons for Assigning or Revoking a Role */}
      <button onClick={handleAssignRole}>Assign Role</button>
      <button onClick={handleRevokeRole}>Revoke Role</button>

      {/* Display principals and the roles they are assigned */}
      <h3>Principals and Assigned Roles</h3>
      {principalRoles.length === 0 ? (
        <p>No roles assigned to principals yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Principal</th>
              <th>Assigned Roles</th>
            </tr>
          </thead>
          <tbody>
            {principalRoles.map((pr, index) => (
              <tr key={index}>
                <td>{pr.principal}</td>
                <td>
                  {pr.roles.length > 0 ? pr.roles.map((role) => role.name).join(', ') : 'No roles assigned'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PrincipalRoles;
