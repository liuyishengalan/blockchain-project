import React from 'react';
import { Button } from '@mui/material';

const CheckResults = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <div>
      <h2 id="check-results-modal-title">Check Results</h2>
      <p id="check-results-modal-description">
        Here you can check results.
      </p>
      <Button onClick={handleClose}>Close</Button>
    </div>
  );
};

export default CheckResults;