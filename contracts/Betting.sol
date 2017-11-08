pragma solidity ^0.4.15; 
import "./lib/oraclizeAPI.sol";

contract Betting {
    
    address private owner;
    address public currentBet;
    uint public initialBalance = 0;
    mapping( bytes32 => uint) balance;
    bytes32[] users;
    BetContract betContract;
    
    modifier onlyOwner() {
        require( owner == msg.sender);
        _;
    }
    
    function Betting(uint _initialBalance) public {
        owner = msg.sender;
        initialBalance = _initialBalance;
    }
    
    function newRound(address _addr) public onlyOwner {
        currentBet = _addr;
        betContract = BetContract(_addr);
    }
    
    function register(bytes32 _username) public onlyOwner {
        require( balance[_username] == 0);
        balance[_username] = initialBalance;
        users.push(_username);
        
    }
    
    function getBalance(bytes32 username) public constant returns(uint) {
        return balance[username];
    }
    
    function getLeaderboard() public constant returns(bytes32[], uint[]) {
        bytes32[]  memory usernames =  new bytes32[](users.length);
        uint[]  memory score =  new uint[](users.length);
        for(uint i=0;i<users.length;i++) {
            usernames[i]=users[i];
            score[i] = balance[users[i]];
        }
        return (usernames, score);
    }
    
    // Betting functions
    function placeBet(bytes32 _username, uint _amount, uint _coinsSpent) public onlyOwner {
        require(_amount > 0 && _coinsSpent > 0 && balance[_username] - _coinsSpent >= 0);
        balance[_username] -= _coinsSpent;
        betContract.placeBet(_username, _amount);
    }
    
    function declare() onlyOwner {
        betContract.declare();
    }

}

contract BetContract is usingOraclize {
    
    address private owner;
    uint internal marketPrice;
    bytes32 public winner;
    mapping(bytes32 => uint) internal participants;
    
    event LogWinner(address contractAddress, bytes32 winner);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    function BetContract() {
        owner = msg.sender;
    }

    function placeBet(bytes32 _username, uint _amount) public onlyOwner {
        participants[_username] = _amount;
    }
    
    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize_cbAddress()) throw;
        marketPrice = parseInt(result);
        resolve(marketPrice);
    }
    
    function resolve(uint _marketPrice) internal {
        
        // resolve algorithm
        winner = "winner-username";
        LogWinner(this, "winner-username");
    }
    
    function declare() public onlyOwner {
        oraclize_query("URL", "json(https://api.coindesk.com/v1/bpi/currentprice/inr.json).bpi.INR.rate_float");
    }
    
    
}
