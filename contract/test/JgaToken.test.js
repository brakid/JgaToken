const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const [ ownerAddress, otherAddress, anotherAddress, _ ] = accounts;
const { BN, expectEvent, expectRevert, constants } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

const JgaToken = contract.fromArtifact('JgaToken');

describe('JgaToken', async () => {
  let jgaToken;
  beforeEach(async () => {
    jgaToken = await JgaToken.new({ from: ownerAddress });
  });

  it('should revert if not called by owner', async () => {
    await expectRevert(jgaToken.whitelistAddress(anotherAddress, { from: otherAddress }), 'Only the owner is allowed to call this operation');
  });

  it('should revert if address is already whitelisted', async () => {
    const receipt = await jgaToken.whitelistAddress(anotherAddress, { from: ownerAddress });
    
    expectEvent(receipt, 'WhitelistedAddressEvent', {
      whitelistedAddress: anotherAddress
    });

    await expectRevert(jgaToken.whitelistAddress(anotherAddress, { from: ownerAddress }), 'Address is already whitelisted');
  });

  it('should return the Token Id', async () => {
    await jgaToken.whitelistAddress(anotherAddress, { from: ownerAddress })

    const tokenId = new BN(1234567);
    
    const receipt = await jgaToken.mint(tokenId, { from: anotherAddress });
    
    expectEvent(receipt, 'Transfer', {
      from: constants.ZERO_ADDRESS,
      to: anotherAddress,
      tokenId: tokenId,
    });
    
    expect(await jgaToken.ownerOf(tokenId)).to.be.bignumber.equal(anotherAddress);

    const tokenUri = await jgaToken.tokenURI(tokenId);
    expect(tokenUri).to.be.equal('https://github.com/brakid/JgaToken/raw/master/images/1234567.png');
  });

  it('should revert if address has already minted a token', async () => {
    await jgaToken.whitelistAddress(anotherAddress, { from: ownerAddress })

    const tokenId = new BN(1234567);
    
    const receipt = await jgaToken.mint(tokenId, { from: anotherAddress });
    
    expectEvent(receipt, 'Transfer', {
      from: constants.ZERO_ADDRESS,
      to: anotherAddress,
      tokenId: tokenId,
    });
    
    expect(await jgaToken.ownerOf(tokenId)).to.be.bignumber.equal(anotherAddress);

    const otherTokenId = new BN(12345678);

    await expectRevert(jgaToken.mint(otherTokenId, { from: anotherAddress }), 'Sender has already minted');
  });
});