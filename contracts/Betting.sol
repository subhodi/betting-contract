pragma solidity ^0.4.15; 

contract Betting {
    
    address private owner;
    uint public initialBalance = 0;
    mapping( bytes32 => uint) balance;
    
    modifier onlyOwner() {
        require( owner == msg.sender);
        _;
    }
    
    modifier notExist(bytes32 _username) {
        require( balance[_username] == 0);
        _;
    }
    
    function Betting(uint _initialBalance) public {
        owner = msg.sender;
        initialBalance = _initialBalance;
    }
    
    function register(bytes32 _username) public onlyOwner notExist(_username) {
        balance[_username] = initialBalance;
    }
    
    function getBalance(bytes32 username) public constant returns(uint) {
        return balance[username];
    }
    
    function getLeaderboard(bytes32 _username) public constant returns(bytes32[5], uint[5]) {
        bytes32[5] memory usernames;
        uint[5] memory score;
        usernames = [bytes32('user1'),bytes32('user2'),bytes32('user3'),bytes32('user4'), _username];
        score = [uint(170), uint(130), uint(110), uint(90), uint(30)];
        return (usernames, score);
    }
    
    function placeBet(bytes32 _username, uint _amount) public {
        balance[_username] -= _amount;
    }
    
    
}
