'use strict'
const Web3 = require('web3')
const thorify = require('thorify').thorify
// https://github.com/vechain/thor-devkit.js
// const { cry, Transaction } = require('thor-devkit')
const network = "http://127.0.0.1:8669"
const web3 = thorify(new Web3(), network);

/**
 * The following samples scenarios are included
 * 
 * 1. VET transfer
 * 2. Smart contract deployment
 * 3. Call smart contract functions
 * 4. Smart contract transactions
 * 5. Sign transactions
 * 
 */

// web3.eth.getBlock("latest").then(res => console.log(res));


async function SimpleExamples() {
    // 1. VET transfer
    await VETTransfer()

    // 2. Smart contract deployment
    let address = await DeployContract()

    // 3. Call smart contract functions
    await ContractCall(address)

    // 4. Smart contract transactions
    await ContractTransaction(address)

    // 5. Sign transactions, this functions is not available yet
    // await SignWithOutPrivateKey()
}

async function VETTransfer() {
    
    // Account setup
    let sender = {
        address: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        privateKey: '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65'
    }
    web3.eth.accounts.wallet.add(sender.privateKey)

    let receiver = '0xd3ae78222beadb038203be21ed5ce7c9b1bff602'
    console.log("Transfer VET to ", receiver)

    return web3.eth.sendTransaction({
        from: sender.address,
        to: receiver,
        value: web3.utils.toWei('1', 'ether')
    }).then(receipt => {
        console.log(receipt)

    })
}


async function DeployContract() {
    // Setup account，this is one time work
    console.log("Deploy new contract to network")
    let sender = {
        address: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        privateKey: '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65'
    }
    // web3.eth.accounts.wallet.add(sender.privateKey)
    
    // Get smart contract ABI and Bytecode
    let KVStorage = require('./build/contracts/KVStorage.json')

    let contract = new web3.eth.Contract(KVStorage.abi)

    return contract.deploy({data: KVStorage.bytecode, arguments: ["test-contract-1"]})
    .send({ from: sender.address, gas: 3000000 })
    .then(receipt => {
        console.log("Contract deployed address", receipt['_address'])
        // Return smart contract address
        return receipt['_address']
    })
}


async function ContractCall(address) {
    // Setup account，this is one time work
    console.log("Contract call contract address:", address)
    let sender = {
        address: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        privateKey: '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65'
    }
    // web3.eth.accounts.wallet.add(sender.privateKey)

    // Get smart contract ABI and Bytecode
    let KVStorage = require('./build/contracts/KVStorage.json')

    let contract = new web3.eth.Contract(KVStorage.abi, address)

    return contract.methods.namespace().call({ from: sender.address })
    .then(namespace => {
        console.log('namespace:', namespace)
    })
}


async function ContractTransaction(address) {
    // Setup account，this is one time work
    console.log("Contract set data, contract address: ", address)
    let sender = {
        address: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        privateKey: '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65'
    }
    // web3.eth.accounts.wallet.add(sender.privateKey)

    // Get smart contract ABI and Bytecode
    let KVStorage = require('./build/contracts/KVStorage.json')

    let contract = new web3.eth.Contract(KVStorage.abi, address)

    let key = "0x496699b551fae009387328298b517b0b8be1c99f42d31ef2793ffcee5a7a316b"
    let value = "0x4de71f2d588aa8a1ea00fe8312d92966da424d9939a511fc0be81e65fad52af8"

    // Setup KV storage
    return contract.methods.set(key, value)
    .send({ from: sender.address, gas: 500000 })
    .then(receipt => {
        console.log('receipt:', receipt)
    })
}


// Private key in an external environment
async function SignWithOutPrivateKey() {
    // This will demo
    // 1. How to generate messageHash
    // 2. Use external signing toll to generate RawTransaction

    let clauses =  [{
        to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        value: web3.utils.toWei('1', 'ether'),
        data: '0x'
    }]

    let chainTag = await web3.eth.getChainTag()
    let blockRef = await web3.eth.getBlockRef()
    
    let txBody = {
        chainTag: chainTag,
        blockRef: blockRef,
        expiration: 32,
        clauses: clauses,
        gasPriceCoef: 0,
        gas: 21000,
        dependsOn: null,
        nonce: +new Date()
    }
    
    let tx = new Transaction(txBody)
    let messageHash = cry.blake2b256(tx.encode()) // Buffer

    // Use external tool to sign messageHash
    let signature = SignTx(messageHash)

    // Set transaction signature，this requires signature as Buffer type
    tx.signature = signature

    // Transactions signed by be queried by signer and txId
    // let txId = tx.id
    // let signer = tx.signer

    let rawTx = tx.encode() // Buffer
    return '0x' + rawTx.toString('hex')
}
SimpleExamples();
