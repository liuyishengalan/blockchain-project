import { Contract, ethers } from 'ethers';
import LottoArtifact from '../artifacts/contracts/Lotto.sol/Lotto649.json';
import { Web3Provider } from '@ethersproject/providers';
import { textChangeRangeIsUnchanged } from 'typescript';
import { useState } from 'react';

interface WinnerInfo {
    winner: string; // address in Solidity is analogous to string in TypeScript when dealing with ethers.js
    matchCount: number;
    numbers: number[]; // uint8[6] in Solidity can be represented as number[] in TypeScript for simplicity
  }

interface MyTicketInfo {
    numbers: number[];
    prize: number;
}
export function useLottoContract(lottoContractAddress: string, provider: Web3Provider) {
    let lottoContract: Contract | undefined;
    let contractInitialized = false;
    
    
    const FetchOwner = async () => {
        try {
            await initializeContract(); // Wait for initialization to complete
    
            if (!lottoContract) {
                console.error("Lotto contract is not initialized");
                return false;
            }
    
            const owner = await lottoContract.owner();
            console.log(owner);
            const user = await provider.getSigner().getAddress();
            console.log(user);
            
            if(owner === user){
                return true;
            }
        } catch (error) {
            console.error("Failed to fetch owner:", error);
            return false;
        }
    }


    const initializeContract = async() => {
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

    const fetchTicket = async (): Promise<MyTicketInfo[] | undefined> => {
        if (!lottoContract) {
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
        if (!lottoContract) {
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
        if (!lottoContract) {
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
    

    // // Initialize contract upon hook call
    initializeContract();

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
        FetchOwner,
        contractInitialized
    };
}
