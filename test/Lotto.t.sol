// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Lotto.sol";

contract Lotto649Test is Test {
    Lotto649 public lotto;
    address public owner;
    address public player1;
    address public player2;

    function setUp() public {
        owner = address(this); // Test contract acts as the owner
        player1 = address(0x1);
        player2 = address(0x2);
        lotto = new Lotto649();
    }

    function testEnterLotterySuccess() public {
        uint8[6] memory numbers = [5, 12, 23, 34, 45, 46];
        vm.deal(player1, 2 ether); // Provide player1 with 2 ether for transactions
        
        vm.startPrank(player1);
        lotto.purchaseTicket{value: 1 ether}(numbers);
        vm.stopPrank();

        uint256 balance = address(lotto).balance;
        assertEq(balance, 1 ether);

        uint256 winnings = lotto.winnings(player1);
        assertEq(winnings, 0);
        
    }

    function testPurchaseCorrect() public {
        uint8[6] memory numbers = [5, 12, 23, 34, 45, 46];
        vm.deal(player1, 2 ether); // Provide player1 with 2 ether for transactions
        
        vm.startPrank(player1);
        lotto.purchaseTicket{value: 1 ether}(numbers);
        vm.stopPrank();

        Lotto649.Ticket[] memory playerTickets = lotto.getMyTicketsForCurrentWeek();
        for (uint i = 0; i < playerTickets.length; i++) {
            for (uint8 j = 0; j < 6; j++) {
                assertEq(playerTickets[i].numbers[j], numbers[j], "Ticket numbers do not match");
            }
        }              
    }

}
