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
    function placeBet(bytes32 _username, int _amount, uint _coinsSpent) public onlyOwner {
        require(_amount > 0 && _coinsSpent > 0 && balance[_username] - _coinsSpent >= 0);
        balance[_username] -= _coinsSpent;
        betContract.placeBet(_username, _amount);
    }
    
    function declare() onlyOwner payable {
        betContract.declare();
    }

}

contract BetContract is usingOraclize {
    
    address private owner;
    int internal marketPrice;
    bytes32 public winner;
    mapping(bytes32 => int) public participants;
    bytes32[] usernames;
    
    event LogWinner(address indexed _contractAddress, bytes32 indexed _winner);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    function BetContract(address _bettingAddr) {
        owner = _bettingAddr;
        
    }

    function placeBet(bytes32 _username, int _amount) public onlyOwner {
        participants[_username] = _amount;
        usernames.push(_username);
    }
    
    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize_cbAddress()) throw;
        marketPrice = int (parseInt(result));
        resolve(marketPrice);
    }
    
    function abs(int n) internal constant returns (int) {
        if(n >= 0) return n;
        return -n;
    }
    
    function resolve(int _marketPrice) internal {
       // resolve algorithm
       winner = usernames[0];
       int winnerValue = abs(_marketPrice - participants[usernames[0]]);
       for(uint i=1; i < usernames.length; i++) {
               int difference = abs(_marketPrice - participants[usernames[i]]);
               if(winnerValue > difference) {
                   winner = usernames[i];
                   winnerValue = difference;
               }          
       }
       LogWinner(this, winner);
    }
    
    function declare() public onlyOwner payable {
        oraclize_query("URL", "json(https://api.coindesk.com/v1/bpi/currentprice/inr.json).bpi.INR.rate_float",5000000);
    }
    
    
}
