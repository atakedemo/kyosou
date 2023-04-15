// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20KVT} from "./interfaces/IERC20KVT.sol";

contract Contest {
    struct ProposalCore {
        address proposer;
        bool executed;
        bool canceled;
        uint64 points;
        uint256 balance;
    }

    address _prize;
    uint64 _1stPrize;
    uint64 _2ndPrize;
    uint64 _3rdPrize;
    uint64 _1stPrizeRatio;
    uint64 _2ndPrizeRatio;
    uint64 _3rdPrizeRatio;
    uint64 _voteStart;
    uint64 _voteEnd;
    uint256 _snapshotId;

    IERC20KVT _tokenKVT;
    IERC1155 _tokenNft;

    address _adminAddress;
    address _rewardAddress;

    mapping(uint256 => ProposalCore) public _proposals;

    //ToDO: 最後に実装
    constructor(
        address prize,
        address reward,
        uint64 first,
        uint64 second,
        uint64 third,
        uint64 firstRatio,
        uint64 secondRatio,
        uint64 thirdRatio,
        uint64 voteStart,
        uint64 voteEnd
    ) payable {
        _prize = prize;
        _1stPrize = first;
        _2ndPrize = second;
        _3rdPrize = third;
        _1stPrizeRatio = firstRatio;
        _2ndPrizeRatio = secondRatio;
        _3rdPrizeRatio = thirdRatio;
        _snapshotId = 0;

        _proposals[0] = ProposalCore({
            proposer: msg.sender,
            executed: false,
            canceled: false,
            points: 0,
            balance: 0
        });

        _voteStart = voteStart;
        _voteEnd = voteEnd;

        _adminAddress = msg.sender;
        _rewardAddress = reward;
    }

    function configureIERC20(
        address contractAddress
    ) external {
        require(_adminAddress == msg.sender);
        _tokenKVT = IERC20KVT(contractAddress);
    }

    function configureIERC1155(
        address contractAddress
    ) external {
        require(_adminAddress == msg.sender);
        _tokenNft = IERC1155(contractAddress);
    }

    function vote(
        uint256 proposalId,
        uint256 balanceProposal,
        uint256 balanceAll
    ) public {
        //ToDo: 投票期限であるかの制御

        //ガバナンストークンを送る
        address to = _proposals[proposalId].proposer;
        _tokenKVT.transferFrom(msg.sender, to, 1000000000);

        //投げ銭を加算(to 作品 or 全体)
        ProposalCore storage proposal = _proposals[proposalId];
        uint256 tmpBlance = proposal.balance;
        tmpBlance = tmpBlance+ balanceProposal;
        _proposals[proposalId].balance = tmpBlance;
        _proposals[0].balance = _proposals[0].balance + balanceAll;
    }

    function propose(
        string memory description
    ) public virtual returns (uint256) {
        address proposer = msg.sender;
        //proposalIdの設定
        uint256 proposalId = hashProposal(proposer, keccak256(bytes(description)));

        _proposals[proposalId] = ProposalCore({
            proposer: proposer,
            executed: false,
            canceled: false,
            points: 0,
            balance: 0
        });

        /* ToDo: 余力あれば
        emit ProposalCreated(
            proposalId,
            proposer
        );
        */

        return proposalId;
    }

    function execute (
        uint256 snapshotId
    )public virtual {
        require(_adminAddress == msg.sender);
        _snapshotId = snapshotId;
    }

    function withdraw(
        uint256 proposalId
    )public virtual {
        //スナップショットIDからそうトークン数を取得(ガバナンストークンから読み取り処理)
        uint256 tmpTotalSupply = _tokenKVT.totalSupplyAt(_snapshotId);
        uint256 tmpBalance;
        uint256 reward;

        require(_snapshotId != 0);
        require(!_proposals[proposalId].executed);
        require(_proposals[proposalId].proposer == msg.sender);
        tmpBalance = _tokenKVT.balanceOfAt(_proposals[proposalId].proposer, _snapshotId);
        reward = _proposals[proposalId].balance + _proposals[0].balance * tmpBalance / tmpTotalSupply - 1;
        IERC20(_rewardAddress).transfer(_proposals[proposalId].proposer, reward);
        _proposals[proposalId].executed = true;
    }

    function hashProposal(
        address proposer,
        bytes32 descriptionHash
    ) public returns (uint256) {
        return uint256(keccak256(abi.encode(proposer, descriptionHash)));
    }
}
