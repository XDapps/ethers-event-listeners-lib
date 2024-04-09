# Ethereum Event Listeners for ERC-20, ERC-721, & ERC-1155 transfer events

This is a basic wrapper around Ethers.js with static methods for listening to transfer events on ERC-20, ERC-721, or ERC-1155 contracts. This was created as a basic example to demonstrate how to listen to events and take action in real time.

## Basics

1. Import the protocol you want to interact with.
2. Instantiate listeners with an array of contract address and an Ethers provider.
3. Start the listeners and pass in a callback function to be executed upon each transfer event found.

### How To Use

```js
npm install @xdapps/ethers-event-listeners-lib
or
yarn add @xdapps/ethers-event-listeners-lib
```

```js
import {ERC20TransferListeners, ERC20TransferEvent} from "@xdapps/ethers-event-listeners-lib";

const listOfERC20Contracts = ["0x.....", "0x...."]; // List of contracts to listen to
const provider = new ethers.providers.JsonRpcProvider("RPC_URL_ADDRESS");

const callBackForTransferEvent = (eventData: ERC20TransferEvent){
// Your code to handle the transfer event goes here.....
//......
//......
}
const listeners = ERC20TransferListeners.getInstance(listOfERC20Contracts, provider);
await listeners.start(callBackForTransferEvent);

```
