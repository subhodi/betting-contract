pragma solidity ^0.4.15; 
import "./lib/oraclizeAPI.sol";

contract Bet is usingOraclize {
    
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
    function Bet(address _bettingAddr) {
        owner = _bettingAddr;
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        
    }

    function placeBet(bytes32 _username, int _amount) public  {
        participants[_username] = _amount;
        usernames.push(_username);
    }

    function getParticipantAmount(bytes32 _username) constant returns(int) {
        return participants[_username];
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

