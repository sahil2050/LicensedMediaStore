var LicensedMediaStore = artifacts.require("./LicensedMediaStore.sol");
module.exports = function(deployer) {
  deployer.deploy(LicensedMediaStore, [web3.eth.accounts[0], web3.eth.accounts[1], web3.eth.accounts[2], web3.eth.accounts[3],web3.eth.accounts[4]], {gas: 6700000});
};