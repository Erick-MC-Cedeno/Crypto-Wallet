// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract WalletContract {

    uint256 private constant MIN = 10000000000000000; // 0.01 
    address private constant HOT_WALLET = 0x0DEc99cDF5910723887a8320605bEBBD1AA0deE5;

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