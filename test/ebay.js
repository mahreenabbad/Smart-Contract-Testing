const {loadFixture}= require("@nomicfoundation/hardhat-toolbox/network-helpers")
const {expect} =require("chai")
const {anyValue} = require("@nomicfoundation/hardhat-chai-matchers/withArgs")



describe("ebay",function(){
    async function runEveryTime(){
        const [seller,buyer1,buyer2,buyer3] = await ethers.getSigners();

        const ebay= await ethers.deployContract("Ebay");
         
        return {seller,buyer1,buyer2,buyer3,ebay}
    }
        const auction={
            name:"auction1",
            description:"selling item1",
            min:10
        }
        
       
        describe("Check create auction",function(){
            it("should create an auction",async function(){
            const {ebay,seller} = await loadFixture(runEveryTime);
            await ebay.createAuction(auction.name,auction.description,auction.min)

            
            const getAuctions=await ebay.getAuctions();
            expect(getAuctions.length == 1);
            expect(getAuctions[0].name == auction.name);
            expect(getAuctions[0].description == auction.description);
            expect(getAuctions[0].min == auction.min)
            // console.log(getAuctions[0].min)
        });
        it("shuold not create an offer if auction not exist", async function(){
            const {buyer1,ebay} = await loadFixture(runEveryTime);
          //both line are woking fine
          //await  expect( ebay.connect(buyer1).createOffer(1,{ value:auction.min +10})).to.be.revertedWith("Auction not exist")
          await  expect( ebay.createOffer(1,{ value:auction.min +10})).to.be.revertedWith("Auction not exist")
        });

        it("should not create an offer if price is less than min",async function(){
            const {ebay} = await loadFixture(runEveryTime);
             await ebay.createAuction(auction.name,auction.description,auction.min);
            // console.log("here are the auction values:", auction.name,auction.description,auction.min)
            
          expect(await ebay.createOffer(1,{ value: auction.min -5})).to.be.revertedWith("Increase ur bidding price")
        });
        it("Should create an offer",async function(){
            const {ebay,buyer1} = await loadFixture(runEveryTime);
            await ebay.createAuction(auction.name,auction.description,auction.min);

            await ebay.connect(buyer1).createOffer(1,{value:auction.min})
           const userOffer= await ebay.getUserOffers(buyer1)

             expect(userOffer.length==1);
             expect(userOffer[0].id == 1);
             expect( userOffer[0].auctionId == 1);
             expect(userOffer[0].buyeer == buyer1);
             expect(userOffer[0].price == auction.min)
        });
        it("Should not transact if auction not exist",async function(){
            const {ebay,buyer2} = await loadFixture(runEveryTime);
           await  expect( ebay.connect(buyer2).transaction(1)).to.be.revertedWith("Auction not exist");
        });
        it("should do transaction",async function(){
            const {ebay,seller,buyer1,buyer2,buyer3} = await loadFixture(runEveryTime);

            const bestPrice = auction.min +10;
            // console.log("The best price is",bestPrice)
            // const sellerInitialBalance =ethers.formatEther(await ethers.provider.getBalance(seller));
            const sellerInitialBalance =await ethers.provider.getBalance(seller);
            // console.log("Seller balance before transaction:",sellerInitialBalance)
            //create auction
            await ebay.connect(seller).createAuction(auction.name,auction.description,auction.min);
            //create offer
            await ebay.connect(buyer1).createOffer(1,{value:auction.min});
            await ebay.connect(buyer2).createOffer(1,{value:bestPrice});

            await ebay.connect(buyer3).transaction(1);
            // const sellerAfterBalance =ethers.formatEther(await ethers.provider.getBalance(seller));
            const sellerAfterBalance =await ethers.provider.getBalance(seller);
            // console.log(sellerAfterBalance)

             expect(sellerAfterBalance-sellerInitialBalance == bestPrice);
             
         
        

        })





        })
        


    }
)