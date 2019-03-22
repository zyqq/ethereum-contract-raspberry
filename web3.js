let Web3 =  require('web3');

let web3;
// 浏览器环境且已经安装了 Metamask
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
} else {
  // 服务器环境或者没有安装 Metamask
  web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/00b6e151612241c49a9730ba48855ee6'));
}

export default web3;
