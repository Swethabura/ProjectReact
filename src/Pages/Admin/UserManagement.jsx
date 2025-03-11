import React from 'react';

const UserManagement = () => {
  return (
    <div>
      <h3>All Users</h3>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Total Posts</th>
            <th>Total Questions</th>
            <th>View Profile</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>JohnDoe</td>
            <td>john@gmail.com</td>
            <td>10</td>
            <td>5</td>
            <td><button>View</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
