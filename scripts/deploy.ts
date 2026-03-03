import hre from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";


async function main() {
  const { ethers } = await hre.network.connect();

  const whitelist = [
    "0x1aDD34b849f5f50C5339525d4320C36a341BD6f8", // mi wallet
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
  ];
  
  const leaves = whitelist.map((addr: string) => keccak256(addr));
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const rootHash = merkleTree.getHexRoot();

  console.log("Construyendo el Arbol de Merkle...");
  console.log("Raiz (Root):", rootHash);

  const WhitelistNFT = await ethers.getContractFactory("WhitelistNFT");
  const nftContract = await WhitelistNFT.deploy(rootHash);
  await nftContract.waitForDeployment();

  const contractAddress = await (nftContract as any).getAddress();
  
  console.log("\n=======================================================");
  console.log(` CONTRATO DESPLEGADO CON ÉXITO EN SEPOLIA`);
  console.log(` DIRECCIÓN: ${contractAddress}`);
  console.log("=======================================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});