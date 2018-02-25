var GNCCrowdsale = artifacts.require("./GNCCrowdsale.sol");
//import assertRevert from './helpers/assertRevert';

contract('GNCCrowdsale', (accounts) => {
    var contract;
    var owner = "0xc2d3B03082E39A91457459aE5fDcFb35F4278e20";
    var rate = Number(575);
    var buyWei = 1 * 10**18;
    var rateNew = Number(575);
    var buyWeiNew = 5 * 10**17;
    var buyWeiMin = 1 * 10**16;
    var totalSupply = 38e+24;

    it('should deployed contract', async ()  => {
        assert.equal(undefined, contract);
        contract = await GNCCrowdsale.deployed();
        assert.notEqual(undefined, contract);
    });

    it('get address contract', async ()  => {
        assert.notEqual(undefined, contract.address);
    });

    it('verification balance owner contract', async ()  => {
        var balanceOwner = await contract.balanceOf(owner);
        //console.log("balanceOwner = " + balanceOwner);
        assert.equal(totalSupply, balanceOwner);
    });

    it('verification of receiving Ether', async ()  => {
        var tokenAllocatedBefore = await contract.tokenAllocated.call();
        var balanceAccountTwoBefore = await contract.balanceOf(accounts[2]);
        var weiRaisedBefore = await contract.weiRaised.call();
        //console.log("tokenAllocatedBefore = " + tokenAllocatedBefore);

        var numberToken = await contract.validPurchaseTokens.call(Number(buyWei));
        //console.log(" numberTokens = " + JSON.stringify(numberToken));
        //console.log("numberTokens = " + numberToken);

        await contract.buyTokens(accounts[2],{from:accounts[2], value:buyWei});
        var tokenAllocatedAfter = await contract.tokenAllocated.call();
        //console.log("tokenAllocatedAfter = " + tokenAllocatedAfter);
        assert.isTrue(tokenAllocatedBefore < tokenAllocatedAfter);
        assert.equal(0, tokenAllocatedBefore);
        assert.equal(rate*buyWei, tokenAllocatedAfter);

       var balanceAccountTwoAfter = await contract.balanceOf(accounts[2]);
        assert.isTrue(balanceAccountTwoBefore < balanceAccountTwoAfter);
        assert.equal(0, balanceAccountTwoBefore);
        assert.equal(rate*buyWei, balanceAccountTwoAfter);

        var weiRaisedAfter = await contract.weiRaised.call();
        //console.log("weiRaisedAfter = " + weiRaisedAfter);
        assert.isTrue(weiRaisedBefore < weiRaisedAfter);
        assert.equal(0, weiRaisedBefore);
        assert.equal(buyWei, weiRaisedAfter);

        var depositedAfter = await contract.getDeposited.call(accounts[2]);
        //console.log("DepositedAfter = " + depositedAfter);
        assert.equal(buyWei, depositedAfter);

        var balanceAccountThreeBefore = await contract.balanceOf(accounts[3]);
        await contract.buyTokens(accounts[3],{from:accounts[3], value:buyWeiNew});
        var balanceAccountThreeAfter = await contract.balanceOf(accounts[3]);
        assert.isTrue(balanceAccountThreeBefore < balanceAccountThreeAfter);
        assert.equal(0, balanceAccountThreeBefore);
        //console.log("balanceAccountThreeAfter = " + balanceAccountThreeAfter);
        assert.equal(rateNew*buyWeiNew, balanceAccountThreeAfter);

        var balanceOwnerAfter = await contract.balanceOf(owner);
        //console.log("balanceOwnerAfter = " + Number(balanceOwnerAfter));
        //assert.equal(totalSupply - balanceAccountThreeAfter - balanceAccountTwoAfter, balanceOwnerAfter);
    });

    it('verification define period', async ()  => {
        var currentDate = 1519516800; // Feb, 25
        period = await contract.getPeriod(currentDate);
        assert.equal(10, period);

        currentDate = 1526342400; // May, 15
        period = await contract.getPeriod(currentDate);
        assert.equal(0, period);

        currentDate = 1530748800; // Jul, 05
        period = await contract.getPeriod(currentDate);
        assert.equal(1, period);

        currentDate = 1532044800; // Jul, 20
        period = await contract.getPeriod(currentDate);
        assert.equal(2, period);

        currentDate = 1533859200; // Aug, 10
        period = await contract.getPeriod(currentDate);
        assert.equal(3, period);

        currentDate = 1536537600; // Sep, 10
        period = await contract.getPeriod(currentDate);
        assert.equal(10, period);
    });

    it('verification claim tokens', async ()  => {
        var balanceAccountOneBefore = await contract.balanceOf(accounts[0]);
        assert.equal(0, balanceAccountOneBefore);
        await contract.buyTokens(accounts[0],{from:accounts[0], value:buyWei});
        var balanceAccountOneAfter = await contract.balanceOf(accounts[0]);
        await contract.transfer(contract.address,balanceAccountOneAfter,{from:accounts[0]});
        var balanceContractBefore = await contract.balanceOf(contract.address);
        assert.equal(buyWei*rate, balanceContractBefore);
        //console.log("balanceContractBefore = " + balanceContractBefore);
        var balanceAccountAfter = await contract.balanceOf(accounts[0]);
        assert.equal(0, balanceAccountAfter);
        var balanceOwnerBefore = await contract.balanceOf(owner);
        await contract.claimTokens(contract.address,{from:accounts[0]});
        var balanceContractAfter = await contract.balanceOf(contract.address);
        assert.equal(0, balanceContractAfter);
        var balanceOwnerAfter = await contract.balanceOf(owner);
        assert.equal(true, balanceOwnerBefore<balanceOwnerAfter);
    });

    it('verification tokens limit min amount', async ()  => {
            var numberTokensMinWey = await contract.validPurchaseTokens.call(buyWeiMin);
            //console.log("numberTokensMinWey = " + numberTokensMinWey);
            assert.equal(0, numberTokensMinWey);
    });


});



