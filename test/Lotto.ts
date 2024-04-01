const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lotto649", function () {


    describe("Test Enter Lottery Success", function () {
        it("Should enter lottery successfully", async function () {
            const Lotto = await ethers.getContractFactory("Lotto649");
            const lotto = await Lotto.deploy();
            await lotto.deployed();

            const [owner, addr1, addr2] = await ethers.getSigners();
            await lotto.connect(addr1).enterLottery({value: ethers.utils.parseEther("1")});
            await lotto.connect(addr2).enterLottery({value: ethers.utils.parseEther("1")});
            expect(await lotto.getPotSize()).to.equal(ethers.utils.parseEther("2"));
        });
    }
    );
});