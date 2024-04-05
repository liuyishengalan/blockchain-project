import React, {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import LottoArtifact from '../artifacts/contracts/Lotto.sol/Lotto649.json';
import { Button, Typography, Box, Container, Paper, Grid, Modal } from '@mui/material';
import { injected } from '../utils/connectors';
import BuyTicket from './BuyTicket';
import AdminLogin from './AdminLogin';
import HowItWorks from './HowItWorks';
import CheckResults from './CheckResults';
import { useLottoContract } from '../api/useContract'; // Adjust the import path as needed
import eth_logo from '../assets/eth.gif';
import { modalStyle } from '../styles/styles';
import { get } from 'http';
import { CONTRACT_ADDRESSES } from '@thirdweb-dev/react';
//import io from 'socket.io-client';
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

// const contractAddress = '0xDa54AC55D9EB40952CC4418AE184561b8A7FC58E';
const contractAddress = '0x83cc3b797C05535c60DadDDe849bf1580E20ca66';
export function Lotto(): ReactElement {
  const { library, active, account, activate } = useWeb3React();
  const [lottoContractAddr, setLottoContractAddr] = useState<string>(contractAddress);
  const [signer, setSigner] = React.useState<ethers.Signer>();
  const [lottoContract, setLottoContract] = React.useState<Contract>();
  const [openBuyTicketModal, setOpenBuyTicketModal] = useState(false);
  const [openAdminLoginModal, setOpenAdminLoginModal] = useState(false);
  const [openCheckResultsModal, setOpenCheckResultsModal] = useState(false);
  const [openHowItWorksModal, setOpenHowItWorksModal] = useState(false);
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [latestWinningWeek, setLatestWinningWeek] = useState<number>();
  const [currentWeek, setCurrentWeek] = useState<number>();
  const [prizePool, setPrizePool] = useState<string>();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [userRecentTicket, setUserTicket] = useState<MyTicketInfo[]>([]);
  const [recentWinner, setWinnerrs] = useState<WinnerInfo[]>([]);
  const [winners, setWinners] = useState<string[]>([]);
  const [isOwner, setIsOwner] = React.useState<boolean>(false);
  

  const { 
    fetchWinningNumbers, 
    fetchCurrentWeek, 
    fetchPrizePool, 
    requestBuyTicket, 
    requestGenerateWinningNumbers,
    // fetchAnnounceWinnersandPrize,
    requestNewLottoRound, 
    fetchWinners,
    fetchTicket,
    FetchOwner
  } = useLottoContract(contractAddress, library);
  // check how many days are left for the current round to end (winning number released on Wednesday)//fetchTicket
  const daysLeft = 3 - new Date().getDay() + 7;
  

  useEffect(() => {
    if (!library) {
      console.log('Web3React library not initialized');
      return;
    }
    const getNumbers = async () => {
      const numbers = await fetchWinningNumbers();
      if (numbers) setWinningNumbers(numbers);
    };

    const getWeek = async () => {
      const week = await fetchCurrentWeek();
      // convert the big number to a number
      if (week) {
        setLatestWinningWeek(week - 1);
        setCurrentWeek(week);
      }
    }

    const getPrizePool = async () => {
      const prizePool = await fetchPrizePool();
      if (prizePool) setPrizePool(prizePool);
    }

    const getfetchTicket = async () => {
      const  tickectt = await fetchTicket();
      if (tickectt) setUserTicket(tickectt);
    }

    const getfetchWinner = async () => {
      const winner = await fetchWinners();
      if (winner) {
        setWinnerrs(winner);
        //console.log(winner);
    }
  }
   
    getNumbers();
    getWeek();
    getPrizePool();
    getfetchTicket();
    getfetchWinner();

  }, [library, fetchWinningNumbers, fetchCurrentWeek, fetchPrizePool,requestNewLottoRound,fetchWinners,fetchTicket]); //fetchWinners

  useEffect(() => {
    if (active) {
      setShouldAnimate(true);
      // Optionally, remove the animation class after the animation ends to avoid re-animating on re-renders
      const timer = setTimeout(() => setShouldAnimate(false), 1000); // Match the animation duration
      return () => clearTimeout(timer);
    }
  }, [active]);



  const handleConnectWallet = useCallback(async () => {
    // Since we're inside a callback, we don't use the hook here, 
    // just the activate function passed from useWeb3React
    try {
      await activate(injected);
      console.log('Successfully connected to MetaMask!');
      const isOwnerAddr = await FetchOwner();
      if (isOwnerAddr) {
        setIsOwner(true);
      }
    } catch (error) {
      console.error('Error on connecting to MetaMask:', error);
    }
  }, [activate]); // Depend on the activate function
  
  const handleBuyTicket = () => {
    setOpenBuyTicketModal(true);
  };

  const handleCloseBuyTicketModal = () => {
    setOpenBuyTicketModal(false);
  };  

  const handleCheckResults = () => {
    setOpenCheckResultsModal(true);
  };

  const handleCloseCheckResultsModal = () => {
    setOpenCheckResultsModal(false);
  };

  const handleHowItWorks = () => {
    setOpenHowItWorksModal(true);
  };

  const handleCloseHowItWorksModal = () => {
    setOpenHowItWorksModal(false);
  };

  const handleAdminLogin = () => {
    setOpenAdminLoginModal(true);
  }

  const handleCloseAdminLoginModal = () => {
    setOpenAdminLoginModal(false);
  }

  const handlePurchase = (ticketNumbers: number[]) => {
    console.log('Purchasing ticket with numbers: ', ticketNumbers);
    requestBuyTicket(ticketNumbers);
  };

  const handleGenerateWinningNumbers = () => {
    console.log('request for generating winning numbers sent!');
    requestGenerateWinningNumbers();
    fetchWinningNumbers();
  }



  if (active) {
    return (
      <Container maxWidth="md" className={shouldAnimate ? 'fade-in' : ''}>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom marginTop = {20} marginBottom = {15}>
            Lotto 6/49 on Blockchain
          </Typography>
  
          <Box>
            <Button variant="contained" onClick={handleConnectWallet}>
              {active ? 'Connected' : 'Connect to Metamask'}
            </Button>
            <Button variant="outlined" onClick={handleBuyTicket} sx={{ ml: 2 }}>
              Buy a Ticket
            </Button>
            <Modal
              open={openBuyTicketModal}
              onClose={handleCloseBuyTicketModal}
              aria-labelledby="buy-ticket-modal-title"
              aria-describedby="buy-ticket-modal-description"
            >
              <div style={modalStyle as React.CSSProperties}>
              <BuyTicket
                handleClose={handleCloseBuyTicketModal}
                handlePurchase={handlePurchase}
                currentWeek={currentWeek || 0} // Provide a default value for currentWeek
                prizePool={prizePool || ''}
                timeRemaining={daysLeft}
              />
              </div>
            </Modal>
          </Box>
          <Box mt={4}>
            <Typography variant="h5" gutterBottom marginTop = {2}>
              Last Week: Round {latestWinningWeek}
            </Typography>
            <Typography variant="h4" marginTop = {2}>Winning Numbers:</Typography>
            <Grid container spacing={2} justifyContent="center" marginTop = {2}>
            {winningNumbers.map((number, index) => (
              <Grid key={index} item>
                <Paper elevation={4} sx={{ p: 1, width: '2rem', textAlign: 'center' }}>
                  {number}
                </Paper>
              </Grid>
            ))}
            </Grid>
  
          </Box>
          <Box mt={4}>
            <Button variant="text" onClick={handleCheckResults}>
              Check Results
            </Button>
            <Modal
              open={openCheckResultsModal}
              onClose={handleCloseCheckResultsModal}
              aria-labelledby="check-results-modal-title"
              aria-describedby="check-results-modal-description"
            >
              <div style={modalStyle as React.CSSProperties}>
             
              <CheckResults
               handleClose={handleCloseCheckResultsModal} 
               currentWeek={currentWeek || 0}
               recentWinner={recentWinner}
               userRecentTicket = {userRecentTicket}
               />
              
              </div>
            </Modal>
            <Button variant="text" onClick={handleHowItWorks} sx={{ ml: 2 }}>
              How It works
            </Button>
            <Modal
              open={openHowItWorksModal}
              onClose={handleCloseHowItWorksModal}
              aria-labelledby="how-it-works-modal-title"
              aria-describedby="how-it-works-modal-description"
            >
              <div style={modalStyle as React.CSSProperties}>
                <HowItWorks handleClose={handleCloseHowItWorksModal} />
              </div>
            </Modal>
          </Box>
          {/* The Admin Login button can be an IconButton or a simple Button as per your design */}
          <Box mt={2} display="flex" justifyContent="flex-end">
            {isOwner && (
              <Button variant="text" onClick={handleAdminLogin} sx={{ ml: 2 }}>
                Admin
              </Button>
            )}
            <Modal
              open={openAdminLoginModal}
              onClose={handleCloseAdminLoginModal}
              aria-labelledby="admin-login-modal-title"
              aria-describedby="admin-login-modal-description"
            >
              <div style={modalStyle as React.CSSProperties}>
                <AdminLogin 
                  handleClose={handleCloseAdminLoginModal}
                  handleGenerateRequest={handleGenerateWinningNumbers}
                  generatedWinningNumbers={winningNumbers}
                  winners = {winners}
                  prizePool={prizePool || ''}
                  timeRemaining={daysLeft}
                  requestNewLottoRound={requestNewLottoRound}
                />
              </div>
            </Modal>
          </Box>
        </Box>
      </Container>
    );
  } else {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Lotto 6/49 on Blockchain
          </Typography>
          <img src={eth_logo} alt="Ethereum Logo" style={{ width: '300px', height: '300px', marginBottom: '20px'}}/>
          <Box>
            <Button variant="contained" onClick={handleConnectWallet}>
              Connect to Metamask
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }
}