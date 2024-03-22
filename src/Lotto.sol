// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lotto649 {
    address public owner;
    uint256 public ticketPrice = 1 ether;
    uint256 public jackpot = 1000 ether; // Assuming a fixed jackpot for simplicity
    uint256 public startTimestamp;
    uint256 public constant WEEK_DURATION = 1 weeks;
    uint256 private seed;
    uint256 public pot = 0; // Accumulated pot for the current week

    // Prize Distribution Constants
    uint256 constant TOTAL_LEVEL_4_PRIZE = 54.35 ether; 
    uint256 constant TOTAL_LEVEL_1_PRIZE = 1000 ether; 
    uint256 constant PERCENTAGE_2 = 3225;
    uint256 constant PERCENTAGE_3 = 135;

    struct Ticket {
        uint8[6] numbers;
        address entrant;
    }

    mapping(uint256 => Ticket[]) public ticketsByWeek;
    mapping(address => uint256) public winnings;

    event TicketPurchased(address indexed buyer, uint256 week, uint8[6] numbers);
    event WinnersAnnounced(uint256 week, uint8[6] winningNumbers, uint256[4] prizeAmounts);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    constructor() {
        owner = msg.sender;
        startTimestamp = block.timestamp;
        seed = (block.timestamp + block.prevrandao) % 100;
    }

    function purchaseTicket(uint8[6] calldata numbers) external payable {
        require(msg.value == ticketPrice, "Ticket price is 1 ETH.");
        require(block.timestamp >= startTimestamp && block.timestamp < startTimestamp + WEEK_DURATION, "Purchases are not within the allowed week");
        for (uint8 i = 0; i < 6; i++) {
            require(numbers[i] > 0 && numbers[i] <= 49, "Numbers must be between 1 and 49.");
            for (uint8 j = i + 1; j < 6; j++) {
                require(numbers[i] != numbers[j], "Numbers must be unique.");
            }
        }
        uint256 currentWeek = getCurrentWeek();
        ticketsByWeek[currentWeek].push(Ticket(numbers, msg.sender));
        pot += msg.value;
        emit TicketPurchased(msg.sender, currentWeek, numbers);
    }

    function drawWinners() external onlyOwner {
        uint256 currentWeek = getCurrentWeek();
        require(ticketsByWeek[currentWeek].length > 0, "No tickets purchased.");
        uint8[6] memory winningNumbers = generateWinningNumbers();
        // Reset pot and allocate prizes
        uint256 potForDistribution = pot;
        pot = 0;

        // Prize distribution logic here based on the match counts

        emit WinnersAnnounced(currentWeek, winningNumbers, [uint256(0), uint256(0), uint256(0), uint256(0)]);
    }

    function generateWinningNumbers() private returns (uint8[6] memory winningNumbers) {
        for (uint8 i = 0; i < 6; i++) {
            winningNumbers[i] = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, seed, i))) % 49) + 1;
            // Ensure unique winning numbers (simplified for demonstration)
        }
        seed = (block.timestamp + block.prevrandao + seed) % 100;
        return winningNumbers;
    }

    function getCurrentWeek() public view returns (uint256) {
        return (block.timestamp - startTimestamp) / WEEK_DURATION + 1; 
    }

    function withdrawWinnings() external {
        uint256 amount = winnings[msg.sender];
        require(amount > 0, "No winnings to withdraw.");
        winnings[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    // Additional helper functions for counting matches and calculating prizes as needed
}
