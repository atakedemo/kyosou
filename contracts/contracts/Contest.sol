// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20KVT} from "./interfaces/IERC20KVT.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Contest {
    struct ProposalCore {
        address proposer;
        bool executed;
        bool canceled;
        uint256 points;
        uint256 balance;
    }

    address public _prize;
    uint256 public _1stPrize;
    uint256 public _2ndPrize;
    uint256 public _3rdPrize;
    uint256 public _1stPrizeRatio;
    uint256 public _2ndPrizeRatio;
    uint256 public _3rdPrizeRatio;
    uint256 _voteStart;
    uint256 _voteEnd;
    uint256 public _currentSnapshotId;

    IERC20KVT _tokenKVT;
    IERC1155 _tokenNft;

    address _adminAddress;
    address _erc20KVT;
    address _rewardAddress;

    mapping(uint256 => ProposalCore) public _proposals;

    event ProposalCreated( address proposer, uint256 proposalId);
    event setConfiture(bytes data);

    //ToDO: 最後に実装
    constructor(
        address prize,
        address reward,
        uint256 first,
        uint256 second,
        uint256 third,
        uint256 firstRatio,
        uint256 secondRatio,
        uint256 thirdRatio
    ) payable {
        _prize = prize;
        _1stPrize = first;
        _2ndPrize = second;
        _3rdPrize = third;
        _1stPrizeRatio = firstRatio;
        _2ndPrizeRatio = secondRatio;
        _3rdPrizeRatio = thirdRatio;
        _currentSnapshotId = 0;

        _proposals[0] = ProposalCore({
            proposer: msg.sender,
            executed: false,
            canceled: false,
            points: 0,
            balance: 0
        });

        //_voteStart = voteStart;
        //_voteEnd = voteEnd;

        _adminAddress = msg.sender;
        _rewardAddress = reward;
    }

    function setIERC20(
        address contractAddress
    ) external {
        require(_adminAddress == msg.sender);
        _tokenKVT = IERC20KVT(contractAddress);
        _erc20KVT = contractAddress;
        emit setConfiture(msg.data);
    }

    function setIERC1155(
        address contractAddress
    ) external {
        require(_adminAddress == msg.sender);
        _tokenNft = IERC1155(contractAddress);
        emit setConfiture(msg.data);
    }

    function setRewardAddress(
        address contractAddress
    ) external {
        require(_adminAddress == msg.sender);
        _rewardAddress = contractAddress;
        emit setConfiture(msg.data);
    }

    function stakeReward (
        uint256 amount
    ) external {
        require(_adminAddress == msg.sender);
        _tokenKVT.transferFrom(msg.sender, _erc20KVT, amount);
        _proposals[0].balance = amount;
        emit setConfiture(msg.data);
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

        emit ProposalCreated(proposer,proposalId);
        return proposalId;
    }

    function execute (
        uint256 snapshotId
    )public virtual {
        require(_adminAddress == msg.sender);
        _currentSnapshotId = snapshotId;
    }

    function withdraw(
        uint256 proposalId
    )public virtual {
        //スナップショットIDから合計トークン数を取得(ガバナンストークンから読み取り処理)
        uint256 tmpTotalSupply = _tokenKVT.totalSupplyAt(_currentSnapshotId);
        uint256 tmpBalance;
        uint256 reward;

        require(_currentSnapshotId != 0);
        require(!_proposals[proposalId].executed);
        require(_proposals[proposalId].proposer == msg.sender);
        tmpBalance = _tokenKVT.balanceOfAt(_proposals[proposalId].proposer, _currentSnapshotId);
        reward = _proposals[proposalId].balance + _proposals[0].balance * tmpBalance / tmpTotalSupply - 1;
        IERC20(_rewardAddress).transferFrom(_erc20KVT ,_proposals[proposalId].proposer, reward);
        _proposals[proposalId].executed = true;
    }

    function hashProposal(
        address proposer,
        bytes32 descriptionHash
    ) public returns (uint256) {
        return uint256(keccak256(abi.encode(proposer, descriptionHash)));
    }
}
