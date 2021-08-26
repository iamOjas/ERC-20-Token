const BPTTokenSale = artifacts.require("./BPTTokenSale.sol");
const BPTToken = artifacts.require("./BPTToken.sol");
const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

contract("BPTToken", accounts => {
    let BPTTokenInstance;
    let BPTTokenSaleInstance;
    let account0 = accounts[0];
    let account1 = accounts[1];
    let tokenAvailable = 750;

    beforeEach(async () => {
        BPTTokenInstance = await BPTToken.deployed();
        BPTTokenSaleInstance = await BPTTokenSale.deployed();
    });

    describe('initialize the contract with correct values', function () {
        it("...should have correct BPTToken address ", async () => {
            const storedData = await BPTTokenSaleInstance.tokenContract.call();
            const address = await BPTTokenInstance.address;
            assert.equal(storedData, address, "BPTToken address is not correct");
        });
        it("...should have correct Token Price ", async () => {
            const storedData = await BPTTokenSaleInstance.tokenPrice.call();
            assert.equal(storedData, 10000, "Token Price is not correct");
        })
    });

    describe('Testing buyTokens function', function () {
        it("should throw an error if ether send is not equal to ether amount of tokens ", async () => {
            try {
                await BPTTokenSaleInstance.buyTokens(10, {
                    from: account0,
                    value: 1000000
                });
                assert.fail('Should throw an error');
            } catch (error) {
                assert.include(error.message, "Send Correct Number of ether")
            }
        });
        it("should throw an error if number of tokens are not avalaible ", async () => {
            await BPTTokenInstance.transfer(BPTTokenSaleInstance.address, tokenAvailable)
            try {
                await BPTTokenSaleInstance.buyTokens(751, {
                    from: account0,
                    value: 7510000
                });
                assert.fail('Should throw an error');
            } catch (error) {
                assert.include(error.message, "Not enough Tokens available to buy")
            }
        });
        it("TokensSold value should increase", async () => {
            await BPTTokenInstance.transfer(BPTTokenSaleInstance.address, tokenAvailable);
            await BPTTokenSaleInstance.buyTokens(750, {
                from: account0,
                value: 7500000
            });
            const storedData = await BPTTokenSaleInstance.tokensSold.call();
            assert.equal(storedData, 750, "Incorrect value stored in tokensSold")
        })
        it("Sell event sould be triggered", async () => {
            await BPTTokenInstance.transfer(BPTTokenSaleInstance.address, tokenAvailable);
            let tx = await BPTTokenSaleInstance.buyTokens(750, {
                from: account0,
                value: 7500000
            });
            truffleAssert.eventEmitted(tx, 'Sell', (ev) => {
                assert.equal(ev._buyer, account0, "Incorrect from address returned")
                assert.equal(ev._amount, 750, "Incorrect value returned")
                return true;
            }, 'TestEvent should be emitted with correct parameters');

        })
    });

    describe('Testing endSale function', function () {
        it("Testing if only admin can call this function", async() =>{
            try{
            await BPTTokenSaleInstance.endSale({from: account1});
            assert.fail('Should throw an error');
            }
            catch(error){
                assert.include(error.message, "Only admin can call this function")
            }
        })
        it("Testing if funds are transffered to the admin",async() => {
            await BPTTokenInstance.transfer(BPTTokenSaleInstance.address, tokenAvailable)
            const dataBefore = await BPTTokenInstance.balanceOf(account0);
            await BPTTokenSaleInstance.endSale({from: account0});
            const dataAfter = await BPTTokenInstance.balanceOf(account0);

            assert.isAtLeast(dataAfter.toNumber(), dataBefore.toNumber(), 'Balance of the admin should have increased or remained equal ')  
        })
    });

});