import React from 'react';
import { Button,TextField, Box, Typography, Grid, TableContainer, TableHead,TableRow,TableCell,TableBody,Table  } from '@mui/material';
import Paper from '@mui/material/Paper';

interface AdminLoginProps {
  handleClose: () => void;
  handleGenerateRequest: () => void;
  generatedWinningNumbers: number[] ;
  winners: string[];
  prizePool: string; 
  timeRemaining: number; 
  requestNewLottoRound: () => Promise<boolean | undefined>;
}



const AdminLogin: React.FC<AdminLoginProps>  = ({ 
  handleClose, 
  handleGenerateRequest,
  generatedWinningNumbers, 
  winners,
  prizePool, 
  timeRemaining,
  requestNewLottoRound,
 }) => {
  // State to store the winning numbers
  const [winningNumbers, setWinningNumbers] = React.useState<number[]>([]);
  const [winnersAdd, setWinnersAdd] = React.useState<string[]>([]);
  const [showWinners, setShowWinners] = React.useState(false);
  // const [initResult, setinitResult] = React.useState<string>();


  // Function to fetch the winning numbers
  const handleWinningNumbers = async () => {
    // Fetch the winning numbers
    handleGenerateRequest();
    const numbers = generatedWinningNumbers;
    if (numbers) {
      setWinningNumbers(numbers);
      requestNewLottoRound();
      window.alert('Winning numbers generated successfully and new round initialized!');
    }
  };

  const handleShowWinners = async () => {
    setShowWinners(true);
    const winners = winnersAdd;
    if (winners) setWinnersAdd(winners);
  }

  // const handleNewLottoRound = async () => {
  //   requestNewLottoRound();
  // }

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
          <Button variant="contained" onClick={handleWinningNumbers} style={{ width: '300px' }}>
          Generate Winning Numbers & Initialize New Round
          </Button>
        </Box>
        

        <Box display="flex" justifyContent="center" marginTop={5}>
        <div>
          <Button variant="contained" onClick={handleShowWinners} style={{ width: '300px' }}>
            Show Winners
          </Button>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 200 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Winning Addresses</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {showWinners && winners.length === 0 ?(
                  <TableRow>
                    <TableCell colSpan={3} align="center">Unfortunately, No winners <span role="img" aria-label="sad">☹️</span></TableCell>
                  </TableRow>
                ):
                (winners.map((item, index) => ( 
                <TableRow key={index} >
                  <TableCell component="th" scope="row">
                  <div key={index}>{item}</div>
                  </TableCell>
                </TableRow>
                  )))}
              </TableBody>
            </Table>
          </TableContainer>



{/* 
          {showWinners && (
            <div style={{ marginTop: '10px' }}>
              {winners.length === 0 ? (
                <Typography variant="body1" style={{ color: '#777' }}>
                Unfortunately, No winners <span role="img" aria-label="sad">☹️</span>
                </Typography>
              ) : (
                winners.map((item, index) => (
                  <div key={index}>{item}</div>
                ))
              )}
            </div>
          )} */}
        </div>
        </Box>

      {/* <Box display="flex" justifyContent="center" marginTop={5}>
        <Button variant="contained" onClick={handleNewLottoRound} style={{ width: '300px' }}> Initialize New Lotto Round</Button>
      </Box> */}

      </Grid>
      <Grid item xs={12} container justifyContent="flex-end">
        <Button onClick={handleClose} >Close</Button>

      </Grid>
    </Grid>
    
    
  );
};

export default AdminLogin;