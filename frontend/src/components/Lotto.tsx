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


const contractAddress = '0xc00836153077ed37cCE659098Ed10c8f10b39C9c';
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

  const { fetchWinningNumbers, fetchCurrentWeek, fetchPrizePool, requestBuyTicket } = useLottoContract(contractAddress, library);
  // check how many days are left for the current round to end (winning number released on Wednesday)
  const daysLeft = 3 - new Date().getDay();

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

    getNumbers();
    getWeek();
    getPrizePool();
  }, [library, fetchWinningNumbers, fetchCurrentWeek, fetchPrizePool]);

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
  if (active) {
    return (
      <Container maxWidth="sm" className={shouldAnimate ? 'fade-in' : ''}>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
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
            <Typography variant="h6">Winning Numbers:</Typography>
            <Typography variant="subtitle1" gutterBottom>
              Last Week: Round {latestWinningWeek}
            </Typography>
            <Grid container spacing={2} justifyContent="center">
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
                <CheckResults handleClose={handleCloseCheckResultsModal} />
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
            <Button variant="text" onClick={handleAdminLogin} sx={{ ml: 2 }}>
              Admin Login 
            </Button>
            <Modal
              open={openAdminLoginModal}
              onClose={handleCloseAdminLoginModal}
              aria-labelledby="admin-login-modal-title"
              aria-describedby="admin-login-modal-description"
            >
              <div style={modalStyle as React.CSSProperties}>
                <AdminLogin handleClose={handleCloseAdminLoginModal} />
              </div>
            </Modal>
          </Box>
        </Box>
      </Container>
    );
  } else {
    return (
      <Container maxWidth="sm">
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