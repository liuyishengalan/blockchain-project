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

export function Lotto(): ReactElement {
  const { library, active, account, activate } = useWeb3React();
  const [lottoContractAddr, setLottoContractAddr] = useState<string>('');
  const [signer, setSigner] = React.useState<ethers.Signer>();
  const [lottoContract, setLottoContract] = React.useState<Contract>();
  const [buyTicketMode, setBuyTicketMode] = useState(false);
  const [openBuyTicketModal, setOpenBuyTicketModal] = useState(false);
  const [openAdminLoginModal, setOpenAdminLoginModal] = useState(false);
  const [openCheckResultsModal, setOpenCheckResultsModal] = useState(false);
  const [openHowItWorksModal, setOpenHowItWorksModal] = useState(false);

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

  
  // Dummy winning numbers for display purposes
  const winningNumbers = [2, 14, 26, 27, 33, 49];

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
              <BuyTicket handleClose={handleCloseBuyTicketModal} />
            </div>
          </Modal>
        </Box>
        <Box mt={4}>
          <Typography variant="h6">Winning Numbers:</Typography>
          <Typography variant="subtitle1" gutterBottom>
            Saturday, March 23, 2024
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {winningNumbers.map((number) => (
              <Grid key={number} item>
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