import React from 'react';
import { Button,TextField, Box, Typography, Grid } from '@mui/material';

interface AdminLoginProps {
  handleClose: () => void;
  handleGenerateRequest: () => void;
  generatedWinningNumbers: number[] ;
  winners: string[];
  prizePool: string; 
  timeRemaining: number; 
}



const AdminLogin: React.FC<AdminLoginProps>  = ({ 
  handleClose, 
  handleGenerateRequest,
  generatedWinningNumbers, 
  winners,
  prizePool, 
  timeRemaining
 }) => {
  // State to store the winning numbers
  const [winningNumbers, setWinningNumbers] = React.useState<number[]>([]);
  const [winnersAdd, setWinnersAdd] = React.useState<string[]>([]);

  // Function to fetch the winning numbers
  const handleWinningNumbers = async () => {
    // Fetch the winning numbers
    handleGenerateRequest();
    const numbers = generatedWinningNumbers;
    if (numbers) setWinningNumbers(numbers);
  };

  const handleShowWinners = async () => {
    const winners = winnersAdd;
    if (winners) setWinnersAdd(winners);
  }


  return (
    <Grid container spacing={2}>
      {/* Left column */}
      <Grid item xs={6}>
        {/* Content for the left column */}
        Left Column
      </Grid>
      {/* Right column */}
      <Grid item xs={6}>
        {/* Content for the right column */}
        Right Column
      </Grid>
    </Grid>
    
    
  );
};

export default AdminLogin;