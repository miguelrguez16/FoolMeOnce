// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

library DataInfo {
    /****************************
     *      DATA STRUCTURES
     ****************************/

    ///@dev Basic info of a electoral promise
    struct DataPromise {
        uint256 id;
        uint256 created; // timestamp
        uint256 dateApproved; // timestamp date approved
        uint256 idAuthor;
        bool isObligatory;
        string tokenUri;
        string nameAuthor;
        string namePoliticalParty;
    }

    ///@dev basic info for a person or a political party
    struct Promiser {
        uint256 idAuthor;
        bool isPoliticalParty;
        string completeName;
        string namePoliticalParty;
    }
}
