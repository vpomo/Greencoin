const GNCCrowdsale = artifacts.require('./GNCCrowdsale.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner =   "0xc2d3B03082E39A91457459aE5fDcFb35F4278e20";
    var wallet =  "0xE73d4AE8e835E44d9CF77a5b8EeFA71f56D1bCB5";

    deployer.deploy(GNCCrowdsale, owner, wallet);

};
