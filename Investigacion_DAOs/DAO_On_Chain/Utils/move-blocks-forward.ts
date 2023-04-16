//@ts-ignore
import { network } from "hardhat";

export async function moveBlocks(amount: number) {
  console.log("Moving blocks --> ....");
  for (let i = 0; i < amount; i++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
  console.log(".... <-- blocks moved");
}

export async function moveTime(amount: number) {
  console.log("Moving Time  --> ....");
  await network.provider.send("evm_increaseTime", [amount]);
  console.log(`... --> moved forward ${amount} s `);
}
