// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lotto649 {
    address public owner;
    uint256 public ticketPrice = 1 ether;
    uint256 public jackpot;
    uint256 private seed;

    struct Ticket {
        address entrant;
        uint8[6] numbers;
    }

    Ticket[] public tickets;
    mapping(address => uint256) public winnings;

    event TicketPurchased(address indexed buyer, uint8[6] numbers);
    event WinnersDrawn(uint8[6] winningNumbers);

    constructor() {
        owner = msg.sender;
        seed = (block.timestamp + block.difficulty) % 100;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    function purchaseTicket(uint8[6] calldata numbers) external payable {
        require(msg.value == ticketPrice, "Ticket price is 1 ETH.");
        for (uint8 i = 0; i < 6; i++) {
            require(numbers[i] > 0 && numbers[i] <= 49, "Numbers must be between 1 and 49.");
        }
        tickets.push(Ticket(msg.sender, numbers));
        emit TicketPurchased(msg.sender, numbers);
    }

    function drawWinners() external onlyOwner {
        require(tickets.length > 0, "No tickets purchased.");

        uint8[6] memory winningNumbers = generateWinningNumbers();
        for (uint256 i = 0; i < tickets.length; i++) {
            uint256 matchCount = countMatchingNumbers(tickets[i].numbers, winningNumbers);
            if (matchCount >= 3) {
                // Example prize allocation logic
                uint256 prize = calculatePrize(matchCount);
                winnings[tickets[i].entrant] += prize;
            }
        }
        delete tickets; // Reset tickets for the next round
        emit WinnersDrawn(winningNumbers);
    }

    function generateWinningNumbers() private returns (uint8[6] memory winningNumbers) {
        // Simplified and not secure random generation for demonstration purposes
        for (uint8 i = 0; i < 6; i++) {
            winningNumbers[i] = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, seed, i))) % 49) + 1;
        }
        seed = (block.timestamp + block.difficulty + seed) % 100;
    }

    function countMatchingNumbers(uint8[6] memory ticketNumbers, uint8[6] memory winningNumbers) private pure returns (uint256) {
        uint256 matchCount = 0;
        for (uint256 i = 0; i < 6; i++) {
            for (uint256 j = 0; j < 6; j++) {
                if (ticketNumbers[i] == winningNumbers[j]) {
                    matchCount++;
                    break;
                }
            }
        }
        return matchCount;
    }

    function calculatePrize(uint256 matchCount) private view returns (uint256) {
        // Example calculation based on matching numbers
        if (matchCount == 6) {
            return jackpot;
        } else if (matchCount == 5) {
            return ticketPrice * 10; // Example: 10x the ticket price
        } else if (matchCount == 4) {
            return ticketPrice * 5; // Example: 5x the ticket price
        } else if (matchCount == 3) {
            return ticketPrice * 2; // Example: 2x the ticket price
        }
        return 0;
    }

    function withdrawWinnings() external {
        uint256 amount = winnings[msg.sender];
        require(amount > 0, "No winnings to withdraw.");
        winnings[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}

