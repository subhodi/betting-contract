pragma solidity ^0.4.15; 

import "./Bet.sol";

contract Betting {
    address private owner;
    address public currentBet;
    uint public initialBalance = 0;
    mapping( bytes32 => uint) balance;
    bytes32[] users;
    Bet betContract;
    uint public totalBet = 0;
    
    event LogWinner(address indexed _contractAddress, bytes32 indexed _winner);

    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }
    
    function Betting(uint _initialBalance) public {
        owner = msg.sender;
        initialBalance = _initialBalance;
    }
    
    function newRound() public onlyOwner returns(address) {
        betContract = new Bet();
        currentBet = betContract;
        totalBet = 0;
        return betContract;
    }

    function register(bytes32 _username) public onlyOwner {
        require(balance[_username] == 0);
        balance[_username] = initialBalance;
        users.push(_username);
    }
    
    function getBalance(bytes32 username) public constant returns(uint) {
        return balance[username];
    }
    
    function getLeaderboard() public constant returns(bytes32[], uint[]) {
        bytes32[] memory usernames = new bytes32[](users.length);
        uint[] memory score = new uint[](users.length);
        for (uint i = 0; i<users.length; i++) {
            usernames[i] = users[i];
            score[i] = balance[users[i]];
        }
        return (usernames, score);
    }
    
    // Betting functions
    function placeBet(bytes32 _username, int _amount, uint _coinsSpent) public {
        // require(_amount > 0 && _coinsSpent > 0 && balance[_username] - _coinsSpent >= 0);
        balance[_username] -= _coinsSpent;
        totalBet += _coinsSpent;
        betContract.placeBet(_username, _amount);
    }
    
    function declare() {
        betContract.declare();
    }

    function resolve() {
      bytes32  winner = betContract.resolve();
      balance[winner] = balance[winner] + totalBet;
      totalBet = 0;
      LogWinner(currentBet, winner);
    }


}

