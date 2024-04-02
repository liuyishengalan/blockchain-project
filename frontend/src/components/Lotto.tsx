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

const modalStyle = {
  backgroundColor: 'white',
  padding: '1em',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '80vw',
  maxHeight: '80vh',
  overflow: 'auto',
};
const contractAddress = '0x621eaf3EEf4C0BDa55af6EA783E53e539F0a3901';
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

  // dummy data for the prize pool and time remaining
  const prizePool = "50"; // Replace with actual logic to get prize pool from contract
  const timeRemaining = "7"; // Replace with actual logic to get time remaining

  useEffect((): void => {
    if (!library) return;
    const signer = library.getSigner();
    setSigner(signer);
  }, [library]);

  useEffect((): void => {
    if (!signer) return;
    const lottoContract = new Contract(
      lottoContractAddr,
      LottoArtifact.abi,
      signer
    );
    setLottoContract(lottoContract);
  }, [signer, lottoContractAddr]);

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
  const fetchWinningNumbers = useCallback(async () => {
    if (!lottoContract) return;
  
    try {
      const winningNums = await lottoContract.getWinningNumsForCurrentWeek();
      // Assume winningNums is an array of BigNumber and convert accordingly
      setWinningNumbers(winningNums);
    } catch (error) {
      console.error("Failed to fetch winning numbers:", error);
    }
  }, [lottoContract]); // Depends on lottoContract

  
  useEffect(() => {
    // This function is called automatically when lottoContract is set
    fetchWinningNumbers();
  }, [fetchWinningNumbers]); 
  
// Wrapped in useCallback to ensure it doesn't change unless necessary

  
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
    // Here you would interact with your contract to purchase a ticket
  };

  
  // Dummy winning numbers for display purposes
  // const winningNumbers = [2, 14, 26, 27, 33, 49];

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Lotto 6/49 on the Blockchain!
        </Typography>

        <Box>
          <Button variant="contained" onClick={handleConnectWallet}>
            Connect to Metamask
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
              prizePool={prizePool}
              timeRemaining={timeRemaining}
            />
            </div>
          </Modal>
        </Box>
        <Box mt={4}>
          <Typography variant="h6">Winning Numbers:</Typography>
          <Typography variant="subtitle1" gutterBottom>
            Saturday, March 23, 2024
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
}