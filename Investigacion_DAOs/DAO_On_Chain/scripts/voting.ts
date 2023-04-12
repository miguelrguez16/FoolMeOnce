//@ts-ignore
import { ethers } from "hardhat";
import {
  GOVERNOR_CONTRACT,
  ELECTORAL_MANAGER,
  FOR,
  VOTING_PERIOD,
} from "../Utils/helper-constants";
import { readAddressForDeployedContract } from "../Utils/read-address";
import { readLastProposalId } from "../Utils/controllerProposalsId";
import { moveBlocks } from "../Utils/move-blocks-forward";

const voting = async () => {
  const governorContractAddress = await readAddressForDeployedContract(
    GOVERNOR_CONTRACT
  );

  const governorContract = await ethers.getContractAt(
    GOVERNOR_CONTRACT,
    governorContractAddress
  );

  const proposalId: string = await readLastProposalId();
  let proposeToVote: number = parseInt(proposalId);

  const voteTxResponse = await governorContract.castVoteWithReason(
    proposalId,
    FOR, // A FAVOR
    "reasonVote"
  );

  await voteTxResponse.wait(1);

  await moveBlocks(VOTING_PERIOD + 1);

  const stateProposal = await governorContract.state(proposalId);
  console.log(`STATE proposal ${proposalId} is ${stateProposal}`);
};

voting().catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
