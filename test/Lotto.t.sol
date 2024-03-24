// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Lotto.sol";

contract Lotto649Test is Test {
    Lotto649 public lotto;
    address public owner;
    address public player1;
    address public player2;
    uint256 private startAt;

    function setUp() public {
        owner = address(this); // Test contract acts as the owner
        player1 = address(0x1);
        player2 = address(0x2);
        lotto = new Lotto649();
        startAt = block.timestamp;
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

    function testBuyTicketWithInsufficientFunds() public {
        uint8[6] memory numbers = [5, 12, 23, 34, 45, 46];
        vm.deal(player2, 2 ether);
        vm.startPrank(player2);
        vm.expectRevert("Ticket price is 1 ETH");
        lotto.purchaseTicket{value: 0.5 ether}(numbers);
        vm.stopPrank();
    }

    function testBuyTicketWithNouniqueNums() public {
        vm.deal(player2, 2 ether);
        vm.startPrank(player2);
        vm.expectRevert("Numbers must be unique");
        lotto.purchaseTicket{value: 1 ether}([7, 8, 45, 45, 11, 12]);
        vm.stopPrank();
    }

    function testBuyTicketWithOutBoundNums() public {
        vm.deal(player2, 2 ether);
        vm.startPrank(player2);
        vm.expectRevert("Numbers must be between 1 and 49");
        lotto.purchaseTicket{value: 1 ether}([7, 8, 56, 45, 11, 12]);
        vm.stopPrank();
    }

    // // below has the function not depend on the start time defined in test
    // function testBuyTicketWithWrongTime() public {
    //     vm.deal(player2, 2 ether);
    //     vm.warp(startAt + 2 weeks);
    //     vm.startPrank(player2);
    //     vm.expectRevert("Purchases are not within the allowed week");
    //     lotto.purchaseTicket{value: 1 ether}([7, 8, 5, 45, 11, 12]);
    //     vm.stopPrank();
    // }

    function testBadPurchaseTime() public {
        uint8[6] memory numbers = [5, 12, 23, 34, 45, 46];
        vm.deal(player1, 2 ether); // Provide player1 with 2 ether for transactions
        vm.startPrank(player1);
        vm.warp(lotto.lotteStartTimestamp() + 2 weeks);
        vm.expectRevert("Purchases are not within the allowed week");
        lotto.purchaseTicket{value: 1 ether}(numbers);
        vm.stopPrank();
    }

    function testPotAmountAfterPurchases() public {
        uint256 initialPot = lotto.getPotSize();
        assertEq(initialPot, 0, "Initial pot size should be 0");
        vm.deal(player1, 3 ether);
        
        for (uint256 i = 0; i < 3; i++) {
            vm.startPrank(player1);
            lotto.purchaseTicket{value: 1 ether}([1, 2, 3, 4, 5, 6]);
        }

        uint256 expectedPot = 3 ether;
        uint256 actualPot = lotto.getPotSize();
        assertEq(actualPot, expectedPot, "Pot size after purchases does not match expected value");
        vm.stopPrank();
    }


    function testPurchaseCorrect() public {
        uint8[6] memory numbers = [5, 12, 23, 34, 45, 46];
        vm.deal(player1, 2 ether); // Provide player1 with 2 ether for transactions
        vm.startPrank(player1);
        lotto.purchaseTicket{value: 1 ether}(numbers);

        Lotto649.Ticket[] memory playerTickets = lotto.getMyTicketsForCurrentWeek();
        assertEq(playerTickets.length, 1);
        assertEq(playerTickets[0].entrant, player1);
        for(uint i = 0; i < 6; i++) {
            assertEq(playerTickets[0].numbers[i], numbers[i]);
        }
        vm.stopPrank();  
    }
    
    function testPurchaseWithDuplicateNum() public {
        uint8[6] memory numbers = [5, 5, 23, 34, 45, 46];
        vm.deal(player1, 2 ether); // Provide player1 with 2 ether for transactions
        vm.startPrank(player1);
        vm.expectRevert("Numbers must be unique");
        lotto.purchaseTicket{value: 1 ether}(numbers);
        vm.stopPrank();
    }

    function testAnnounceWinnerAccess() public {
        vm.startPrank(owner);
        lotto.generateWinningNumbers();
        vm.stopPrank();
        uint8[6] memory nums = lotto.getWinningNumsForCurrentWeek();
        vm.deal(player2, 2 ether); 
        vm.startPrank(player2);
        lotto.purchaseTicket{value: 1 ether}(nums);
        vm.expectRevert("Only the owner can perform this action");
        lotto.announceWinners();
        vm.stopPrank();
    }

    function testAnnounceWinner() public {
        vm.startPrank(owner);
        lotto.generateWinningNumbers();
        vm.stopPrank();
        uint8[6] memory nums = lotto.getWinningNumsForCurrentWeek();
        vm.deal(owner, 2 ether); 
        vm.startPrank(owner);
        lotto.purchaseTicket{value: 1 ether}(nums);
        lotto.announceWinners();
        assertEq(lotto.winnings(owner), 1000 ether, "Incorrect prize amount for the winner");
        vm.stopPrank();
    }
    
    function testMultipuleAnnounceWinner() public {
        vm.startPrank(owner);
        lotto.generateWinningNumbers();
        vm.stopPrank();
        uint8[6] memory nums = lotto.getWinningNumsForCurrentWeek();

        // generate random numbers not in winning numbers
        uint8[6] memory nums2;
        uint8 count = 0;
        for (uint8 i = 1; i < 13; i++) {
            if(count == 6) break;
            bool unique = true;
            for(uint8 j = 0; j < 6; j++) {
                if(i == nums[j])  unique = false;
            }
            if(unique) {
                nums2[count++] = i;
            }
        }

        vm.deal(owner, 3 ether); 
        vm.deal(player1, 3 ether); 
        vm.deal(player2, 3 ether); 
        vm.prank(player1);
        lotto.purchaseTicket{value: 1 ether}(nums);
        vm.prank(player2);
        lotto.purchaseTicket{value: 1 ether}([nums[0], nums[1], nums[2],nums[4] ,nums2[1] ,nums2[2]]);
        vm.prank(player2);
        lotto.purchaseTicket{value: 1 ether}([nums2[0] ,nums2[1] ,nums2[2], nums2[3], nums2[4], nums2[5]]);

        vm.startPrank(owner);
        lotto.purchaseTicket{value: 1 ether}([nums[0], nums[1], nums[2],nums[4] ,nums2[1] ,nums2[2]]);
        lotto.announceWinners();
        assertEq(lotto.winnings(player1), 1000 ether, "Incorrect prize amount for the winner1");
        assertEq(lotto.winnings(player2), 0.27 ether, "Incorrect prize amount for the winner2");
        assertEq(lotto.winnings(owner), 0.27 ether, "Incorrect prize amount for the winner3");
        vm.stopPrank();
    }

    function testWinnersByWeek() public {
        vm.startPrank(owner);
        lotto.generateWinningNumbers();
        vm.stopPrank();
        uint8[6] memory nums = lotto.getWinningNumsForCurrentWeek();
        vm.deal(player2, 3 ether); 
        vm.deal(player1, 3 ether); 
        vm.prank(player1);
        lotto.purchaseTicket{value: 1 ether}(nums);
        vm.prank(player2);

        // generate random numbers not in winning numbers
        uint8[6] memory nums2;
        for (uint8 i = 1; i < 7; i++) {
            bool unique = true;
            for(uint8 j = 0; j < 3; j++) {
                if(i == nums[j])  unique = false;
            }
            if(unique) {
                nums2[i-1] = i;
            }
        }

        lotto.purchaseTicket{value: 1 ether}([nums[0], nums[1], nums[2],nums2[0] ,nums2[1] ,nums2[2]]);
        vm.prank(player2);
        lotto.purchaseTicket{value: 1 ether}([nums2[0] ,nums2[1] ,nums2[2], nums2[3], nums2[4], nums2[5]]);

        vm.startPrank(owner);
        lotto.announceWinners();
        Lotto649.WinnerInfo[] memory winners = lotto.getMywinnerForCurrentWeek();
        assertEq(winners[0].winner, player1, "Wrong winners for winner1");
        assertEq(winners[0].matchCount, 6, "Wrong count for winner1");
        assertEq(winners[1].winner, player2, "Wrong winners for winner2 ");
        assertEq(winners[1].matchCount, 3, "Wrong count for winner2");
        vm.stopPrank();
    }

    function testAnnounceNoticket() public {
        vm.startPrank(owner);
        lotto.generateWinningNumbers();
        vm.stopPrank();
        vm.startPrank(owner);
        vm.expectRevert("No tickets purchased");
        lotto.announceWinners();
        vm.stopPrank();
    }

    function testGenerateWinningNumbers() public {
        vm.startPrank(owner);
        lotto.generateWinningNumbers();
        vm.stopPrank();
        uint8[6] memory nums = lotto.getWinningNumsForCurrentWeek();
        for (uint i = 0; i < 6; i++) {
            assertTrue(nums[i] >= 1 && nums[i] <= 49, "Winning number out of range");
        }

        for (uint i = 0; i < 6; i++) {
            for (uint j = i + 1; j < 6; j++) {
                assertNotEq(nums[i], nums[j], "Winning numbers are not unique");
            }
        }
    }
}