const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const [ ownerAddress, otherAddress, _ ] = accounts;
const { BN, expectEvent, expectRevert, constants } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

const VaultToken = contract.fromArtifact('VaultToken');

describe('VaultToken', async () => {
  let vaultToken;
  beforeEach(async () => {
    vaultToken = await VaultToken.new({ from: ownerAddress });
  });

  it('should revert if not called by owner', async () => {
    const tokenId = new BN(123456);
    await expectRevert(vaultToken.mint(tokenId, { from: otherAddress }), 'Only the owner is allowed to call this operation');
    
    await vaultToken.mint(tokenId, { from: ownerAddress });
  });

  it('should return the Vault URI', async () => {
    const tokenId = new BN(1234567);
    
    const receipt = await vaultToken.mint(tokenId, { from: ownerAddress });
    
    expectEvent(receipt, 'Transfer', {
      from: constants.ZERO_ADDRESS,
      to: ownerAddress,
      tokenId: tokenId,
    });
    
    expect(await vaultToken.ownerOf(tokenId)).to.be.bignumber.equal(ownerAddress);

    const tokenUri = await vaultToken.tokenURI(tokenId);
    expect(tokenUri).to.be.equal('https://brakid-vault.web.app/vault/1234567');
  });
});