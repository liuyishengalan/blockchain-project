import { Contract } from 'ethers';
import LottoArtifact from '../artifacts/contracts/Lotto.sol/Lotto649.json';
import { Web3Provider } from '@ethersproject/providers';

// Define a hook to encapsulate contract logic
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
    

    // Initialize contract upon hook call
    initializeContract();

    return {
        fetchWinningNumbers,
        fetchCurrentWeek,
    };
}
