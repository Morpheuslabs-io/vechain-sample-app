VeChain Sample Smart Contracts
==============================

## Overview

The sample smart contracts are used to show

1. How to use truffle to compile and deploy smart contracts (to a VeChain Solo node)
2. How to access VeChain smart contracts via web3-gear and Thorify.

You can jump start to build your own smart contracts after you are familiar with the simple smart conracts, truffle and web3-gear provided in the sample prokect.

Note that the sample is to run in CDE (Collaborative Development Environment) of Morpheus Labs BPaaS (Blockchain Platform as a Service). A VeChain stack is provided in the BPaaS which contrains all the software required to run VeChain smart contracts.

You can simply download the "VeChain Smart Contract Sample App" 

## How to run the sample

1. Nevigate to the Application Library, and download "VeChain Smart Contract Sample App" 
2. After downloading successfully, a repo for this sample app is created under "My Repositoty" under "Dashboard"
3. Go to this newly created repository, click on the deploy button and provide a workspace name, e.g. "ve-dapp-sample", then "Ok"
4. A new workspace will be created under the "Dashboard", start the workspace, then CDE will be launched.
5. You can explore the source codes in the CDE and open a "terminal" to invoke commands.
6. From "Blockchain Ops", select a VeChain Solo node that is used for the testing. Click "i" to get the "Internal RPC" URL which is used by web3-gear to connect to the Solo node.
7. Start web3-gear using the Solo node internal URL got the step above.

 `web3-gear --endpoint {url}` 

8. From the terminal, cd to the directory of the application

9. Compile and deploy smart contracts to vechain

 `truffle compile && truffle migrate`

# Run sample to interact with contract from NodeJS
1. Run `npm install`
2. Edit `web3-thorify-example.js` file, looking for network variable and change it to `{url}` of your vechain solo mode (internal URL)
Example: `const network = "http://bops-t.morpheuslabs.io:23275"`
3. Run `node web3-thorify-example.js`
In `web3-thorify-example.js`, There are several function to show how to interact with VeChain from NodeJS includes(sending VET, deploy contract, call contract, send contract transaction)
