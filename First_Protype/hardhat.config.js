require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",

  paths: {
    artifacts: "./Backend/artifacts",
    sources: "./Backend/contracts",
    cache: "./Backend/cache",
    tests: "./Backend/test"
  },

  networks: {
    ganache: {
      url: "http://127.0.0.1:7545"
    }
  }

};

