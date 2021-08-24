const BPTToken = artifacts.require("./BPTToken.sol");
const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

contract("BPTToken", accounts => {

      let BPTTokenInstance;
      let account0 = accounts[0];
      let account1 = accounts[1];

      beforeEach(async () => {
        BPTTokenInstance = await BPTToken.deployed();
      });



      describe('initialize the contract with correct values', function () {
        it("...should have the name 'BlockChain Practice Token'", async () => {
          // Get stored value
          const storedData = await BPTTokenInstance.name.call();
          assert.equal(storedData, "BlockChain Practice Token", "The name was not set to BlockChain Practice Token.");
        });
        it("...should have the symbol 'BPT'", async () => {
          // Get stored value
          const storedData = await BPTTokenInstance.symbol.call();
          assert.equal(storedData, "BPT", "The symbol was not set to BPT.");
        });
      })
      describe('Testing values after deployement of the contract', function () {
        it("...should have correct initial supply value '", async () => {
          // Get stored value
          const storedData = await BPTTokenInstance.totalSupply.call();
          assert.equal(storedData, 10000000, "Totalsupply is not equal to 10000000.");
        });

        it("Transfer the total supply of tokens to the owner of the contract'", async () => {
          // Get stored value
          const storedData = await BPTTokenInstance.balanceOf.call(account0);
          assert.equal(storedData.toNumber(), 10000000, "Supply not allocated to admin contract");
        });

      })
      describe('Testing Transfer Function of the contract', function () {
        it("...should throw an error if balance is not enough'", async () => {
          ;

          try {
            await BPTTokenInstance.transfer(account1, 99999999999, {
              from: account0
            });
            assert.fail('Should throw an error');
          } catch (error) {
            // assert.throws(() => { throw new Error(error) }, Error, "Hello");
            assert.include(error.message, "You dont have enough balance in your address", "Error not thrown as expected")
          }
        });

        it("balance of the sender should decrease or remain the same ", async () => {
          // Get stored value
          const storedDataBefore = await BPTTokenInstance.balanceOf.call(account0);
          await BPTTokenInstance.transfer(account1, 100, {
            from: account0
          });
          const storedDataAfter = await BPTTokenInstance.balanceOf.call(account0);
          assert.isAtLeast(storedDataBefore.toNumber(), storedDataAfter.toNumber(), 'Balance of the sender didnt decreased or remained equal ');
        });

        it("balance of the receiver should increase or remain the same ", async () => {
          // Get stored value
          const storedDataBefore = await BPTTokenInstance.balanceOf.call(account1);
          await BPTTokenInstance.transfer(account1, 100, {
            from: account0
          });
          const storedDataAfter = await BPTTokenInstance.balanceOf.call(account1);
          assert.isAtLeast(storedDataAfter.toNumber(), storedDataBefore.toNumber(), 'Balance of the receiver didnt increased or remained equal ');
        });

        it("Testing if transfer event is triggered or not", async () => {
          const tx = await BPTTokenInstance.transfer(account1, 100, {
            from: account0
          });
          truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
            assert.equal(ev._from, account0, "Incorrect from address returned")
            assert.equal(ev._to, account1, "Incorrect to address returned")
            assert.equal(ev._value, 100, "Incorrect value returned")
            // return ev._from === account0 && ev._to === account1 && ev._value === 100;
            return true;
          }, 'TestEvent should be emitted with correct parameters');

        })
      })

      describe('Testing Approve function', function () {
        it("Testing if the allowance has been alloted'", async () => {
          // Get stored value
          await BPTTokenInstance.approve(account1, 100, {
            from: account0
          })
          const storedData = await BPTTokenInstance.allowance.call(account0, account1);
          assert.equal(storedData, 100, "Allowance should be 100");
        });

        it("Testing if Approal event is triggered or not", async () => {
          const tx = await BPTTokenInstance.approve(account1, 100, {
            from: account0
          })
          truffleAssert.eventEmitted(tx, 'Approval', (ev) => {
            assert.equal(ev._owner, account0, "Incorrect owner address returned")
            assert.equal(ev._spender, account1, "Incorrect spender address returned")
            assert.equal(ev._value, 100, "Incorrect value returned")
            // return ev._from === account0 && ev._to === account1 && ev._value === 100;
            return true;
          }, 'TestEvent should be emitted with correct parameters');

        })

        it("Testing if it returns true when there is no error", async () => {
          const tx = await BPTTokenInstance.approve(account1, 100, {
            from: account0
          })
          let receipt = tx.receipt
          assert.equal(receipt.status, true, "Returned value is not true");
        })

      })

      describe('Testing transferFrom function', function () {
        it("Testing require Balance condition'", async () => {
          try {
            await BPTTokenInstance.approve(account1, 100, {
              from: account0
            })
            await BPTTokenInstance.transferFrom(account0, accounts[2], 999999999, {
              from: account1
            });
            assert.fail('Should throw an error');
          } catch (error) {
            assert.include(error.message, "Sender does not have enough balance in his account", "Error not thrown as expected")
          }
        });
        it("Testing spender allowance condition'", async () => {
          try {
            await BPTTokenInstance.approve(account1, 100, {
              from: account0
            })
            await BPTTokenInstance.transferFrom(account0, accounts[2], 1000, {
              from: account1
            });
            assert.fail('Should throw an error');
          } catch (error) {
            assert.include(error.message, "The spender does not have enough allowance")
          }
        });

        it("Balance of from account should be decreased or remain same", async () => {
          const storedDataBefore = await BPTTokenInstance.balanceOf.call(account0);
          await BPTTokenInstance.approve(account1, 100, {
            from: account0
          })
          await BPTTokenInstance.transferFrom(account0, accounts[2], 100, {
            from: account1
          });
          const storedDataAfter = await BPTTokenInstance.balanceOf.call(account0);
          assert.isAtLeast(storedDataBefore.toNumber(), storedDataAfter.toNumber(), 'Balance of the sender didnt decreased or remained equal ')
        })

        it("Balance of 'To' account should be increased or remain same", async () => {
          const storedDataBefore = await BPTTokenInstance.balanceOf.call(accounts[2]);
          await BPTTokenInstance.approve(account1, 100, {
            from: account0
          })
          await BPTTokenInstance.transferFrom(account0, accounts[2], 100, {
            from: account1
          });
          const storedDataAfter = await BPTTokenInstance.balanceOf.call(accounts[2]);
          assert.isAtLeast(storedDataAfter.toNumber(), storedDataBefore.toNumber(), 'Balance of the receiver didnt increased or remained equal ')
        })

        it("Allowance of sender account should decrease", async () => {
          await BPTTokenInstance.approve(account1, 100, {
            from: account0
          })
          const storedDataBefore = await BPTTokenInstance.allowance.call(account0, account1);
          await BPTTokenInstance.transferFrom(account0, accounts[2], 100, {
            from: account1
          });
          const storedDataAfter = await BPTTokenInstance.allowance.call(account0, account1, {
            from: account0
          });
          assert.isAtLeast(storedDataBefore.toNumber(), storedDataAfter.toNumber(), 'Allowance didnt decreased or remained equal ')
        })

        it("Testing Transfer event", async () => {
          await BPTTokenInstance.approve(account1, 100, {
            from: account0
          })
          const tx = await BPTTokenInstance.transferFrom(account0, accounts[2], 100, {
            from: account1
          });
          truffleAssert.eventEmitted(tx, 'Transfer', (ev) => {
            assert.equal(ev._from, account0, "Incorrect 'from' address returned")
            assert.equal(ev._to, accounts[2], "Incorrect 'to' address returned")
            assert.equal(ev._value, 100, "Incorrect value returned")
            return true;
          })

        })

        it("Checking if the function returns true",async () =>{
          await BPTTokenInstance.approve(account1, 100, {
            from: account0
          })

        let tx = await BPTTokenInstance.transferFrom(account0, accounts[2], 100, {
            from: account1
          });
          let receipt = tx.receipt
          assert.equal(receipt.status, true, "Returned value is not true");
        })
      })
    })