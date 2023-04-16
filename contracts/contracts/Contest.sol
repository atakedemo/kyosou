// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Contest {
    struct ProposalCore {
        address proposer;
        string discription;
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

    IERC1155 _tokenNft;

    address _adminAddress;
    address _erc20KVT;
    uint256[] proposalIds;
    uint256 totalSupply = 0;

    mapping(uint256 => ProposalCore) public _proposals;

    event ProposalCreated( address proposer, uint256 proposalId);
    event setConfiture(bytes data);

    //ToDO: 最後に実装
    constructor(
        address prize,
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
            discription: "",
            points: 0,
            balance: 0
        });

        //_voteStart = voteStart;
        //_voteEnd = voteEnd;

        _adminAddress = msg.sender;
    }

    function setIERC1155(
        address contractAddress
    ) external {
        require(_adminAddress == msg.sender);
        _tokenNft = IERC1155(contractAddress);
        emit setConfiture(msg.data);
    }

    function stakeReward () external payable{
        require(_adminAddress == msg.sender);
        _proposals[0].balance = msg.value;
        emit setConfiture(msg.data);
    }

    function vote (
        uint256 proposalId,
        uint256 balanceProposal,
        uint256 balanceAll
    ) public payable {
        //ToDo: 諸々の制御を加える
        //require() 投票期限である
        //require() NFT所有などの条件を満たしている

        ProposalCore storage proposal = _proposals[proposalId];
        //ポイントを加算する
        uint256 prePoint = proposal.points;
        _proposals[proposalId].points = prePoint + 1;
        _proposals[0].points =  _proposals[0].points + 1;

        //投げ銭を受け取る＆加算(to 作品 or 全体)
        require(balanceAll + balanceProposal < msg.value);
        uint256 tmpBlance = proposal.balance;
        tmpBlance = tmpBlance + balanceProposal;
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
            discription: description,
            points: 0,
            balance: 0
        });

        proposalIds.push(proposalId);

        emit ProposalCreated(proposer,proposalId);
        return proposalId;
    }

    function execute () public virtual {
        require(_adminAddress == msg.sender);
        totalSupply = _proposals[0].balance;
    }

    function withdraw(
        uint256 proposalId
    )public virtual {
        //スナップショットIDから合計トークン数を取得(ガバナンストークンから読み取り処理)
        uint256 tmpBalance;
        uint256 reward;

        require(_currentSnapshotId != 0);
        require(!_proposals[proposalId].executed);
        require(_proposals[proposalId].proposer == msg.sender);
        reward = _proposals[proposalId].balance + totalSupply * _proposals[proposalId].points / _proposals[0].points - 1;
        address proposer = _proposals[proposalId].proposer;
        payable(proposer).transfer(reward);
        _proposals[proposalId].executed = true;
    }

    function hashProposal(
        address proposer,
        bytes32 descriptionHash
    ) public returns (uint256) {
        return uint256(keccak256(abi.encode(proposer, descriptionHash)));
    }
}
