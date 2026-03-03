import { expect } from "chai";
import hre from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

describe("WhitelistNFT - Pruebas de Merkle Tree", function () {
  
  it("Deberia permitir mintear a un usuario en la whitelist", async function () {
    const { ethers } = await hre.network.connect();
    const [owner, usuarioAutorizado, usuarioNoAutorizado] = await ethers.getSigners();

    const whitelist = [owner.address, usuarioAutorizado.address];

    const leaves = whitelist.map((addr: string) => keccak256(addr));
    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const rootHash = merkleTree.getHexRoot();

    const WhitelistNFT = await ethers.getContractFactory("WhitelistNFT");
    const nftContract = await WhitelistNFT.deploy(rootHash);
    await nftContract.waitForDeployment();

    const leaf = keccak256(usuarioAutorizado.address);
    const proof = merkleTree.getHexProof(leaf);

    const precioWhitelist = ethers.parseEther("0.005");
    
    await expect(
        nftContract.connect(usuarioAutorizado).whitelistMint(proof, { value: precioWhitelist })
    ).to.not.revert(ethers);

    expect(await (nftContract as any).balanceOf(usuarioAutorizado.address)).to.equal(1n);
  });

  it("Deberia rechazar a un usuario que NO esta en la whitelist", async function () {
    const { ethers } = await hre.network.connect();
    const [owner, usuarioAutorizado, usuarioNoAutorizado] = await ethers.getSigners();
    const whitelist = [owner.address, usuarioAutorizado.address];

    const leaves = whitelist.map((addr: string) => keccak256(addr));
    const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const rootHash = merkleTree.getHexRoot();

    const WhitelistNFT = await ethers.getContractFactory("WhitelistNFT");
    const nftContract = await WhitelistNFT.deploy(rootHash);
    await nftContract.waitForDeployment();

    const leaf = keccak256(usuarioNoAutorizado.address);
    const fakeProof = merkleTree.getHexProof(leaf);

    const precioWhitelist = ethers.parseEther("0.005");
    
    await expect(
        nftContract.connect(usuarioNoAutorizado).whitelistMint(fakeProof, { value: precioWhitelist })
    ).to.be.revertedWith("Prueba invalida o no estas en la whitelist");
  });
});