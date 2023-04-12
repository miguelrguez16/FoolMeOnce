/**
 * BASIC CONSTANTS FOR CONFIGURATION
 */
// BACKUP ADDRESS
export const JSON_FILE_DEPLOYMENT_ADDRESS: string = "DeploymentAddress.json";
export const JSON_FILE_PROPOSALS_ID: string = "Proposals.json";

export const ELECTORAL_TOKEN: string = "ElectoralToken";
export const TIME_LOCK: string = "TimeLock";
export const GOVERNOR_CONTRACT: string = "GovernorContract";
export const ELECTORAL_MANAGER: string = "ElectoralManager";

// TIME LOCK
export const MIN_DELAY: number = 3600; // 1 hour in seconds

// GOVERNOR CONTRACT
export const VOTING_DELAY: number = 1;
export const VOTING_PERIOD: number = 5;
export const QUORUM_PERCENTAGE: number = 4;
export const PROPOSAL_THRESHOLD: number = 0;

// BASIC CONFIGURATION ROLES

//      ZERO ADDRESS
export const DEFAULT_ADDRESS: string =
  "0x0000000000000000000000000000000000000000";

// EXECUTION

export const FUNC_REGISTER_USER: string = "registerUser";
export const FUNC_CREATE_NEW_PROMISE: string = "createElectoralPromise";
export const FUNC_APPROVE_PROMISE: string = "approvePromise";

// VOTING

export const AGAINST: number = 0;
export const FOR: number = 1;
export const ABSTAIN: number = 2;
