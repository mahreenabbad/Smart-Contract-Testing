const { loadFixture}= require("@nomicfoundation/hardhat-toolbox/network-helpers") ;
const { anyValue }= require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect }=require("chai") ;
const { ethers }=require("hardhat");
const { toNumber } = require("ethers");


describe("token",function(){
    async function runEveryTime(){
     const [owner, otherAccount, account2] = await ethers.getSigners();
    //  console.log("owner is :",owner)
     

     const token = await ethers.deployContract("Token")
     const ownerBalance = await token.balanceOf(owner);
     return {token, ownerBalance, owner,otherAccount, account2}
    }
    describe("Deployment ",function(){
        it("should set the right owner",async function(){
            const {owner,token}= await loadFixture(runEveryTime)

            expect(await token.owner()).to.equal(owner.address)

        });
        it("should assign the total supply to owner",async function(){
            const {token,ownerBalance}= await loadFixture(runEveryTime);

            expect(await token.totalSupply()).to.equal(ownerBalance);
        });
        it("should transfer token between accounts",async function(){
             const {token,otherAccount,account2} = await loadFixture(runEveryTime);
             //transfer from owner to other account
             await token.transfer(otherAccount,10);
             expect(await token.balanceOf(otherAccount)).to.equal(10);
             //transfer otherAccount to account2

             await token.connect(otherAccount).transfer(account2,5);
             expect(await token.balanceOf(account2)).to.equal(5);
        })
        it("should fail if sender does not have enough balance", async function(){
            const{owner,ownerBalance,otherAccount,token} = await loadFixture(runEveryTime);

            await expect(token.connect(otherAccount).transfer(owner,10)).to.be.revertedWith("u don't have enough balance")
            expect(await token.balanceOf(owner)).to.equal(ownerBalance)
        });
        it("should update balance after every transfer",async function(){
            const {token,owner,ownerBalance,otherAccount,account2}= await loadFixture(runEveryTime);
            
            //token transfer from owner
            await token.transfer(otherAccount,10);
            await token.transfer(account2,20);
            const ownerLastBalance = await token.balanceOf(owner.address);
           
           expect(ownerLastBalance).to.equal(toNumber(ownerBalance) - 30);

            const otherAccountBalance = await token.balanceOf(otherAccount);
            expect(otherAccountBalance).to.equal(10);

            const account2Balance = await token.balanceOf(account2);
            expect(account2Balance).to.equal(20)

        })
    })
})