// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract WhitelistNFT is ERC721 {
    // Aquí guardaremos la "Raíz" de nuestro Árbol de Merkle
    bytes32 public merkleRoot;

    // Llevaremos la cuenta de cuántos NFTs se han minteado
    uint256 private _nextTokenId;

    // Los precios para mintear (en Wei, la unidad más pequeña de Ether)
    uint256 public constant PUBLIC_MINT_PRICE = 0.01 ether;
    uint256 public constant WHITELIST_MINT_PRICE = 0.005 ether;

    // El constructor se ejecuta UNA SOLA VEZ cuando desplegamos el contrato
    constructor(bytes32 _initialMerkleRoot) ERC721("MiPortfolioNFT", "MPN") {
        merkleRoot = _initialMerkleRoot;
    }

    // Función para los usuarios en la Whitelist
    function whitelistMint(bytes32[] calldata proof) public payable {
        // 1. Verificamos que envíe suficiente dinero
        require(msg.value >= WHITELIST_MINT_PRICE, "No has enviado suficiente Ether");

        // 2. Convertimos la dirección del usuario (msg.sender) en una "hoja" del árbol
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));

        // 3. Verificamos la prueba criptográfica contra nuestra Raíz
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Prueba invalida o no estas en la whitelist");

        // 4. Si todo es correcto, le damos el NFT y sumamos 1 al contador
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        
        _safeMint(msg.sender, tokenId);
    }

    // Función para el público general (sin descuento)
    function publicMint() public payable {
        // 1. Verificamos que envíe el dinero del precio público
        require(msg.value >= PUBLIC_MINT_PRICE, "No has enviado suficiente Ether");

        // 2. Le damos el NFT y sumamos 1 al contador
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        
        _safeMint(msg.sender, tokenId);
    }

}