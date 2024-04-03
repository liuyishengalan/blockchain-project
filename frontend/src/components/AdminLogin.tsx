import React from 'react';
import { Button,TextField, Box, Typography } from '@mui/material';

interface AdminLoginProps {
  handleClose: () => void;
  handleGenerateRequest: () => void;
  generatedWinningNumbers: number[] ;
  prizePool: string; 
  timeRemaining: number; 
}

// function handleGenerateWinningNumbers(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
//   event.preventDefault();

//   generateWinningNumbers();
// }

// function generateWinningNumbers() {
//   // get the number from the backend

// }


const AdminLogin: React.FC<AdminLoginProps>  = ({ 
  handleClose, 
  handleGenerateRequest,
  generatedWinningNumbers, 
  prizePool, 
  timeRemaining
 }) => {
  // State to store the winning numbers
  const [winningNumbers, setWinningNumbers] = React.useState<number[]>([]);

  // Function to fetch the winning numbers
  const handleWinningNumbers = async () => {
    // Fetch the winning numbers
    handleGenerateRequest();
    const numbers = generatedWinningNumbers;
    if (numbers) setWinningNumbers(numbers);
  };


  return (
    <Box marginLeft={10} marginRight={10} marginTop={5}>
        <Typography variant="h6" id="admin-login-modal-title" align="center">Admin Page</Typography>

        <Typography variant='overline'> Current Pool Info </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Total Prize Pool: {prizePool} Ethers
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Time Remaining: {timeRemaining} Days
        </Typography>

        {/* <table>
          <thead>
            <tr>
              <th>Column 1</th>
              <th>Column 2</th>
              <th>Column 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Row 1, Cell 1</td>
              <td>Row 1, Cell 2</td>
              <td>Row 1, Cell 3</td>
            </tr>
            <tr>
              <td>Row 2, Cell 1</td>
              <td>Row 2, Cell 2</td>
              <td>Row 2, Cell 3</td>
            </tr>
          </tbody>
        </table> */}


        <Box style={{ marginLeft: 500, marginTop:10}}>

        {/* <div style={{ display: 'flex' }}>
          <div style={{ width: '50px', height: '50px', border: '1px solid blue', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px' }}>1</div>
          <div style={{ width: '50px', height: '50px', border: '1px solid blue', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px' }}>2</div>
          <div style={{ width: '50px', height: '50px', border: '1px solid blue', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px' }}>3</div>
          <div style={{ width: '50px', height: '50px', border: '1px solid blue', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px' }}>4</div>
          <div style={{ width: '50px', height: '50px', border: '1px solid blue', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px' }}>5</div>
          <div style={{ width: '50px', height: '50px', border: '1px solid blue', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>6</div>
        </div> */}


        <div style={{ display: 'flex' }}>
          {/* Map over winningNumbers to generate boxes */}
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
              {/* Render the number */}
              {number}
            </div>
          ))}
        </div>


        <Box display="flex" justifyContent="center" marginTop={2}>
          <Button variant="contained" onClick={handleWinningNumbers}>
          Generate Winning Numbers
          </Button>
        </Box>
        

        </Box>
        <Button onClick={handleClose}>Close</Button>
    </Box>
  );
};

export default AdminLogin;