import React, {useState} from 'react';

import { Button, Typography, Link, List, ListItem, Box, } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Address } from '@thirdweb-dev/react';
import Paper from '@mui/material/Paper';
// import TicketDropdown from './TicketDropdown';

interface WinnerInfo {
  winner: string; // address in Solidity is analogous to string in TypeScript when dealing with ethers.js
  matchCount: number;
  numbers: number[]; // uint8[6] in Solidity can be represented as number[] in TypeScript for simplicity
}

interface MyTicketInfo {
  numbers: number[];
  prize: number;
}


interface CheckResultProps {
  handleClose: () => void;
  handleWithdraw: () => void;
 
  currentWeek: number;
  recentWinner: WinnerInfo[];
  userRecentTicket: MyTicketInfo[];
  
}

const CheckResults: React.FC<CheckResultProps> = ({
  handleClose,
  handleWithdraw,
  currentWeek,
  recentWinner,
  userRecentTicket,
  
}) => {


  const onWithdraw = () => {
     handleWithdraw();
  };
 
  return (
    <div>
      <Typography variant="h3" id="check-results-modal-title" gutterBottom>
        Check Result
      </Typography>
      
      
    <Box  mt={2} display="flex" flexDirection="row">
      <Box mt={2} marginRight={2}>
        <Typography variant="h5" id="check-results-modal-title" gutterBottom>
        Recent Winners 'Within 3 weeks'
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Winning Address</TableCell>
                <TableCell align="right">Number</TableCell>
                <TableCell align="right">#Match Number</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {recentWinner && recentWinner.length > 0 ? (recentWinner.map((winner, index) => ( 
             <TableRow key={index} >
                  <TableCell component="th" scope="row">
                    {winner.winner}
                  </TableCell>
                  <TableCell align="right">{winner.numbers.join(",")}</TableCell>
                  <TableCell align="right">{((winner.matchCount)%6)}</TableCell>
                </TableRow>
              ))): (
                <TableRow>
                  <TableCell colSpan={3} align="center">No Winners Data Available</TableCell>
                </TableRow>
              )} 
            </TableBody>
          </Table>
         </TableContainer>
      </Box>

      <Box mt ={2}>
        <Typography variant="h5" id="check-results-modal-title" gutterBottom>
        My Ticket
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Number</TableCell>
                <TableCell align="right">Prize</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userRecentTicket && userRecentTicket.length > 0 ? (userRecentTicket.map((ticket, index) => ( 
              <TableRow key={index} >
                    <TableCell component="th" scope="row">
                      {ticket.numbers.join(",")}
                    </TableCell>
                    <TableCell align="right">{ticket.prize}</TableCell> 
                   </TableRow>
                ))): (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No Tickets Data Available</TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
  
    </Box>
     <Box display="flex"  justifyContent="right" width="100%" marginTop={4}>
          <Button variant="contained" onClick={onWithdraw} >  
          {/* onClick={onWithdraw} */}
            Withdraw Current Week Prize
          </Button>
     </Box>
    <Box display="flex" justifyContent="flex-start" width="100%" marginTop={2}>
    <Button onClick={handleClose}>Close</Button>
    </Box>
    

   </div>

  );
};

export default CheckResults;


