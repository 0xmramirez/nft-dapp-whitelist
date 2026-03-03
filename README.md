# Merkle Tree NFT Whitelist DApp

Una aplicación descentralizada (DApp) Full-Stack para el minteo de NFTs (ERC-721) desplegada en la red pública de **Sepolia**. Este proyecto implementa un sistema de *Whitelist* altamente seguro y optimizado en *gas* mediante criptografía de **Árboles de Merkle**.

🔗 **[Ver Contrato en Etherscan](PON_AQUI_TU_ENLACE_A_ETHERSCAN)**
🔗 **[Ver Web en Vivo](PON_AQUI_TU_ENLACE_DE_VERCEL_CUANDO_LO_TENGAS)**

## Arquitectura y Tecnologías

**Backend (Smart Contracts):**
* **Solidity (^0.8.20):** Lenguaje principal del contrato.
* **Hardhat:** Entorno de desarrollo, testing y despliegue.
* **OpenZeppelin:** Estándares de seguridad probados en la industria (`ERC721`).
* **MerkleTree.js & Keccak256:** Generación de raíces y pruebas criptográficas.

**Frontend (Web3):**
* **Next.js & React:** Framework para la interfaz de usuario.
* **Wagmi & Viem:** Hooks de React para interactuar con la blockchain.
* **RainbowKit:** Gestión de conexión de wallets profesionales.
* **Tailwind CSS:** Estilos rápidos y modernos.

## El Problema que Resuelve: Optimización de Gas

En lugar de almacenar un array gigante de direcciones permitidas en el Smart Contract (lo cual costaría miles de dólares en *gas* al desplegar en Ethereum Mainnet), este proyecto utiliza un Árbol de Merkle:

1. El frontend calcula el árbol y el contrato solo guarda la **Raíz (Merkle Root)** en la blockchain (32 bytes).
2. Cuando un usuario quiere mintear, el frontend genera una **Prueba Criptográfica (Merkle Proof)**.
3. El contrato verifica matemáticamente la prueba contra la raíz. Si coincide, el usuario está autorizado. ¡Coste de almacenamiento en la blockchain casi cero!

## Funciones de Seguridad Incluidas
* `owner`: El contrato registra al creador mediante `msg.sender`.
* `withdraw()`: Función protegida para que solo el creador pueda retirar los fondos acumulados en el contrato.
* Validación estricta de `msg.value` para asegurar el pago exacto del NFT.

## Cómo ejecutar en local

\`\`\`bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/TU_REPOSITORIO.git
cd TU_REPOSITORIO

# 2. Instalar dependencias del frontend
cd frontend
npm install

# 3. Arrancar el servidor de desarrollo
npm run dev
\`\`\`
Visita `http://localhost:3000` y conecta tu wallet en la red Sepolia.
