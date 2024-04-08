const { ethers,network } = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
//import "hardhat/console.sol";

describe("Lotto649", function () {
    let owner;
    let player1;
    let player2;
    let lotto;
    let startAt;
    

    async function deployVariable() {
        const [owner, player1, player2] = await ethers.getSigners();
        const Lotto649 = await ethers.getContractFactory("Lotto649");
        //await Lotto649.waitForDeployment();
        const lotto = await Lotto649.deploy();
        const ticketPrice = ethers.parseEther("1");
        //await lotto.deployed();
        //startAt = Math.floor(Date.now() / 1000); // current timestamp in seconds
        return {lotto,owner, player1, player2,ticketPrice};
    };

    it("should allow entering lottery successfully", async function () {
        const {lotto,owner, player1, player2,ticketPrice } = await loadFixture(deployVariable);
        const numbers = [5, 12, 23, 34, 45, 46];
        await lotto.connect(player1).purchaseTicket(numbers, { value: ticketPrice });

        const balance = await ethers.provider.getBalance(lotto.target);
        expect(balance).to.equal(ticketPrice);

        const winnings = await lotto.winnings(player1.address);
        expect(winnings).to.equal(0);
    });


    it("should revert if buying ticket with insufficient funds", async function () {
        const {lotto,owner, player1, player2,ticketPrice } = await loadFixture(deployVariable);
        const numbers = [5, 12, 23, 34, 45, 46];
        await expect(lotto.connect(player2).purchaseTicket(numbers, { value: ethers.parseEther("0.5") }))
            .to.be.revertedWith("Ticket price is 1 ETH");
    });

    it("should revert if buying ticket with non-unique numbers", async function () {
        const {lotto,owner, player1, player2,ticketPrice } = await loadFixture(deployVariable);
        await expect(lotto.connect(player2).purchaseTicket([7, 8, 45, 45, 11, 12], { value: ticketPrice }))
            .to.be.revertedWith("Numbers must be unique");
    });

    it("should revert if buying ticket with out-of-bound numbers", async function () {
        const {lotto,owner, player1, player2,ticketPrice } = await loadFixture(deployVariable);
        await expect(lotto.connect(player2).purchaseTicket([7, 8, 56, 45, 11, 12], { value: ticketPrice }))
            .to.be.revertedWith("Numbers must be between 1 and 49");
    });

    it("should correctly update pot amount after purchases", async function () {
        const {lotto,owner, player1, player2,ticketPrice } = await loadFixture(deployVariable);
        const initialPot = await lotto.getPotSize();
        expect(initialPot).to.equal(0);

        for (let i = 0; i < 3; i++) {
            await lotto.connect(player1).purchaseTicket([1, 2, 3, 4, 5, 6], { value: ticketPrice });
        }

        const expectedPot = ethers.parseEther("3");
        const actualPot = await lotto.getPotSize();
        expect(actualPot).to.equal(expectedPot);
    });

    it("should correctly update purchases infor", async function () {
        const {lotto,owner, player1, player2,ticketPrice } = await loadFixture(deployVariable);
        const numbers = [5, 12, 23, 34, 45, 46];

        await lotto.connect(player2).purchaseTicket(numbers, { value: ticketPrice });
        
        const ticketstore = await lotto.connect(player2).getMyTicketsForCurrentWeek();
        const lencount = await lotto.connect(player2).getTicketArrayLen(); 
        expect(lencount).to.equal(1);
        
        expect(ticketstore[0].entrant).to.equal(player2.address);
        for (let i = 0; i < 6; i++) {
            expect(ticketstore[0].numbers[i]).to.equal(numbers[i]);
        }
    });

    it("should revert announceWinners when called by non-owner", async function () {
        const {lotto,owner, player1, player2,ticketPrice } = await loadFixture(deployVariable);
        const numbers = [5, 12, 23, 34, 45, 46];
        
        await lotto.connect(player1).purchaseTicket(numbers, { value: ticketPrice});
        
        await lotto.connect(owner).generateWinningNumbers({gasLimit: 5000000});
    
        await expect(lotto.connect(player1).announceWinners())
          .to.be.revertedWith("Only the owner can perform this action");
      });


    it("should correctly announce the winner and assign the prize", async function () {
        const {lotto,owner, player1, player2,ticketPrice } = await loadFixture(deployVariable);
        const expectedPrize = ethers.parseEther("1000");
        
        await lotto.connect(owner).generateWinningNumbers();
        const nums = await lotto.getWinningNumsForCurrentWeek();
        const mutableNums = [...nums];
        await lotto.connect(player1).purchaseTicket(mutableNums, { value: ticketPrice });
        await lotto.connect(owner).announceWinners();
        const player1Winnings = await lotto.winnings(player1.address);
        expect(player1Winnings).to.equal(expectedPrize, "Incorrect prize amount for the winner");
    });

    it("should correctly announce multiple winners and assign prizes", async function () {
        const { lotto, owner, player1, player2,ticketPrice } = await loadFixture(deployVariable);
        const expectedPrizePlayer1 = ethers.parseEther("1000");
        const expectedPrizePlayer2 = ethers.parseEther("0.135");
        const expectedPrizeOwner = ethers.parseEther("0.135");
    
        await lotto.connect(owner).generateWinningNumbers();
        const nums = (await lotto.getWinningNumsForCurrentWeek());
        const mutableNums = [...nums];
        for (let i =0; i <6;i++){
            mutableNums[i] = Number(nums[i])
        }
        
        // Generate non-winning numbers
        const nums2 = [];
        let count = 0;
        for (let i = 1; i <= 49; i++) {
            if (count === 6) break;
            let unique = true;
            for (let j = 0; j < 6; j++) {
                if (i === mutableNums[j]) {
                    unique = false;
                    break;
                }
            }
            if (unique) {
                nums2.push(i);
                count++;
            }
        }
        //console.log(nums,nums2,mutableNums);
        await lotto.connect(player1).purchaseTicket(mutableNums, { value: ticketPrice });
        await lotto.connect(player2).purchaseTicket([mutableNums[0], mutableNums[1], mutableNums[2], mutableNums[4], nums2[1], nums2[2]], { value: ticketPrice, });
        await lotto.connect(player2).purchaseTicket([nums2[0], nums2[1], nums2[2], nums2[3], nums2[4], nums2[5]], { value: ticketPrice }); //, gasLimit: 10000000
        await lotto.connect(owner).purchaseTicket([mutableNums[0], mutableNums[1], mutableNums[2], mutableNums[4], nums2[1], nums2[2]], { value: ticketPrice });
    
        
        await lotto.connect(owner).announceWinners();
    
        
        const player1Winnings = await lotto.winnings(player1.address);
        const player2Winnings = await lotto.winnings(player2.address);
        const ownerWinnings = await lotto.winnings(owner.address);
    
        expect(player1Winnings).to.equal(expectedPrizePlayer1, "Incorrect prize amount for player1");
        expect(player2Winnings).to.equal(expectedPrizePlayer2, "Incorrect prize amount for player2");
        expect(ownerWinnings).to.equal(expectedPrizeOwner, "Incorrect prize amount for owner");
    });

    it("should correctly list winners for the current week", async function () {
        const { lotto, owner, player1, player2,ticketPrice } = await loadFixture(deployVariable);
    
        await lotto.connect(owner).generateWinningNumbers();
        const nums = (await lotto.getWinningNumsForCurrentWeek());
        const mutableNums = [...nums];
        for (let i =0; i <6;i++){
            mutableNums[i] = Number(nums[i])
        }
        // Purchase tickets for players
        await lotto.connect(player1).purchaseTicket(mutableNums, { value: ticketPrice});
        const nums2 = [];
        let count = 0;
        for (let i = 1; i <= 49; i++) {
            if (count === 6) break;
            let unique = true;
            for (let j = 0; j < 6; j++) {
                if (i === mutableNums[j]) {
                    unique = false;
                    break;
                }
            }
            if (unique) {
                nums2.push(i);
                count++;
            }
        }
        
        await lotto.connect(player2).purchaseTicket([mutableNums[0], mutableNums[1], mutableNums[2], nums2[0], nums2[1], nums2[2]], { value: ticketPrice });
        await lotto.connect(player2).purchaseTicket(nums2, { value: ticketPrice });
    
        await lotto.connect(owner).announceWinners();
    
        const winners = await lotto.getMywinnerForCurrentWeek();
    
        expect(winners[0].winner).to.equal(player1, "Wrong winner for player1");
        expect(winners[0].matchCount).to.equal(6, "Wrong count for player1");
        expect(winners[1].winner).to.equal(player2, "Wrong winner for player2");
        expect(winners[1].matchCount).to.equal(3, "Wrong count for player2");
    });
    
    
    it("should revert if announcing winners without tickets purchased", async function () {
        const {lotto,owner, player1, player2,ticketPrice } = await loadFixture(deployVariable);
        await lotto.connect(owner).generateWinningNumbers();
        await expect(lotto.connect(owner).announceWinners())
            .to.be.revertedWith("No tickets purchased");
    });

    it("should generate winning numbers within the valid range and unique", async function () {
        const {lotto,owner, player1, player2,ticketPrice } = await loadFixture(deployVariable);
        await lotto.generateWinningNumbers();
        const nums = await lotto.getWinningNumsForCurrentWeek();

        for (let i = 0; i < 6; i++) {
            expect(nums[i]).to.be.within(1, 49);
        }

        for (let i = 0; i < 6; i++) {
            for (let j = i + 1; j < 6; j++) {
                expect(nums[i]).to.not.equal(nums[j]);
            }
        }
    });

    it("should revert if buying ticket at a bad purchase time", async function () {
        const {lotto,owner, player1, player2,ticketPrice } = await loadFixture(deployVariable);
        const numbers = [5, 12, 23, 34, 45, 46];
        await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60 + 1]);
        await network.provider.send("evm_mine");
        await expect(lotto.connect(player1).purchaseTicket(numbers, { value: ticketPrice}))
            .to.be.revertedWith("Purchases are not within the allowed week");
    });



    it("should correctly use Certain ticket function", async function () {
        const { lotto, owner, player1, player2,ticketPrice } = await loadFixture(deployVariable);
    
        await lotto.connect(owner).generateWinningNumbers();
        const nums = (await lotto.getWinningNumsForCurrentWeek());
        const mutableNums = [...nums];
        for (let i =0; i <6;i++){
            mutableNums[i] = Number(nums[i])
        }
        
        // Generate non-winning numbers
        const nums2 = [];
        let count = 0;
        for (let i = 1; i <= 49; i++) {
            if (count === 6) break;
            let unique = true;
            for (let j = 0; j < 6; j++) {
                if (i === mutableNums[j]) {
                    unique = false;
                    break;
                }
            }
            if (unique) {
                nums2.push(i);
                count++;
            }
        }
        //console.log(nums,nums2,mutableNums);
        await lotto.connect(player1).purchaseTicket(mutableNums, { value: ticketPrice });
        await lotto.connect(player2).purchaseTicket(nums2, { value: ticketPrice, });
        await lotto.connect(player2).purchaseTicket(mutableNums, { value: ticketPrice }); //, gasLimit: 10000000
        await lotto.connect(player1).purchaseTicket(nums2, { value: ticketPrice });
    
        const ticket1 = await lotto.connect(player1).getMyTicketsForCertainWeek();
        for(let i = 0; i < 6; i++){
            expect(ticket1[0].numbers[i]).to.equal(mutableNums[i]);
        }
        expect(ticket1[0].prize).to.equal(0, "Incorrect prize amount for player1");
        for(let i = 0; i < 6; i++){
            expect(ticket1[1].numbers[i]).to.equal(nums2[i]);
        }

        await lotto.connect(owner).announceWinners();
    
        const ticket12 = await lotto.connect(player1).getMyTicketsForCertainWeek();

        expect(ticket12.length).to.equal(2, "Incorrect Length")
        for(let i = 0; i < 6; i++){
            expect(ticket12[0].numbers[i]).to.equal(mutableNums[i]);
        }
        expect(ticket12[0].prize).to.equal(1, "Incorrect prize amount for player1");
        
    });

    it("should correctly use Certain winner function", async function () {
        const { lotto, owner, player1, player2,ticketPrice } = await loadFixture(deployVariable);
    
        await lotto.connect(owner).generateWinningNumbers();
        const nums = (await lotto.getWinningNumsForCurrentWeek());
        const mutableNums = [...nums];
        for (let i =0; i <6;i++){
            mutableNums[i] = Number(nums[i])
        }
        
        // Generate non-winning numbers
        const nums2 = [];
        let count = 0;
        for (let i = 1; i <= 49; i++) {
            if (count === 6) break;
            let unique = true;
            for (let j = 0; j < 6; j++) {
                if (i === mutableNums[j]) {
                    unique = false;
                    break;
                }
            }
            if (unique) {
                nums2.push(i);
                count++;
            }
        }
        //console.log(nums,nums2,mutableNums);
        await lotto.connect(player1).purchaseTicket(mutableNums, { value: ticketPrice });
        await lotto.connect(player2).purchaseTicket([mutableNums[0],mutableNums[1],mutableNums[2],mutableNums[3],nums2[0],nums2[1]], { value: ticketPrice, });
        await lotto.connect(player2).purchaseTicket(nums2, { value: ticketPrice }); //, gasLimit: 10000000
        await lotto.connect(player1).purchaseTicket(nums2, { value: ticketPrice });
        
        await lotto.connect(owner).announceWinners();
    
        const ticket1 = await lotto.getMywinnerForCertainWeek();
        
        expect(ticket1[0].winner).to.equal(player1, "Incorrect address amount for player1");

        for(let i = 0; i < 6; i++){
            expect(ticket1[0].numbers[i]).to.equal(mutableNums[i]);
        }

        expect(ticket1[0].matchCount).to.equal(6, "Incorrect match count amount for player1");
        
        expect(ticket1[1].winner).to.equal(player2, "Incorrect address amount for player2");

        for(let i = 0; i < 4; i++){
            expect(ticket1[1].numbers[i]).to.equal(mutableNums[i]);
        }
        for(let i = 0; i < 2; i++){
            expect(ticket1[1].numbers[i+4]).to.equal(nums2[i]);
        }

        expect(ticket1[1].matchCount).to.equal(4, "Incorrect match count amount for player2");
        
    });


});
