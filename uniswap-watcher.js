// this loads the pooled liquidities on uniswap
// and allows calculating DTC / ETH price
let tokenAddress = config.ethContractAddress
let wethAddress = config.wethTokenAddress
let uniswapWallet = config.uniswapPoolAddress
let minErc20ABI = [
    {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
    }
];
const Web3 = require('web3')
let web3 = new Web3('https://mainnet.infura.io/v3/'+config.infuraKey);

module.exports = async function(cb) {
    let contractDtc = new web3.eth.Contract(minErc20ABI, tokenAddress)
    let contractWeth = new web3.eth.Contract(minErc20ABI, wethAddress)

    let balanceDtc = await contractDtc.methods.balanceOf(uniswapWallet).call()
    let balanceWeth = await contractWeth.methods.balanceOf(uniswapWallet).call()

    balanceDtc /= Math.pow(10,2)
    balanceWeth /= Math.pow(10,18)
    
    console.log('UNI Pool: '+balanceDtc+' DTUBE + '+balanceWeth+' ETH')
    
    if (balanceWeth / balanceDtc != dtcEther) {
        dtcEther = balanceWeth / balanceDtc
        console.log('DTUBE/ETH = '+dtcEther)
        updateFee()
    }

    if (cb) cb()
}