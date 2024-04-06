import { useState, useEffect } from 'react';
import { Contract, ethers } from 'ethers';
import LottoArtifact from '../artifacts/contracts/Lotto.sol/Lotto649.json';
import { Web3Provider } from '@ethersproject/providers';

interface WinnerInfo {
    winner: string; // address in Solidity is analogous to string in TypeScript when dealing with ethers.js
    matchCount: number;
    numbers: number[]; // uint8[6] in Solidity can be represented as number[] in TypeScript for simplicity
}

interface MyTicketInfo {
    numbers: number[];
    prize: number;
}

// Assuming lottoContractAddress and provider are passed correctly from the parent component
export const useLottoContract = (lottoContractAddress: string, provider: Web3Provider) => {
    const [lottoContract, setLottoContract] = useState<Contract>();
    const [owner, setOwner] = useState('');
    const [user, setUser] = useState('');
    const [isContractReady, setIsContractReady] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        setIsOwner(owner.toLowerCase() === user.toLowerCase());
    }, [owner, user]);
    
  // Asynchronously initialize the contract and fetch owner and user addresses
    useEffect(() => {


    const initializeContract = async () => {
        if (!provider) {
        console.error("Web3 provider is not available.");
        return;
        }
        const signer = provider.getSigner();
        const contract = new Contract(lottoContractAddress, LottoArtifact.abi, signer);
        
        try {
        await contract.deployed(); // Ensures contract is deployed and accessible
        setLottoContract(contract);
        setIsContractReady(true); // Set to true only after successful initialization
        
        const contractOwner = await contract.owner();
        setOwner(contractOwner);
        const currentUserAddress = await signer.getAddress();
        setUser(currentUserAddress);
        } catch (error) {
        console.error("Failed to initialize the contract or fetch addresses: ", error);
        setIsContractReady(false);
        }
    };

    initializeContract();
    }, [provider, lottoContractAddress]);

    useEffect(() => {
        setIsOwner(owner.toLowerCase() === user.toLowerCase());
    }, [owner, user]);
    

    // Function to fetch winning numbers
    const fetchWinningNumbers = async (): Promise<number[] | undefined> => {
        if (!isContractReady || !lottoContract) {
            console.error("Lotto contract is not initialized");
            return;
        }

        try {
            const winningNums = await lottoContract.getWinningNumsForCurrentWeek();
            return winningNums
        } catch (error) {
            console.error("Failed to fetch winning numbers:", error);
            return;
        }
    };

    // Function to fetch the current week

    const fetchCurrentWeek = async (): Promise<number | undefined> => {
        if (!isContractReady || !lottoContract) {
            console.error("Lotto contract is not initialized");
            return;
        }

        try {
            const currentWeek = await lottoContract.getCurrentWeek();
            return currentWeek.toNumber();
        } catch (error) {
            console.error("Failed to fetch current week:", error);
            return;
        }
    };

    const fetchPrizePool = async (): Promise<string | undefined> => {
        if (!isContractReady || !lottoContract) {
            console.error("Lotto contract is not initialized");
            return;
        }

        try {
            const prizePool = await lottoContract.getPotSize();
            const prizePool_ether = ethers.utils.formatEther(prizePool).toString();
            return prizePool_ether;
        } catch (error) {
            console.error("Failed to fetch prize pool:", error);
            return;
        }
    }

    const fetchTicket = async (): Promise<MyTicketInfo[] | undefined> => {
        if (!isContractReady || !lottoContract) {
            console.error("Lotto contract is not initialized");
            return;
        }

        try {
            const testnum = await lottoContract.getMyTicketsForCertainWeek();
            //console.log(testnum);
            //const testnu = [1,2,3];
            return testnum;
        } catch (error) {
            console.error("Failed to fetch user ticket:", error);
            return;
        }
    }


    const fetchWinners = async (): Promise<WinnerInfo[] | undefined>=> {
        if (!isContractReady || !lottoContract) {
            console.error("Lotto contract is not initialized");
            return;
        }
        
        try {
            const winners = await lottoContract.getMywinnerForCertainWeek();
            // if (!winners || winners.length === 0) {
            //     console.log("No winners found for the current week");
            //     return [];
            // }
            return winners;
        } catch (error) {
            console.error("Failed to fetch recent winners:", error);
            return;
        }
    }

    const requestBuyTicket = async (ticketNumbers: number[]) => {
        if (!isContractReady || !lottoContract) {
            throw new Error("Lotto contract is not initialized");
        }
    
        try {
            const transactionResponse = await lottoContract.purchaseTicket(ticketNumbers, {
                value: ethers.utils.parseEther("0.001"),
            });
            const receipt = await transactionResponse.wait();
    
            if (receipt.status === 1) {
                console.log("Ticket purchased successfully");
                return { success: true, receipt: receipt };
            } else {
                return { success: false, error: "Transaction failed without a success receipt." };
            }
        } catch (error) {
            console.error("Failed to purchase ticket:", error);
            throw error; // Re-throwing the error to be caught by the caller
        }
    };
    

    const requestGenerateWinningNumbers = async () => {
        if (!isContractReady || !lottoContract) {
            console.error("Lotto contract is not initialized");
            return;
        }
    
        try {
            await lottoContract.generateWinningNumbers();
            console.log("Winning numbers generated successfully");
        } catch (error) {
            console.error("Failed to generate winning numbers:", error);
        }
    }

    // const fetchAnnounceWinnersandPrize = async () : Promise<string[] | undefined> => {
    //     if (!lottoContract) {
    //         console.error("Lotto contract is not initialized");
    //         return;
    //     }
    
    //     try {
    //         await lottoContract.announceWinners();
    //         const tx= await lottoContract.getMywinnerForCurrentWeek();
    //         console.log("announce winners successfully");
    //         return tx;
    //     } catch (error) {
    //         console.error("Failed to announce winners:", error);
    //     }
    // }

    const requestNewLottoRound = async (): Promise<boolean|undefined> => {
        if (!isContractReady || !lottoContract) {
            console.error("Lotto contract is not initialized");
            return; 
        }
    
        try {
            const result = await lottoContract.initializeNewLotto();
            console.log("New round started successfully");
            return  !!result;
        } catch (error) {
            console.error("Failed to start new round:", error);
            return;
        }
    }
    

    return {
        fetchWinningNumbers,
        fetchCurrentWeek,
        fetchPrizePool,
        requestBuyTicket,
        requestGenerateWinningNumbers,
        // fetchAnnounceWinnersandPrize,
        requestNewLottoRound,
        fetchWinners,
        fetchTicket,
        user,
        owner,
        isContractReady,
        isOwner,
    };
}
