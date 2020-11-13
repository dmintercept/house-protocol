pragma solidity >=0.6.0 <0.7.0;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "./base/HMath.sol";
import {IHPoolFactory} from "./base/IHPoolFactory.sol";
import {IHDealerFactory} from "./base/IHDealerFactory.sol";

contract HDealer is VRFConsumerBase, HMath{
    bytes32  internal keyHash;
    uint256 internal fee;
    address private _feeOwner;

    IHPoolFactory public IPoolF;
    IHDealerFactory public IDealF;
        
    uint256 public randomResult;

    struct game {
            address sender;
            uint choice;
            uint lo;
            uint hi;
            uint randomness;
            bool fulfilled;
    }

    mapping(bytes32 => game) public games;
            /**
            *Constructor inherits VRFConsumerBase
            * 
            * Network: Kovan
            * Chainlink VRF Coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
            * LINK token address:                0xa36085F69e2889c224210F603D836748e7dC0088
            * Key Hash: 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4
            */
            constructor(address poolFactory, address feeOwner) 
            VRFConsumerBase(
            0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
            0xa36085F69e2889c224210F603D836748e7dC0088  // LINK Token
            ) public
            {
            keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
            fee = 0.1 * 10 ** 18; // 0.1 LINK
            _feeOwner = feeOwner;
            IPoolF = IHPoolFactory(poolFactory);
            IDealF = IHDealerFactory(msg.sender);
            }

            /** 
            * Transfer link from user to contract then roll
            */
            function userPaysRoll(uint choice, uint lo, uint hi, address token, uint userProvidedSeed) public{
                    require(LINK.balanceOf(msg.sender)>=fee,"Not enough link - fill with faucet");
                    LINK.transferFrom(msg.sender, address(this), fee);
                    roll(choice, lo, hi, token, userProvidedSeed);
            }
            
            /** 
            * Requests randomness from a user-provided seed paid from contract balance
            */
            function roll(uint choice, uint lo, uint hi, address token, uint256 userProvidedSeed) public returns (bytes32 requestId) {
                     require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
                     require(IPoolF.isPool(token)!=address(0), "Not a valid pool");
                     require( 0 < lo && lo <= choice && choice <= hi, "Invalid Choice");
                     bytes32 requestId = requestRandomness(keyHash, fee, userProvidedSeed);
                     games[requestId] = game(
                             msg.sender,
                             choice,
                             lo,
                             hi,
                             0,
                             false
                             );
            }

            /**
            * Callback function used by VRF Coordinator
            */
            function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
                    games[requestId].randomness = randomness;
                     randomResult = games[requestId].randomness;
            }

}
