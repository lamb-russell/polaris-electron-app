import React, { useState, useEffect } from 'react';

const PrincipalRoles = ({ cliPath, host, port, clientId, clientSecret }) => {
  const [roles, setRoles] = useState([]);
  const [principals, setPrincipals] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState({});
  const [selectedInfo, setSelectedInfo] = useState({
    principal: '',
    role: ''
  });

  const [newRole, setNewRole] = useState('');  // For creating a new principal role
  const [roleToDelete, setRoleToDelete] = useState('');  // For deleting a principal role

  // Function to fetch principals and their assigned roles
  const fetchPrincipalsWithRoles = async () => {
    const principalArgs = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'principals', 'list'
    ];

    try {
      const principalOutput = await window.api.runCommand(cliPath, principalArgs);
      const principalData = principalOutput.split('\n').filter(line => line).map(line => JSON.parse(line));
      setPrincipals(principalData);

      const newAssignedRoles = {};
      for (const principal of principalData) {
        const roleArgs = [
          '--host', host,
          '--port', port,
          '--client-id', clientId,
          '--client-secret', clientSecret,
          'principal-roles', 'list',
          '--principal', principal.name
        ];
        const roleOutput = await window.api.runCommand(cliPath, roleArgs);
        const roleData = roleOutput.split('\n').filter(line => line).map(line => JSON.parse(line).name);
        newAssignedRoles[principal.name] = roleData;
      }
      setAssignedRoles(newAssignedRoles);
    } catch (error) {
      console.error('Error fetching principals and roles:', error);
    }
  };

  // Function to fetch available roles
  const fetchRoles = async () => {
    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'principal-roles', 'list'
    ];

    try {
      const output = await window.api.runCommand(cliPath, args);
      const roleData = output.split('\n').filter(line => line).map(line => JSON.parse(line));
      setRoles(roleData);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Function to assign a role to a principal
  const handleAssignRole = async () => {
    const { principal, role } = selectedInfo;
    if (!principal || !role) {
      alert('Please select both a principal and a role.');
      return;
    }

    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'principal-roles', 'grant',
      '--principal', principal,
      role
    ];

    try {
      await window.api.runCommand(cliPath, args);
      alert('Role assigned successfully');
      fetchPrincipalsWithRoles(); // Refresh roles
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  };

  // Function to remove a role from a principal
  const handleDeleteRole = async () => {
    const { principal, role } = selectedInfo;
    if (!principal || !role) {
      alert('Please select both a principal and a role to remove.');
      return;
    }

    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'principal-roles', 'revoke',
      '--principal', principal,
      role
    ];

    try {
      await window.api.runCommand(cliPath, args);
      alert('Role removed successfully');
      fetchPrincipalsWithRoles(); // Refresh roles
    } catch (error) {
      console.error('Error removing role:', error);
    }
  };

  // Function to create a new principal role
  const handleCreateRole = async () => {
    if (!newRole) {
      alert('Please enter a role name.');
      return;
    }

    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'principal-roles', 'create',
      newRole  // Role is a positional argument
    ];

    try {
      await window.api.runCommand(cliPath, args);
      alert(`Role "${newRole}" created successfully`);
      setNewRole(''); // Clear input
      fetchRoles(); // Refresh the roles list
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  // Function to delete a principal role
  const handleDeletePrincipalRole = async () => {
    if (!roleToDelete) {
      alert('Please select a role to delete.');
      return;
    }

    const args = [
      '--host', host,
      '--port', port,
      '--client-id', clientId,
      '--client-secret', clientSecret,
      'principal-roles', 'delete',
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
    await fetchPrincipalsWithRoles();
    await fetchRoles();
  };
  
  useEffect(() => {
    fetchRoles();
    fetchPrincipalsWithRoles();
  }, [cliPath, host, port, clientId, clientSecret]);

  return (
    <div>
      <h2>Principal Roles Management</h2>
      <button onClick={handleRefresh}>Refresh Principals and Roles</button> {/* Refresh button */}
  
      <h3>Assign or Remove Role</h3>
      <div>
        <select
          value={selectedInfo.principal}
          onChange={(e) => setSelectedInfo({ ...selectedInfo, principal: e.target.value })}
        >
          <option value="">Select Principal</option>
          {principals.map((principal, index) => (
            <option key={index} value={principal.name}>
              {principal.name}
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

      <h3>Create New Principal Role</h3>
      <div>
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Enter new role name"
        />
        <button onClick={handleCreateRole}>Create Role</button>
      </div>

      <h3>Delete Principal Role</h3>
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
        <button onClick={handleDeletePrincipalRole}>Delete Role</button>
      </div>

      <h3>Principals and Their Assigned Roles</h3>
      <table>
        <thead>
          <tr>
            <th>Principal</th>
            <th>Assigned Roles</th>
          </tr>
        </thead>
        <tbody>
          {principals.length === 0 ? (
            <tr>
              <td colSpan="2">No principals available.</td>
            </tr>
          ) : (
            principals.map((principal, index) => (
              <tr key={index}>
                <td>{principal.name}</td>
                <td>
                  {assignedRoles[principal.name]?.length
                    ? assignedRoles[principal.name].join(', ')
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

export default PrincipalRoles;
