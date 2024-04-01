import React from 'react';
import { Button } from '@mui/material';

const HowItWorks = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <div>
      <h2 id="how-it-works-modal-title">How it works</h2>
      <p id="how-it-works-modal-description">
        Here you can check how it works.
      </p>
      <Button onClick={handleClose}>Close</Button>
    </div>
  );
};

export default HowItWorks;