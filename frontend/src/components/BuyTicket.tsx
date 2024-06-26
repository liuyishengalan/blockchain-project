import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Modal, CircularProgress } from '@mui/material';

interface BuyTicketProps {
  handleClose: () => void;
  handlePurchase: (numbers: number[]) => void; // Add this to handle the purchase
  currentWeek: number; // Add this to show the current week
  prizePool: string; // Add this to show the prize pool
  timeRemaining: number; // Add this to show time remaining
}


const BuyTicket: React.FC<BuyTicketProps> = ({
  handleClose,
  handlePurchase,
  currentWeek,
  prizePool,
  timeRemaining,
}) => {
  const [numbers, setNumbers] = useState(Array(6).fill(''));

  const handleNumberChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newNumbers = [...numbers];
    newNumbers[index] = event.target.value;
    setNumbers(newNumbers);
  };

  const onPurchase = () => {
    const numericNumbers = numbers.map(Number).filter(number => !isNaN(number) && number >= 1 && number <= 49); // Convert to numbers and filter out invalid entries
  
    // Check for the correct amount of numbers
    if (numericNumbers.length !== 6) {
      window.alert("Please select exactly 6 numbers.");
      return; // Stop the function if the condition is not met
    }
  
    // Check for uniqueness
    const uniqueNumbers = new Set(numericNumbers); // Correctly create a Set from the numericNumbers
    if (uniqueNumbers.size !== numericNumbers.length) { 
      window.alert("All numbers must be unique.");
      return;
    }
  
    // If all validations pass, proceed with the purchase
    handlePurchase(numericNumbers);
  };
  

  return (
    <Box marginLeft={10} marginRight={10} marginTop={5}>
      <Typography variant="h3" component="h1" marginBottom={10}>
        Buy Lottery Ticket
      </Typography>
      <Box display="flex" justifyContent="center">
        <Box>
          <Typography variant="h5" component="h1" gutterBottom >
            Current Lottery Round #{currentWeek}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Total Prize Pool: {prizePool} Ethers
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Time Remaining: {timeRemaining} Days
          </Typography>
        </Box>

        <Box marginLeft={20}>
          <Typography variant="h5" component="h1" gutterBottom >
            Enter 6 unique numbers from 1-49 to join the lottery!
          </Typography>
          <Box display="flex" justifyContent="center">
          {numbers.map((number, index) => (
            <TextField
              key={index}
              value={number}
              onChange={handleNumberChange(index)}
              type="number"
              inputProps={{ min: 1, max: 49 }}
              margin="normal"
            />
          ))}
          </Box>
          <Box display="flex" justifyContent="center">
          <Button variant="contained" onClick={onPurchase}>
            Purchase Ticket (0.001 ETH)
          </Button>
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" marginTop={10}>
        <Button onClick={handleClose}>Close</Button>
      </Box>
    </Box>
  );
};

export default BuyTicket;
