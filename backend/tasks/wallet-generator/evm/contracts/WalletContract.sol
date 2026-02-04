// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

contract WalletContract {

    uint256 private constant MIN = 10000000000000000; // 0.01 
    address private constant HOT_WALLET = 0x086B3870F2aCb3403193482a157777EC58A637cE;

    event DepositedOnMetaDapp();

    function forward() private {
        if(msg.value >= MIN){
            (bool success, ) = payable(HOT_WALLET).call{value: address(this).balance}("");
            require(success);
            emit DepositedOnMetaDapp();
        }
    }

    receive() external payable { forward();}
    fallback() external payable { forward();}
}