// const hre = require("hardhat");

// import hre from "hardhat";
// import fs from "fs";

const fs = require("fs");
const path = require("path");
//  0x5fbdb2315678afecb367f032d93f642f64180aa3;
async function main() {
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  const crowdFunding = await CrowdFunding.deploy();

  await crowdFunding.deployed();

  console.log(`crowdFunding deployed to ${crowdFunding.address}`);

  // WRITE THE NEW ADDRESS TO CONSTANTS
  const constantsPath = path.resolve("Context/contants.js");
  const constantsFile = fs.readFileSync(constantsPath);
  const updatedFile = constantsFile
    .toString()
    .split("\n")
    .map((line) => {
      if (!line.startsWith("export const CrowdFundingAddress")) return line;

      return `export const CrowdFundingAddress = "${crowdFunding.address}"`;
    })
    .join("\n");

  fs.writeFileSync(constantsPath, updatedFile);

  // Copy the new JSON file to Context
  const newCFJson = fs.readFileSync(
    path.resolve("artifacts/contracts/CrowdFunding.sol/CrowdFunding.json")
  );

  fs.writeFileSync(
    path.resolve("Context/CrowdFunding.json"),
    newCFJson.toString()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
