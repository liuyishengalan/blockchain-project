import { Contract, ethers } from 'ethers';
import LottoArtifact from '../artifacts/contracts/Lotto.sol/Lotto649.json';
import { Web3Provider } from '@ethersproject/providers';

export function useLottoContract(lottoContractAddress: string, provider: Web3Provider) {
    let lottoContract: Contract | undefined;

    const initializeContract = () => {
        if (!provider) {
            console.error("Provider is not available");
            return;
        }

        lottoContract = new Contract(lottoContractAddress, LottoArtifact.abi, provider.getSigner());
    };

    // Function to fetch winning numbers
    const fetchWinningNumbers = async (): Promise<number[] | undefined> => {
        if (!lottoContract) {
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
        if (!lottoContract) {
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
        if (!lottoContract) {
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

    const requestBuyTicket = async (ticketNumbers: number[]) => {
        if (!lottoContract) {
            console.error("Lotto contract is not initialized");
            return;
        }
    
        try {
            // Ensure to include the value field to send 1 ETH along with the transaction
            const tx = await lottoContract.purchaseTicket(ticketNumbers, {
                value: ethers.utils.parseEther("0.001"), // Converts 1 ETH to Wei
            });
            console.log("Ticket purchased successfully");
        } catch (error) {
            console.error("Failed to purchase ticket:", error);
        }
    };

    const requestGenerateWinningNumbers = async () => {
        if (!lottoContract) {
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

    const fetchAnnounceWinnersandPrize = async () : Promise<string[] | undefined> => {
        if (!lottoContract) {
            console.error("Lotto contract is not initialized");
            return;
        }
    
        try {
            await lottoContract.announceWinners();
            const tx= await lottoContract.getMywinnerForCurrentWeek();
            console.log("announce winners successfully");
            return tx;
        } catch (error) {
            console.error("Failed to announce winners:", error);
        }
    }
    

    // Initialize contract upon hook call
    initializeContract();

    return {
        fetchWinningNumbers,
        fetchCurrentWeek,
        fetchPrizePool,
        requestBuyTicket,
        requestGenerateWinningNumbers,
        fetchAnnounceWinnersandPrize
    };
}
