import React, {
  ReactElement,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useWeb3React } from '@web3-react/core';
import { Button, Typography, Box, Container, Paper, Grid, Modal, CircularProgress, duration } from '@mui/material';
import { injected } from '../utils/connectors';
import BuyTicket from './BuyTicket';
import AdminLogin from './AdminLogin';
import {PrizeNcounts} from './AdminLogin';
import HowItWorks from './HowItWorks';
import CheckResults from './CheckResults';
import { useLottoContract } from '../api/useContract'; // Adjust the import path as needed
import eth_logo from '../assets/eth.gif';
import load_gif from '../assets/load.gif'
import { modalStyle } from '../styles/styles';
import { use } from 'chai';

// import CountdownTimer from './CountdownTimer';
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


const contractAddress = '0xe2EC9E3ee184C63a8Fd8cB92F7C8487C46b8a20C' //chris 
// const contractAddress = '0x7E256C17D890AC32262CB655E6dd2204ae847d34' // yisheng

export function Lotto(): ReactElement {
  const { library, active, activate } = useWeb3React();
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
  const [checkwithdraw, setWin] = useState<boolean>();


  // waiting loading pop up
  const [isTransactionProcessing, setIsTransactionProcessing] = useState(false);
  const [isGeneratingNumbers, setIsGeneratingNumbers] = useState(false);

  const {
    fetchWinningNumbers, 
    fetchCurrentWeek, 
    fetchPrizePool, 
    requestBuyTicket, 
    requestGenerateWinningNumbers,
    requestNewLottoRound, 
    fetchWinners,
    fetchTicket,
    isContractReady,
    isOwner,
    fetchInitTimestep,
    requestPrizeDistribution,
    fetchwithdrawdata,
    
  } = useLottoContract(contractAddress, library);

  // check how many days are left for the current round to end (winning number released on Wednesday)//fetchTicket

 // TODO : Implement the logic to calculate the days left for the current round to end
  const daysLeft = 1;
 
  // const daysLeft = async () => {
  //   const initTime = await fetchInitTimestep();
  //   const initDate = new Date((initTime ?? 0) * 1000);
  //   const currentDay = new Date();
  //   const diff = currentDay.getTime() - initDate.getTime();
  //   const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  //   return diffDays<=7? 7 - (diffDays % 7): 0;
  // }

    

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
  if (isContractReady) {
    getNumbers();
    getWeek();
    getPrizePool();
    getfetchTicket();
    getfetchWinner();
  }
  }, [library, 
    fetchWinningNumbers, 
    fetchCurrentWeek, 
    fetchPrizePool,
    requestNewLottoRound,
    fetchWinners,
    fetchTicket,
    fetchwithdrawdata,
    
  ]); 

  useEffect(() => {
    if (active) {
      setShouldAnimate(true);
      // Optionally, remove the animation class after the animation ends to avoid re-animating on re-renders
      const timer = setTimeout(() => setShouldAnimate(false), 1000); // Match the animation duration
      return () => clearTimeout(timer);

    }
  }, [active]);

  const handlePrizeDistribution = async () => {
    let isError_distributePrize = false;
    setIsTransactionProcessing(true);
    if(true){  //placeholder for the condition to check if the winning numbers have been generated
      try {
        const result = await requestPrizeDistribution();
        console.log("requestion for prize distribution sent backed:", result.success);
        setIsTransactionProcessing(false);
        return result.receipt;        
      } catch (error) {
        console.error("Failed to generate numbers", error);
        isError_distributePrize = true; 
      } finally {
        if (isError_distributePrize === false) {
          alert("Successfully distrubted prize!");
        } else {
          alert("Operation Cancelled!");
        }
      }
    } else {
      alert("Please wait for winning number generation before distribute prize!");
    }
  }

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
    setWinnerrs([]); 
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

  const handlePurchase = async (ticketNumbers: number[]) => {
    console.log('Purchasing ticket with numbers: ', ticketNumbers);
    setIsTransactionProcessing(true); // Start showing the loading modal
    let isError = false;
    try {
      const result = await requestBuyTicket(ticketNumbers);
      console.log("Ticket purchased successfully", result);
      // Handle success (e.g., show a success message)
    } catch (error) {
      console.error("Failed to purchase ticket:", error);
      // alert("Failed to purchase ticket: " + error);
      isError = true;
    } finally {
      setIsTransactionProcessing(false); // Stop showing the loading modal
      if (isError === false) {
        alert("Successfully purchased!");
      } else {
        alert("Transaction cancelled! \nYou cancelled it or you need to check your wallet balance");
      }
    }
  };
  
  
  const handlewithdraw = async () => {
    const check = await fetchwithdrawdata();
    if(check) {setWin(check)};
    // if (!checkwithdraw || checkwithdraw.length == 0){
    //   alert("You have noting to withdraw with!");
    // } else {
    //   let check = 0;
    //   let checktrue = false;
    //   for (let i = 0; i < checkwithdraw.length;i++){
    //     for (let j = 0; j < 6;j++){
    //       for (let k = 0; k < 6;k++){
    //       if (checkwithdraw[i].numbers[j] == winningNumbers[k]){
    //           check++;
    //         }
    //     }
    //   }
    //   if (check > 3){
    //     checktrue = true;
    //   }
    //   check = 0;
    // }

    // if(checktrue){
    //   handlewithdrawaction();
    //   alert("Successfullt Withdraw! Check your account.");
    // }else {
    //   alert("You have noting to withdraw with!");
    // }
    if(checkwithdraw){
      alert("Successfullt Withdraw! Check your account.");
    }else{
      alert("You have noting to withdraw with!");
    }
  }


  const handleGenerateWinningNumbers = async () => {
    console.log('request for generating winning numbers sent!');
    setIsGeneratingNumbers(true)
    let isError_generateNumber = false;
    try {
      const result = await requestGenerateWinningNumbers();
      console.log("Generate numbers successfully", result);
    } catch (error) {
      console.error("Failed to generate numbers", error);
      isError_generateNumber = true;
    } finally {
      // setIsGeneratingNumbers(false); // Stop showing the loading modal
      if (isError_generateNumber === false) {
        alert("Successfully Generated and now starting new round!");
        handleNewLottoRound();
      } else {
        setIsGeneratingNumbers(false);
        alert("Cancelled! \nYou cancelled it or you need to check your wallet balance");
      }
    }
  }
  
  const handleNewLottoRound = async () => {
    console.log('request for starting new lotto round sent!');
    setIsGeneratingNumbers(true)
    let isError_newRound = false;
    try {
      const result = await  requestNewLottoRound();
      console.log("Start new round successfully", result);
    } catch (error) {
      console.error("Failed to start new round", error);
      isError_newRound = true;
    } finally {
      setIsGeneratingNumbers(false); // Stop showing the loading modal
      if (isError_newRound === false) {
        alert("Successfully started!");
      } else {
        alert("Cancelled! \nYou cancelled it or you need to check your wallet balance");
      }
    }
  }



  if (active) {
    if (!isContractReady) {
      return (
        <Container maxWidth="md" sx={{ 
          height: '100vh', // Sets the height of the Container to full viewport height
          display: 'flex', // Enables flexbox layout
          flexDirection: 'column', // Stacks children vertically
          justifyContent: 'center', // Centers content vertically in the container
          alignItems: 'center' // Centers content horizontally in the container
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <img src={load_gif} alt="Loading..." style={{ width: '120px', height: '120px'}}/>
            <Typography variant="h4" component="h1" gutterBottom>
              Wait a second...
            </Typography>
          </Box>
        </Container>
      )
    }

    return (
      <Container maxWidth="md" className={shouldAnimate ? 'fade-in' : ''}>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom marginTop = {10} marginBottom = {10}>
            Lotto 6/49 on Blockchain
          </Typography>
  
          <Box>
            <Button variant="contained" onClick={handleConnectWallet}>
              {active ? 'Connected' : 'Connect to Metamask'}
            </Button>
            {!isOwner && (
              <Button variant="outlined" onClick={handleBuyTicket} sx={{ ml: 2 }}>
                Buy a Ticket
              </Button>)}
            {isOwner && (
              <Button variant="contained" onClick={handleAdminLogin} sx={{ 
                ml: 2, 
                backgroundColor: 'red', 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'darkred',
                }
                }}>
                Admin
              </Button>
            )}
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
            <Modal
              open={isTransactionProcessing}
              aria-labelledby="loading-modal-title"
              aria-describedby="loading-modal-description"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
              >
                <CircularProgress />
              </Box>
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
            {!isOwner && (
              <Button variant="text" onClick={handleCheckResults}>
                Check Results
              </Button>)
            }
            <Modal
              open={openCheckResultsModal}
              onClose={handleCloseCheckResultsModal}
              aria-labelledby="check-results-modal-title"
              aria-describedby="check-results-modal-description"
            >
              <div style={modalStyle as React.CSSProperties}>
            
            <CheckResults
              handleClose={handleCloseCheckResultsModal} 
              handleWithdraw = {handlewithdraw}
              currentWeek={currentWeek || 0}
              recentWinner={recentWinner}
              userRecentTicket = {userRecentTicket}
              />
              
              </div>
            </Modal>
            {!isOwner && (
              <Button variant="text" onClick={handleHowItWorks} sx={{ ml: 2 }}>
                How It works
              </Button>)
            }
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
                  winners = {recentWinner}
                  prizePool={prizePool || ''}
                  timeRemaining={daysLeft}
                  requestNewLottoRound={requestNewLottoRound}
                  handlePrizeDistribution={handlePrizeDistribution}
                />
              </div>
            </Modal>
            
            <Modal
              open={isGeneratingNumbers}
              aria-labelledby="loading-modal-title"
              aria-describedby="loading-modal-description"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100%"
              >
                <CircularProgress />
              </Box>
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