import React, { useEffect } from 'react';
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
  handlePrizeDistribution: () => Promise<PrizeNcounts | undefined>;
}
export interface PrizeNcounts {
  prize: string;
  count: number;
}

const AdminLogin: React.FC<AdminLoginProps>  = ({ 
  handleClose, 
  handleGenerateRequest,
  generatedWinningNumbers, 
  winners,
  prizePool, 
  timeRemaining,
  requestNewLottoRound,
  handlePrizeDistribution,
 }) => {
  // State to store the winning numbers
  const [winningNumbers, setWinningNumbers] = React.useState<number[]>([]);
  const [winnersAdd, setWinnersAdd] = React.useState<string[]>([]);
  const [showWinners, setShowWinners] = React.useState(false);

  const [numberGenerated, setNumberGenerated] = React.useState(false);

  const [prizeNcounts, setPrizeNcounts] = React.useState<PrizeNcounts[]>([]);
  const [showPrizeNcounts, setShowPrizeNcounts] = React.useState(false);
  // const [initResult, setinitResult] = React.useState<string>();


  // Use useEffect to react to changes in generatedWinningNumbers
  useEffect(() => {
    if (generatedWinningNumbers.length > 0) {
      setWinningNumbers(generatedWinningNumbers);
      setNumberGenerated(true);
    }
  }, [generatedWinningNumbers]);

  // Function to fetch the winning numbers
  const handleWinningNumbers = async () => {
    // Trigger the generation of new numbers and the start of a new lotto round
    await handleGenerateRequest();
    // The state update for winningNumbers is now handled by the useEffect hook
  };

  const handleShowWinners = () => {
    const winners = winnersAdd;
    if (winners) {
      setWinnersAdd(winners)
      setShowWinners(true);};
  }

  const distributePrize = async () => {
    const prizeNcount = await handlePrizeDistribution();
    if (prizeNcount) {
      setPrizeNcounts([prizeNcount])
      setShowPrizeNcounts(true);};
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
          Total Prize Pool: 
          {prizePool} Ethers
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Time Remaining: 
          {timeRemaining} Days
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

        <Box display="flex" justifyContent="center" marginTop={5} marginRight={10}>
          <Button variant="contained" onClick={handleWinningNumbers} style={{ width: '300px' }}>
          Generate Winning Numbers & Initialize New Round
          </Button>
        </Box>
        

        <Box display="flex" justifyContent="center" marginTop={5} marginRight={10}>
        <div>
          <Button variant="contained" onClick={handleShowWinners} style={{ width: '300px' }}>
            Show Winners
          </Button>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Winning Addresses</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {numberGenerated ? (
                winners.length === 0 && showWinners ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">Unfortunately, No winners <span role="img" aria-label="sad">☹️</span></TableCell>
                  </TableRow>
                ) : (
                  winners.map((item, index) => ( 
                    <TableRow key={index}>
                      <TableCell component="th" scope="row" key={index}>
                        {item}
                      </TableCell>
                    </TableRow>
                  ))
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" style={{ color: 'red' }} >Winning number is not generatede yet</TableCell>
                </TableRow>
              )}
            </TableBody>
            </Table>
          </TableContainer>
        </div>
        </Box>

        <Box display="flex" justifyContent="center" marginTop={5} marginRight={10}>
          <div>
          <Button variant="contained" onClick={distributePrize} style={{ width: '300px' }}>
          View Prize Distribution
          </Button>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                <TableCell align="center">Winning Prize</TableCell><TableCell align="center">Winning Counts</TableCell> 
                </TableRow>
              </TableHead>
              <TableBody>
              {numberGenerated ? (
                prizeNcounts.length === 0 && showPrizeNcounts ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">Unfortunately, No winners <span role="img" aria-label="sad">☹️</span></TableCell>
                  </TableRow>
                ) : (
                  prizeNcounts.map((item, index) => ( 
                    <TableRow key={index}>
                        <TableCell component="th" scope="row" key={index}>
                        <TableCell align="center">{item.prize}</TableCell>
                        <TableCell align="center">{item.count}</TableCell>
                      </TableCell>
                    </TableRow>
                  ))
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" style={{ color: 'red' }} >Winning number is not generatede yet</TableCell>
                </TableRow>
              )}
            </TableBody>
            </Table>
          </TableContainer>
{/* 

 */}
          {/* <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Winning Prize</TableCell><TableCell align="center">Winning Counts</TableCell> 
                </TableRow>
              </TableHead>
              <TableBody>
              {numberGenerated ? (
                prizeNcounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center"><span role="img" aria-label="sad">☹️</span></TableCell>
                  </TableRow>
                ) : (
                  prizeNcounts.map((item, index) => ( 
                    <TableRow key={index}>
                      <TableCell align="center">{item.prize}</TableCell>
                      <TableCell align="center">{item.count}</TableCell>
                    </TableRow>
                  ))
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" style={{ color: 'red' }} >Winning number is not generatede yet</TableCell>
                </TableRow>
              )}
            </TableBody>
            </Table>
          </TableContainer> */}
          </div>
        </Box>
        

      </Grid>
      
      <Grid item xs={12} container justifyContent="flex-end">
        <Button onClick={handleClose} >Close</Button>
      </Grid>

    </Grid>
  );
};

export default AdminLogin;