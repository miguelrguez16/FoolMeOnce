import { deployElectoralToken } from "../deploy/01_deploy_electoralToken";
import { deployTimeLock } from "../deploy/02_deploy_timeLock";
import { deployGovernorContract } from "../deploy/03_deploy_governorContract";
import { configureGovernorContract } from "../deploy/04_configure_governorContract";
import { deployElectoralManagerAccount } from "../deploy/05_deploy_electoralManager";

export const DeployDAO = async () => {
  await deployElectoralToken();
  await deployTimeLock();
  await deployGovernorContract();
  await configureGovernorContract();
  await deployElectoralManagerAccount();
};

DeployDAO().catch((error) => {
  console.error(error);
  //@ts-ignore
  process.exitCode = 1;
});
