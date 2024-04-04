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
      <Grid item xs={12}>
        <Typography variant="h4" align="center">
        Admin Page
        </Typography>
      </Grid>
      {/* Left column */}
      <Grid item xs={6}>
        <Box marginLeft={10} marginRight={10} marginTop={5}>

        <Typography variant='overline'> Current Pool Info </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Total Prize Pool: {prizePool} Ethers
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Time Remaining: {timeRemaining} Days
        </Typography>

        </Box>
      </Grid>
      {/* Right column */}
      <Grid item xs={6}>
        <div style={{ display: 'flex' }}>
          {winningNumbers.map((number, index) => (
            <div
              key={index}
              style={{
                width: '50px',
                height: '50px',
                border: '1px solid blue',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '10px'
              }}
            >
              {number}
            </div>
          ))}
        </div>

        <Box display="flex" justifyContent="center" marginTop={5}>
          <Button variant="contained" onClick={handleWinningNumbers}>
          Generate Winning Numbers
          </Button>
        </Box>
        
        <div>
          {winners.length === 0 ? (
            <div>Unfortunately, No winners ☹️</div>
          ) : (
            winners.map((item, index) => (
              <div key={index}>{item}</div>
            ))
          )}
        </div>

        <Box display="flex" justifyContent="center" marginTop={5}>
          <Button variant="contained" onClick={handleShowWinners}>
          Show Winners
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} container justifyContent="flex-end">
        <Button onClick={handleClose}>Close</Button>
      </Grid>
    </Grid>
    
    
  );
};

export default AdminLogin;