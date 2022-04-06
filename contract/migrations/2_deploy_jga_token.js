const JgaToken = artifacts.require('JgaToken.sol');

module.exports = async (deployer, network, addresses) => {
  const [owner, _] = addresses;

  await deployer.deploy(JgaToken, { from: owner });
  const jgaToken = await JgaToken.deployed();
};