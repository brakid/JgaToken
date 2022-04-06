const VaultToken = artifacts.require('VaultToken.sol');

module.exports = async (deployer, network, addresses) => {
  const [owner, _] = addresses;

  await deployer.deploy(VaultToken, { from: owner });
  const vaultToken = await VaultToken.deployed();
};