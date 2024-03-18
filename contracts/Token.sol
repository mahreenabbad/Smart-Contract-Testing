// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Token{
    string public name="Cricket";
    string public symbol="CKT";
    uint public totalSupply =1000;

    address public owner;

    mapping (address => uint) balances;
    constructor(){
        owner= msg.sender;
        balances[owner]=totalSupply;
    }
    function transfer(address to,uint amount) external{
        require(amount>0,"amount should be greater than zero");
        require(balances[msg.sender]>=amount,"u don't have enough balance");
        balances[msg.sender]-=amount;
        balances[to]+=amount;
    }
    function balanceOf(address account)public view returns(uint){
        return balances[account];
    }
}

