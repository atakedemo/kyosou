import { ethers } from "hardhat";

async function main() {
  const Contest = await ethers.getContractFactory("Contest");
  const contest = await Contest.deploy(
    "0x769Be80e454e8D1C9Ec30Be6c2AC8E92Ec6249B1",
    "0x0fa8781a83e46826621b3bc094ea2a0212e71b23",
    1,
    2,
    3,
    50,
    30,
    20
  );

  await contest.deployed();

  console.log(
    `ETH and unlock timestamp deployed to ${contest.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
