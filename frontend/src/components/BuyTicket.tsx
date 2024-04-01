// BuyTicketModalContent.tsx

import React from 'react';
import { Button } from '@mui/material';

const BuyTicket = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <div>
      <h2 id="buy-ticket-modal-title">Buy a Ticket</h2>
      <p id="buy-ticket-modal-description">
        Here you can buy a ticket.
      </p>
      <Button onClick={handleClose}>Close</Button>
    </div>
  );
};

export default BuyTicket;