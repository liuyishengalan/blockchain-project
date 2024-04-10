import React from 'react';
import { Button, Typography, Link, List, ListItem, Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData_prize(
  Winning_Selection: string,
  Pool: string,
  Prize: string,
) {
  return { Winning_Selection, Pool, Prize };
}

function createData_odd(
  Winning_Selection: string,
  oneIn: string,
  amount: number,
) {
  return { Winning_Selection, oneIn, amount };
}

const rows_prize = [
  createData_prize('6/6', 'Fixed', '100 ether'),
  createData_prize('5/6', '32.15% of the Pools Fund', 'Share of Pool'),
  createData_prize('4/6', '13.5% of the Pools Fund', 'Share of Pool'),
  createData_prize('3/6', '54.35% of the Pools Fund', 'Share of Pool'),
];

const rows_odd = [
  createData_odd('6/6', 'One in', 13983816),
  createData_odd('5/6', 'One in', 55492),
  createData_odd('4/6', 'One in', 1033),
  createData_odd('3/6', 'One in', 56.7),
  createData_odd('2/6', 'One in', 8.3),
  createData_odd('Any Prize', 'One in', 6.6),
];

const HowItWorks = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <div>
      <Typography variant="h3" id="check-results-modal-title" gutterBottom>
        How It Works - Prize & Odds
      </Typography>
      <Box mt={2} display="flex" justifyContent="center">
        <List>
          <ListItem>1. Participants select 6 unique numbers from 1-49 and pay 1 ETH to join the lottery</ListItem>
          <ListItem>2. Wait for the draw</ListItem>
          <ListItem>3. The more numbers of your ticket match the randomly selected draw numbers, the more you win</ListItem>
          <ListItem>4. Win 1000 ETH if you match all 6 numbers!</ListItem>
          <ListItem>
            Read our whitepaper to find out more details 
            <Link href="https://docs.google.com/document/d/1_x84mUSPCAGY3bysVpDen1tvTYlRacN-wJWNU4r9jjE" target="_blank" rel="noopener noreferrer">
              &nbsp;here
            </Link>
          </ListItem>
        </List>
        <Box mt={2}>
          <Typography variant="h5" id="check-results-modal-title" gutterBottom>
            Prize Allocation
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Winning Selection</TableCell>
                  <TableCell align="right">Pool</TableCell>
                  <TableCell align="right">Prize</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows_prize.map((row) => (
                  <TableRow
                    key={row.Winning_Selection}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.Winning_Selection}
                    </TableCell>
                    <TableCell align="right">{row.Pool}</TableCell>
                    <TableCell align="right">{row.Prize}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h5" id="check-results-modal-title" gutterBottom>
            Odds of Winning
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableBody>
                {rows_odd.map((row) => (
                  <TableRow
                    key={row.Winning_Selection}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.Winning_Selection}
                    </TableCell>
                    <TableCell align="right">{row.oneIn}</TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

      </Box>
      <Button onClick={handleClose}>Close</Button>
    </div>
  );
};

export default HowItWorks;