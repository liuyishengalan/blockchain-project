import React from 'react';
import { Button } from '@mui/material';

const AdminLogin = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <div>
      <h2 id="admin-login-modal-title">Admin Login</h2>
      <p id="admin-login-modal-description">
        Here you can admin login.
      </p>
      <Button onClick={handleClose}>Close</Button>
    </div>
  );
};

export default AdminLogin;