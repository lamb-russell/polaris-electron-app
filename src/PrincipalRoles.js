// PrincipalRoles.js
import React, { useState, useEffect } from 'react';

const PrincipalRoles = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ name: '' });
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [selectedPrincipal, setSelectedPrincipal] = useState(null);

  const fetchRoles = async () => {
    try {
      const output = await window.api.runCommand('polaris', ['principal-roles', 'list']);
      const roleData = output.split('\n').map(JSON.parse);
      setRoles(roleData);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleCreateRole = async () => {
    const { name } = newRole;
    if (!name) {
      alert('Role name is required');
      return;
    }

    try {
      await window.api.runCommand('polaris', ['principal-roles', 'create', name]);
      alert('Role created successfully');
      fetchRoles(); // Refresh the list
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  const handleAssignRole = async (roleName) => {
    if (!selectedPrincipal) {
      alert('Please select a principal to assign the role.');
      return;
    }

    try {
      await window.api.runCommand('polaris', ['principal-roles', 'grant', roleName, '--principal', selectedPrincipal]);
      alert('Role assigned successfully');
      fetchAssignedRoles(selectedPrincipal); // Refresh the assigned roles
    } catch (error) {
      console.error('Error assigning role:', error);
    }
  };

  const fetchAssignedRoles = async (principalName) => {
    try {
      const output = await window.api.runCommand('polaris', ['principal-roles', 'list', '--principal', principalName]);
      const assignedRoleData = output.split('\n').map(JSON.parse);
      setAssignedRoles(assignedRoleData);
    } catch (error) {
      console.error('Error fetching assigned roles:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div>
      <h2>Principal Roles</h2>
      <table>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={index}>
              <td>{role.name}</td>
              <td>
                <button onClick={() => handleAssignRole(role.name)}>Assign to Selected Principal</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Create New Role</h3>
      <input
        type="text"
        placeholder="Role Name"
        value={newRole.name}
        onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
      />
      <button onClick={handleCreateRole}>Create Role</button>

      <h3>Assigned Roles for Principal</h3>
      {selectedPrincipal ? (
        <table>
          <thead>
            <tr>
              <th>Role Name</th>
            </tr>
          </thead>
          <tbody>
            {assignedRoles.map((role, index) => (
              <tr key={index}>
                <td>{role.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Select a principal to see their assigned roles.</p>
      )}
    </div>
  );
};

export default PrincipalRoles;
