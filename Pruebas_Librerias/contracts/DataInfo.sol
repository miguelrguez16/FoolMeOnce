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
        uint256 dateApproved;
        uint256 idAuthor;
        bool isObligatory;
        bool isApproved;
        string tokenUri;
        string nameAuthor;
    }

    ///@dev basic info for a person or a political party
    struct Promiser {
        uint256 idAuthor;
        string completeName;
        bool isPoliticalParty;
    }
}
