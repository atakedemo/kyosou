
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC20KVT is IERC20 {
    function totalSupplyAt(uint256 snapshotId) external view returns (uint256);
    function balanceOfAt(address account, uint256 snapshotId) external view returns (uint256);

}