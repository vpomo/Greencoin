const GNCCrowdsale = artifacts.require('./GNCCrowdsale.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner =   "0x8Ac4ebcCff568797Ea4Dbb5F39b0ac534ccB901a";
    var wallet =  "0xb668078646d38E2E2B4773783280182707Ae5f55";
    var ownerTwo = "0xf1F1ff0B8ee5e4b7D8564CFADEC545753f8C9111";

    deployer.deploy(GNCCrowdsale, owner, wallet, ownerTwo);
};
