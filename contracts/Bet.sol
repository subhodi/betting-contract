pragma solidity ^0.4.15; 
import "./lib/oraclizeAPI.sol";

contract Bet is usingOraclize {
    
    address private owner;
    int internal marketPrice;
    bytes32[3] public winner;
    mapping(bytes32 => int) public participants;
    bytes32[] usernames; 

    event LogMarketPrice(int indexed _marketPrice);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function Bet() {
        owner = msg.sender;
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
    }

     function placeBet(bytes32 _username, int _amount) public  {
        if (participants[_username] == 0) {
            usernames.push(_username);
        }
        participants[_username] = _amount;
    }

    function getParticipantAmount(bytes32 _username) constant returns(int) {
        return participants[_username];
    }
    
    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize_cbAddress()) {
            throw;
        }
        marketPrice = int (parseInt(result));
        LogMarketPrice(marketPrice);
    }
    
    function abs(int n) internal constant returns (int) {
        if (n >= 0) {
            return n;
        }
        return -n;
    }
    
    function resolve()  returns(bytes32[3]) {
       // resolve algorithm
       uint index=0;
       winner[index] = usernames[0];
       int winnerValue = abs(marketPrice - participants[usernames[0]]);
       for (uint i = 1; i < usernames.length; i++) {
               int difference = abs(marketPrice - participants[usernames[i]]);
               if (winnerValue > difference) {
                   index=0;
                   winner[index] = usernames[i];
                   winnerValue = difference;
               }else if(winnerValue == difference && index+1<3) {
                   index++;
                   winner[index] = usernames[i];
               }     
       }
       return winner;
    }
    
    function declare() public {
        oraclize_query("URL", "json(https://api.coindesk.com/v1/bpi/currentprice/inr.json).bpi.INR.rate_float");
    }

    function getOwner() public constant returns(address) {
        return owner;
    }
    
    
}

