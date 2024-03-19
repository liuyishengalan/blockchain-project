// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lotto649 {
    struct Ticket {
        uint[6] numbers;
        address owner;
    }

    struct WinnerInfo {
        address winner;
        uint256 matchCount;
        //uint256 prizeAmount;
    }

    //mapping(uint256 => mapping(uint256 => address[])) public ticketsByWeekAndNumber;
    mapping(uint256 => Ticket[]) public ticketsByWeek;
    mapping(address => uint256) public userAttempts;
    mapping(uint256 => WinnerInfo[]) public winnersByWeek;

    uint256 public startTimestamp;
    uint256 public constant WEEK_DURATION = 1 weeks;
    address public owner;
    uint256 public pot = 0;
    uint public ticketPrice = 1 ether;

    constructor() {
        // owner = msg.sender;
        startTimestamp = block.timestamp; 
    }
    

    event TicketPurchased(address indexed buyer, uint256 week, uint[6] numbers);
    event WinnersAnnounced(uint256 week, uint256[6] winningNumbers, uint[4] winnerPrize);
    //event WinnersAnnounced(uint256 week, uint256 pot, string message);

   
    function buyTicket(uint[6] memory numbers) public payable {
        require(block.timestamp >= startTimestamp && block.timestamp < startTimestamp + WEEK_DURATION, "Purchases are not within the allowed week");
        require(msg.value == ticketPrice, "1 ether is required to enter");
        require(areNumbersValid(numbers), "Numbers must be unique and between 1 and 49");
        uint256 currentWeek = (block.timestamp - startTimestamp) / WEEK_DURATION;
        
       
        ticketsByWeek[currentWeek].push(Ticket(numbers, msg.sender));
        userAttempts[msg.sender]++;
        pot += ticketPrice;

        emit TicketPurchased(msg.sender, currentWeek, numbers);
    }

    
    function areNumbersValid(uint[6] memory numbers) private pure returns (bool) {
        for(uint i = 0; i < numbers.length; i++) {
            if(numbers[i] < 1 || numbers[i] > 49) {
                return false;
            }
            
            for(uint j = i + 1; j < numbers.length; j++) {
                if(numbers[i] == numbers[j]) {
                    return false;
                }
            }
        }
        return true;
    }

    function generateWinningNumbers() private view returns (uint[6] memory) {
        uint[6] memory winningNumbers;
        for (uint i = 0; i < 6; ) {
            uint randNumber = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, i))) % 49 + 1;
            bool numberExists = false;
            for (uint j = 0; j < i; j++) {
                if (winningNumbers[j] == randNumber) {
                    numberExists = true;
                    break;
                }
            }
            if (!numberExists) {
                winningNumbers[i] = randNumber;
                i++;
            }
        }
        return winningNumbers;
    }

    function announceWinners() public {
        uint256 currentWeek = (block.timestamp - startTimestamp) / WEEK_DURATION;
        require(ticketsByWeek[currentWeek].length > 0, "No tickets purchased.");
        uint[6] memory winningNumbers = generateWinningNumbers();
        uint256[4] memory winningPrice;
        uint256 potForDistribution = pot;
        pot = 0;
        Ticket[] memory weekTickets = ticketsByWeek[currentWeek];

        // Prize Distribution
        uint256 totallevel4Prize = 54.35 ether; 
        uint256 totallevel1Prize = 1000 ether; 
        uint256 percentage2 = 3225;
        uint256 percentage3 = 135;

        uint256 totallevel2Prize = potForDistribution * percentage2 / 10000;
        uint256 totallevel3Prize = potForDistribution * percentage3 / 1000;
 
        // address[] memory winners1 = new address[](weekTickets.length);
        // address[] memory winners2 = new address[](weekTickets.length);
        // address[] memory winners3 = new address[](weekTickets.length);
        // address[] memory winners4 = new address[](weekTickets.length); 
        
        uint256 winnerCount1 = 0;
        uint256 winnerCount2 = 0;
        uint256 winnerCount3 = 0;
        uint256 winnerCount4 = 0;

        for (uint i = 0; i < weekTickets.length; i++) {
            uint matchCount = 0;
            for (uint j = 0; j < 6; j++) {
                for (uint k = 0; k < 6; k++) {
                    if (weekTickets[i].numbers[j] == winningNumbers[k]) {
                        matchCount++;
                        break;
                    }
                }
            }
            
            if (matchCount > 3){
                winnersByWeek[currentWeek].push(WinnerInfo({
                        winner: weekTickets[i].owner,
                        matchCount: matchCount
                }));
            }

            if (matchCount == 3) {winnerCount4++;}//winners4[winnerCount4] = weekTickets[i].owner; winnerCount4++;}
            else if (matchCount == 4) {winnerCount3++;}//winners3[winnerCount3] = weekTickets[i].owner; winnerCount3++; }
            else if (matchCount == 5) {winnerCount2++;}//winners2[winnerCount2] = weekTickets[i].owner; winnerCount2++; }
            else if (matchCount == 6) {winnerCount1++;}//winners1[winnerCount1] = weekTickets[i].owner; winnerCount1++; }
        }
     
        if (winnerCount4 > 0) {
            winningPrice[3] = totallevel4Prize / winnerCount4;
        }

        if (winnerCount3 > 0) {
             winningPrice[2] = totallevel3Prize / winnerCount3;
        }

        if (winnerCount2 > 0) {
             winningPrice[1] = totallevel2Prize / winnerCount2;
           
        }

        if (winnerCount1 > 0) {
             winningPrice[0] = totallevel1Prize / winnerCount1;
        }

        emit WinnersAnnounced(currentWeek, winningNumbers, winningPrice);
    }
    
    function getCurrentWeek() public view returns (uint256) {
        return (block.timestamp - startTimestamp) / 1 weeks + 1; 
    }

    function viewTicketsForNumberAndWeek(uint256 week, uint[6] memory number) public view returns (address[] memory) {
        //
    }

}



