// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


contract Fraxtoken {
    IERC20 public immutable FRAX;
    IERC20 public immutable USD;
    IERC20 public immutable FXS;

   

    mapping (address => uint) public mintamt;
    mapping (address => uint256) public colatamt;
    mapping (address => uint) public totfxs;
    
   
    uint public exgrate;
    uint public latexchngrate;
    uint public totalmint;
    uint public totalcollat;
    uint public totalfxs;
    uint public colat_;
    uint public redeemamt;
    uint public collatratio=100;
    address public owner;
    
    AggregatorV3Interface internal priceFeed;
    
    

    constructor(address _FRAX, address _USD,address _FXS) {
        
        FRAX = IERC20( _FRAX);
        USD = IERC20(_USD);
        FXS = IERC20(_FXS);
        priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
        owner = msg.sender;
        //event FRAX.burn(address indexed _from , uint indexed _value );
    }

   

    function Mintfrax(uint colat) public{
        require(colat > 0, "colat = 0");
        colat_ = colat;
        USD.transferFrom(msg.sender, address(this), (colat*1000000000000000000*collatratio)/100);
        FXS.burn(address(this),(colat*1000000000000000000*(100-collatratio)/100));
        // emit burn(address(this),(colat*1000000000000000000*(100-collatratio)/100));
        totalfxs -= colat*1000000000000000000*(100-collatratio)/100;
        colatamt[msg.sender] += (colat*1000000000000000000*collatratio)/100;
        FRAX.mint(colat*1000000000000000000);
        FRAX.transfer(msg.sender,colat*1000000000000000000);
        mintamt[msg.sender] += colat;
        totfxs[msg.sender] += (colat*1000000000000000000*(100-collatratio))/100;
        totalmint += colat;
        totalcollat += (colat*1000000000000000000*collatratio)/100;
    }


    function Redeem() public{
        uint256 usdbalanceC = USD.balanceOf(address(this));
        require(usdbalanceC > 0 ,"no amount");
        USD.transfer(msg.sender,colatamt[msg.sender]);
        FRAX.burn(msg.sender,mintamt[msg.sender]*1000000000000000000);
        
        FXS.mint(totfxs[msg.sender]);
        FXS.transferFrom(msg.sender,address(this),totfxs[msg.sender]);
        totalfxs += totfxs[msg.sender];
        totfxs[msg.sender] -= totfxs[msg.sender];
        totalmint -= mintamt[msg.sender];
        totalcollat -= colatamt[msg.sender];
        colatamt[msg.sender] -= colatamt[msg.sender];
        mintamt[msg.sender] -= mintamt[msg.sender];
        
    }


    modifier onlyOwner {
      require(msg.sender == owner);
      _;
   }


   function recollateralise(uint _swapusd) public{
       require(totalcollat < (totalmint*1000000000000000000*collatratio)/100 , "Already recollateralized !!!");
       USD.transferFrom(msg.sender,address(this),_swapusd*1000000000000000000);
       latexchngrate= uint(getLatestPrice());
       FXS.transfer(msg.sender,(latexchngrate*1000000000000000000*_swapusd)/1e8);
       FXS.mint((_swapusd*1000000000000000000*1/2)/100);
       FXS.transfer(msg.sender,(_swapusd*1000000000000000000*1/2)/100);
       totalcollat += _swapusd*1000000000000000000;
   }

    function buyback(uint _swapusd1) public{
       require(totalcollat > (totalmint*1000000000000000000*collatratio)/100 , "corectly balanced !!!");
       if(_swapusd1 <= (totalcollat -(totalmint*1000000000000000000*collatratio)/100))
       USD.transferFrom(address(this),(msg.sender),_swapusd1*1000000000000000000);
       latexchngrate= uint(getLatestPrice());
       FXS.transferFrom(msg.sender,address(this),(latexchngrate*1000000000000000000*_swapusd1)/1e8);
       totalcollat -= _swapusd1*1000000000000000000;
   }




    


     function Collatratio() public{
             if(getLatestPrice() >= 1e8){
             collatratio = collatratio-2;
         }
         else{
             require(collatratio <= 98, "limit exceeded");
             collatratio += 2;
         }
             
     }

   
      function getLatestPrice() public view returns (int) {
        (
            uint80 roundID,
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }


    function fxsmigration() public  onlyOwner {
          FXS.transferFrom(msg.sender, address(this),10000000000000000000);
          totalfxs += 10000000000000000000;
    }
    
    function fxs_faucet() public {
        FXS.mint(2000000000000000000);
        FXS.transferFrom(msg.sender, address(this),20000000000000000000);
    }

}


interface IERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function mint(uint total) external;

    function burn(address burner, uint amt) external;

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}


interface AggregatorV3Interface {
    function latestRoundData()
    external
    view
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    );

}

