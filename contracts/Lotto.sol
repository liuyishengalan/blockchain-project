// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lotto649 {
    address public owner;
    uint256 public ticketPrice = 0.001 ether;
    uint256 public startTimestamp;  // blockchain timestamp
    uint256 public lotteStartTimestamp; // start time of the current ACTIVE lotto
    // NOTE: testing purposes only, change WEEK_DURATION duration for 5 minutes
    // uint256 public constant WEEK_DURATION = 5 minutes;
    uint256 public constant WEEK_DURATION = 1 weeks;
    uint256 private seed;
    uint256 public pot = 0; // Accumulated pot for the current week
    uint256 prize = 0;

    // Prize Distribution Constants
    uint256 constant PERCENTAGE_4 = 5435 ; 
    uint256 constant TOTAL_LEVEL_1_PRIZE = 100 ether; 
    uint256 constant PERCENTAGE_2 = 3215;
    uint256 constant PERCENTAGE_3 = 135;
    uint256 public keeppot = 0;

    struct Ticket {
        uint8[6] numbers;
        address entrant;
    }

    struct WinnerInfo {
        address winner;
        uint256 matchCount;
        uint8[6] numbers;
    }
    
    struct MyTicketInfo {
        uint8[6] numbers;
        uint8 prize;
    }
    
    struct PrizeInfo {
        uint256 prize;
        uint256 count;
    }

    mapping(uint256 => uint256[]) public lottoPoolByWeek;
    mapping(uint256 => Ticket[]) public ticketsByWeek;
    mapping(address => uint256) public winnings;
    mapping(uint256 => WinnerInfo[]) public winnersByWeek;
    mapping(uint256 => uint8[6]) private winningNumbers;
    mapping(address => mapping(uint256 => MyTicketInfo[])) public myTicket;
    mapping(address => mapping(uint256 => MyTicketInfo[])) public myTicketAfter;
    mapping(uint256 => bool) public annouce;
    //mapping(address => MyTicketInfo[]) public myTicket1;

    event TicketPurchased(address indexed buyer, uint256 week, uint8[6] numbers);
    event WinnersAnnounced(uint256 week, uint8[6] winningNumbers, uint256[4] prizeAmounts);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier timeForNewPool() {

        // NOTE: testing purposes only, change WEEK_DURATION duration for 5 minutes
        require(block.timestamp >= lotteStartTimestamp + WEEK_DURATION, "Current Lotto is ACTIVE. Cannot perform this action before the current Lotto ends");
        _;
    }

    modifier winningNumAnnounced() {
        require(winningNumbers[getCurrentWeek()][0] != 0, "Winning numbers not announced yet");
        _;
    }

    constructor() {
        owner = msg.sender;
        startTimestamp = block.timestamp;
        lotteStartTimestamp = block.timestamp;
        seed = (block.timestamp + block.prevrandao) % 100;
    }

    function initializeNewLotto() external onlyOwner timeForNewPool {
        lotteStartTimestamp = block.timestamp;
        seed = (block.timestamp + block.prevrandao) % 100;
        lottoPoolByWeek[getCurrentWeek()].push(lotteStartTimestamp); // Record the start time of the new pool for each of the Lotto
    }

    function purchaseTicket(uint8[6] calldata numbers) external payable{
        require(msg.value == ticketPrice, "Ticket price is 1 ETH");
        require(block.timestamp >= lotteStartTimestamp && block.timestamp < lotteStartTimestamp + WEEK_DURATION, "Purchases are not within the allowed week");
        
        for (uint8 i = 0; i < 6; i++) {
            require(numbers[i] > 0 && numbers[i] <= 49, "Numbers must be between 1 and 49");
            for (uint8 j = i + 1; j < 6; j++) {
                require(numbers[i] != numbers[j], "Numbers must be unique");
            }
        }
        uint256 currentWeek = getCurrentWeek();
        ticketsByWeek[currentWeek].push(Ticket(numbers, msg.sender));
        myTicket[msg.sender][currentWeek].push(MyTicketInfo(numbers,uint8(0)));
        pot += msg.value;
        annouce[currentWeek] = false;
        emit TicketPurchased(msg.sender, currentWeek, numbers);
    }


    function announceWinners() public onlyOwner winningNumAnnounced  {//returns (uint256[] memory, uint256[] memory) {
        uint256 currentWeek = getCurrentWeek();
        require(ticketsByWeek[currentWeek].length > 0, "No tickets purchased");
        require(annouce[currentWeek] == false, "Already annouce");

        // uint8[6] memory winningNums = sortTicketNumber(winningNumbers[getCurrentWeek()]);
        
        uint256 potForDistribution = (pot + keeppot)/2;

        uint256[4] memory winningPrizes = [uint256(0), uint256(0), uint256(0), uint256(0)];
        uint256[4] memory winnerCounts; // Automatically initialized to [0, 0, 0, 0]
        // uint256 count = 0;

        for (uint i = 0; i < ticketsByWeek[currentWeek].length; i++) {
            uint256 matchCount = 0;
            for (uint j = 0; j < 6; j++) {
                for (uint k = 0; k < 6; k++) {
                    if (ticketsByWeek[currentWeek][i].numbers[j] == winningNumbers[getCurrentWeek()][k]) {
                        matchCount++;
                        break;
                    }
                }
            }

            // uint8[6] memory ticketNums = sortTicketNumber(ticketsByWeek[currentWeek][i].numbers);

            // for (uint k = 0; k < 6; k++) {
            //     if (ticketNums[k] == winningNums[k]) {
            //         matchCount++;
            //         break;
            //     }
            // }
           
            if (matchCount == 6){
                prize = 1;
            } else if (matchCount == 5){
                prize = 2;
            } else if (matchCount == 4){
                prize = 3;
            } else if (matchCount == 3){
                prize = 4;
            } else {prize = 5;}
            myTicketAfter[ticketsByWeek[currentWeek][i].entrant][currentWeek].push(MyTicketInfo(ticketsByWeek[currentWeek][i].numbers,uint8(prize)));
            
            if (matchCount >= 3) {
                uint256 prizeIndex = matchCount - 3; // Indexing into the winningPrizes and winnerCounts arrays
                winnerCounts[prizeIndex]++;
                
                winnersByWeek[currentWeek].push(WinnerInfo(ticketsByWeek[currentWeek][i].entrant, matchCount,ticketsByWeek[currentWeek][i].numbers));
            }
        }
        keeppot = potForDistribution;
        pot = 0; // Reset pot for the next round
        annouce[currentWeek] = true;
        // Calculate prize amounts based on winner counts
        if (winnerCounts[3] > 0){ winningPrizes[3] = TOTAL_LEVEL_1_PRIZE / winnerCounts[3];}
        if (winnerCounts[2] > 0){ winningPrizes[2] = (potForDistribution * PERCENTAGE_2 / 10000) / winnerCounts[2];}
        if (winnerCounts[1] > 0){ winningPrizes[1] = (potForDistribution * PERCENTAGE_3 / 1000) / winnerCounts[1];}
        if (winnerCounts[0] > 0){ winningPrizes[0] = (potForDistribution * PERCENTAGE_4 / 10000) / winnerCounts[0];}

        if(winnerCounts[0] == 0){
            keeppot += (potForDistribution * PERCENTAGE_4 / 10000);
        }
        if (winnerCounts[1] == 0){
            keeppot += (potForDistribution * PERCENTAGE_3 / 1000);
        } 
        if (winnerCounts[2] == 0){
            keeppot += (potForDistribution * PERCENTAGE_2 / 10000);
        }

        // Update winnings mapping for each winner
        for (uint256 i = 0; i < winnersByWeek[currentWeek].length; i++) {
            WinnerInfo memory winnerInfo = winnersByWeek[currentWeek][i];
            uint256 prizeIndex = winnerInfo.matchCount - 3;
            winnings[winnerInfo.winner] += winningPrizes[prizeIndex];
        }

        emit WinnersAnnounced(currentWeek, winningNumbers[getCurrentWeek()], winningPrizes);

        uint256[] memory prizes = new uint256[](4);
        uint256[] memory counts = new uint256[](4);

        for (uint i = 0; i < 4; i++) {
            prizes[i] = winningPrizes[i];
            counts[i] = winnerCounts[i];
        }

        //return (prizes, counts);
        
    }
    

    function generateWinningNumbers() public onlyOwner timeForNewPool {
    // Assuming we want to generate 6 unique random numbers
    for (uint8 i = 0; i < 6; i++) {
        // Simplified random number generation logic
        uint8 randNumber = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, i))) % 49) + 1;
        
        // Check for uniqueness; this is a naive approach and might need optimization
        bool isUnique = true;
        for (uint8 j = 0; j < i; j++) {
            if (winningNumbers[getCurrentWeek()][j] == randNumber) {
                isUnique = false;
                break;
            }
        }
        if (isUnique) {
            winningNumbers[getCurrentWeek()][i] = randNumber;
        } else {
            i--; // Retry this iteration with a new random number
        }
    }
    // Additional logic to handle the case after successfully setting the numbers...
}


    function getCurrentWeek() public view returns (uint256) {
        return (block.timestamp - startTimestamp) / WEEK_DURATION + 1; 
    }

    function withdrawWinnings() external payable {
        uint256 amount = winnings[msg.sender];
        //uint256 amount = 0.001 ether;
        require(amount > 0, "No winnings to withdraw");
        winnings[msg.sender] = 0;
        //address addr = 0x2329F6Ce16D3edE9de51E507f7D401fFA79dC985;
        payable(msg.sender).transfer(amount);
    }

    function getPotSize() public view returns (uint256) {
        return (keeppot + pot);
    }
    
    // Function to fetch all tickets bought by a specific address in the current week
    function getMyTicketsForCurrentWeek() external view returns (Ticket[] memory) {
        uint256 currentWeek = getCurrentWeek();
        uint256 ticketCount = 0;
        
        // First, count the tickets to initialize the array with proper size
        for (uint256 i = 0; i < ticketsByWeek[currentWeek].length; i++) {
            if (ticketsByWeek[currentWeek][i].entrant == msg.sender) {
                ticketCount++;
            }
        }
        
        // Initialize the array of tickets with the correct size
        Ticket[] memory myTickets = new Ticket[](ticketCount);
        
        // Second, populate the array
        if (ticketCount > 0) {
            uint256 index = 0;
            for (uint256 i = 0; i < ticketsByWeek[currentWeek].length; i++) {
                if (ticketsByWeek[currentWeek][i].entrant == msg.sender) {
                    myTickets[index] = ticketsByWeek[currentWeek][i];
                    index++;
                }
            }
        }
        
        return myTickets;
    }

    function getTicketArrayLen() external view returns (uint256 lencount) {
        uint256 currentWeek = getCurrentWeek();
        uint256 ticketCount = 0;
        
        // First, count the tickets to initialize the array with proper size
        for (uint256 i = 0; i < ticketsByWeek[currentWeek].length; i++) {
            if (ticketsByWeek[currentWeek][i].entrant == msg.sender) {
                ticketCount++;
            }
        }
        return ticketCount;
    }

    function generateWinningNumbersTest() public onlyOwner {
        uint256 currentWeek = getCurrentWeek();
        uint8[6] memory winningNums = [1, 2, 3, 4, 5, 6];

        winningNumbers[currentWeek] = winningNums;
    }

    function getMywinnerForCurrentWeek() external view returns (WinnerInfo[] memory) {
        uint256 currentWeek = getCurrentWeek();
        // uint256 wCount = 0;
        WinnerInfo[] memory mywinner = new WinnerInfo[](winnersByWeek[currentWeek].length);

        for (uint256 i = 0; i < winnersByWeek[currentWeek].length; i++) {
            mywinner[i] = (winnersByWeek[currentWeek][i]);
        }

        return mywinner;
    }
    
    function getMywinnerForCertainWeek() external view returns (WinnerInfo[] memory) {
        // address addr1 = msg.sender;
        // uint8[6] memory numbers = [1, 2, 3, 4, 5, 6];
        // uint256 numWinners = 5; // Adjust this as needed

        // WinnerInfo[] memory mywinner = new WinnerInfo[](numWinners);
        // for (uint256 i = 0; i < numWinners; i++) {
        //     mywinner[i] = WinnerInfo({
        //         winner: addr1,
        //         matchCount: i,
        //         numbers: numbers
        //     });
        // }
        //return mywinner;

        uint256 currentWeek = getCurrentWeek();
        uint256 wCount = 0;
        uint256 lengthT = 0;
        
        if (currentWeek < 3){
            lengthT = currentWeek;
        } else {
            lengthT = 3;
        }

        for (uint256 i = 0; i < lengthT; i++){
                for (uint256 j = 0; j < winnersByWeek[i+1].length; j++){
                    wCount++;
            }
        }

        WinnerInfo[] memory mywinner = new WinnerInfo[](wCount);
        wCount = 0;
        
        for (uint256 i = 0; i < lengthT; i++){
                for (uint256 j = 0; j < winnersByWeek[i+1].length; j++){
                  mywinner[wCount] = (winnersByWeek[i+1][j]);
                  wCount++;
            }
        }

        return mywinner;
        
    }

    function getMyTicketsForCertainWeek() external view returns (MyTicketInfo[] memory) {
        uint256 currentWeek = getCurrentWeek();
        uint256 ticketCount = 0;
        // uint256 numb = 0;
        uint256 lengthT;
        
        // uint8[6] memory numbers = [2,3,4,5,6,7];
        // uint8 prizee = 5;
        // for (uint256 i = 0; i < numb; i++) {
        //      mytickett[i] = MyTicketInfo({
        //         numbers: numbers,
        //         prize: prizee
        //     });
        // }

        if (currentWeek < 3){
            lengthT = currentWeek;
        } else {
            lengthT = 3;
        }

        for (uint256 i = 0; i < lengthT; i++){
            for (uint256 j = 0; j < myTicket[msg.sender][i+1].length; j++){
                    ticketCount++;
            }
        }

        MyTicketInfo[] memory mytickett = new MyTicketInfo[](ticketCount);
        ticketCount = 0;
        for (uint256 i = 0; i < lengthT; i++){
            if (annouce[i+1]){
                for (uint256 j = 0; j < myTicketAfter[msg.sender][i+1].length; j++){
                    mytickett[ticketCount] = myTicketAfter[msg.sender][i+1][j];
                    ticketCount++;
                }
            } else {
                for (uint256 j = 0; j < myTicket[msg.sender][i+1].length; j++){
                    mytickett[ticketCount] = myTicket[msg.sender][i+1][j];
                    ticketCount++;
                }
            }
            
        }

        return mytickett;
        
    }

    function getWinningNumsForCurrentWeek() external view returns (uint8[6] memory) {
        uint256 currentWeek = getCurrentWeek();
        uint8[6] memory nums;
        for (uint i = 0; i < 6; i++) {
            nums[i] = winningNumbers[currentWeek][i];
        }
        return nums;
    }

    // ** helper functions **
    // TODO: sort the ticket numbers for quicker comparison
    function sortTicketNumber(uint8[6] memory ticket) public pure  returns (uint8[6] memory){
        if (ticket.length > 0)
            quickSort(ticket, 0, ticket.length - 1);

        return ticket;
    }

    function quickSort(uint8[6] memory ticket, uint left, uint right) public pure {
        if (left >= right)
            return;
        uint p = ticket[(left + right) / 2];   // p = the pivot element
        uint i = left;
        uint j = right;
        while (i < j) {
            while (ticket[i] < p) ++i;
            while (ticket[j] > p) --j;         // ticket[j] > p means p still to the left, so j > 0
            if (ticket[i] > ticket[j])
                (ticket[i], ticket[j]) = (ticket[j], ticket[i]);
            else
                ++i;
        }

        // Note --j was only done when a[j] > p.  So we know: a[j] == p, a[<j] <= p, a[>j] > p
        if (j > left)
            quickSort(ticket, left, j - 1);    // j > left, so j > 0
        quickSort(ticket, j + 1, right);
    }
}