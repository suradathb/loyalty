// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LoyaltyPoints is ERC20 {
    address public admin;

    constructor(address owner) ERC20("LoyaltyPoints", "LP") {
        admin = owner; // ตั้งค่าให้ owner เป็น Admin
    }

    // ฟังก์ชันเพิ่มคะแนนสะสมให้กับผู้ใช้
    function rewardPoints(address to, uint256 amount) external onlyAdmin {
        _mint(to, amount);
    }

    // ฟังก์ชันแลกคะแนนของผู้ใช้
    function redeemPoints(address from, uint256 amount) external onlyAdmin {
        require(balanceOf(from) >= amount, "Insufficient points"); // ตรวจสอบคะแนนคงเหลือ
        _burn(from, amount);
    }

    // ฟังก์ชันแสดงจำนวนคะแนนสะสมของผู้ใช้แต่ละคน
    function getBalance(address account) external view returns (uint256) {
        return balanceOf(account);
    }

    // กำหนดสิทธิ์ให้เฉพาะผู้ดูแลระบบเท่านั้น
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
}
