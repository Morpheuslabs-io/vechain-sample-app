'use strict'
const Web3 = require('web3')
const thorify = require('thorify').thorify
// https://github.com/vechain/thor-devkit.js
// const { cry, Transaction } = require('thor-devkit')
const network = "http://127.0.0.1:8669"
const web3 = thorify(new Web3(), network);

/**
 * 本文件涉及的演示场景如下：
 * 
 * 1. VET转账
 * 2. 合约部署
 * 3. 合约调用
 * 4. 合约交易
 * 5. 使用外部签名工具签名交易
 * 
 */

// web3.eth.getBlock("latest").then(res => console.log(res));


async function SimpleExamples() {
    // 1. VET转账
    await VETTransfer()

    // 2. 合约部署
    let address = await DeployContract()

    // 3. 合约调用
    await ContractCall(address)

    // 4. 合约交易
    await ContractTransaction(address)

    // 5. 使用外部签名工具签名交易，这个方法暂时无法执行
    // await SignWithOutPrivateKey()
}

async function VETTransfer() {
    
    // 导入账户
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
    // 导入账号，VETTransfer中以导入这里就不再重复操作了
    console.log("Deploy new contract to network")
    let sender = {
        address: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        privateKey: '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65'
    }
    // web3.eth.accounts.wallet.add(sender.privateKey)
    
    // 获取合约ABI和Bytecode
    let KVStorage = require('./build/contracts/KVStorage.json')

    let contract = new web3.eth.Contract(KVStorage.abi)

    return contract.deploy({data: KVStorage.bytecode, arguments: ["test-contract-1"]})
    .send({ from: sender.address, gas: 3000000 })
    .then(receipt => {
        console.log("Contract deployed address", receipt['_address'])
        // 返回合约地址
        return receipt['_address']
    })
}


async function ContractCall(address) {
    // 导入账号，VETTransfer中以导入这里就不再重复操作了
    console.log("Contract call contract address:", address)
    let sender = {
        address: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        privateKey: '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65'
    }
    // web3.eth.accounts.wallet.add(sender.privateKey)

    // 获取合约ABI和Bytecode
    let KVStorage = require('./build/contracts/KVStorage.json')

    let contract = new web3.eth.Contract(KVStorage.abi, address)

    return contract.methods.namespace().call({ from: sender.address })
    .then(namespace => {
        console.log('namespace:', namespace)
    })
}


async function ContractTransaction(address) {
    // 导入账号，VETTransfer中以导入这里就不再重复操作了
    console.log("Contract set data, contract address: ", address)
    let sender = {
        address: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        privateKey: '0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65'
    }
    // web3.eth.accounts.wallet.add(sender.privateKey)

    // 获取合约ABI和Bytecode
    let KVStorage = require('./build/contracts/KVStorage.json')

    let contract = new web3.eth.Contract(KVStorage.abi, address)

    let key = "0x496699b551fae009387328298b517b0b8be1c99f42d31ef2793ffcee5a7a316b"
    let value = "0x4de71f2d588aa8a1ea00fe8312d92966da424d9939a511fc0be81e65fad52af8"

    // 设置KV存储
    return contract.methods.set(key, value)
    .send({ from: sender.address, gas: 500000 })
    .then(receipt => {
        console.log('receipt:', receipt)
    })
}


// 私钥在外部环境时
async function SignWithOutPrivateKey() {
    // 该方法将演示
    // 1. 如何生成待签名的messageHash
    // 2. 使用外部签名工具签名之后，生成RawTransaction

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

    // 使用外部签名工具签名messageHash
    let signature = SignTx(messageHash)

    // 设置交易签名，要求signature为Buffer类型
    tx.signature = signature

    // 签完名的交易可以查询signer和txId
    // let txId = tx.id
    // let signer = tx.signer

    let rawTx = tx.encode() // Buffer
    return '0x' + rawTx.toString('hex')
}
SimpleExamples();
