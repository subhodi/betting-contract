pragma solidity ^0.4.15; 

contract Bet {
    
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
    
    
    
}
