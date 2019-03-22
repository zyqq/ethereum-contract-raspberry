// let express = require("express")
let Gpio = require("rpio2").Gpio;
let fs = require('fs');
let Led = require('./Led.json')
let address = require('./ledAddress.json') 

let led = new Gpio(36);

let Web3 =  require('web3');

let web3;
 // 服务器环境或者没有安装 Metamask
 web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/00b6e151612241c49a9730ba48855ee6'));


//web3.eth.personal.unlockAccount(web3.eth.accounts[0],"5546906..",function(err,result){
//	if(err){
//		console.log(err);
//	}	
//	if (result){
//		console.log(result);
//	}
//})
(async () => {
	let accounts = await web3.eth.getAccounts();

	let ledContract = new web3.eth.Contract(JSON.parse(Led.interface), address);
	 
	console.log(accounts);
	
	
//	ledContract.events.ReturnLedStatus({
//	    fromBlock: 0,
//	    toBlock:'latest'
//	}, function(error, event){ 
//		console.log(event);
//		LedOn();
		//myreadFile();
//   });
	ledContract.events.ReturnLedStatus({
	   	filter: {_from: '0x75BAC73801Feacf14D57c01749E8C1DA08F2974c'},
	   fromBlock:'latest'
	},function(error, event) {
	   //console.log(event);
		LedOn();
		//myreadFile();
	})
	
	function LedOn(){
		led.open(Gpio.OUTPUT,Gpio.LOW);
		console.log("now the door open");
		led.toggle();
		led.sleep(10000);
		led.close();
	}
	
	//function myreadFile(){
		//unlock	
	//	web3.personal.unlockAccount(web3.eth.accounts[0],"877095605521");
		//fs.readFile('/sys/bus/w1/devices/28-020b92456572/w1_slave','utf-8',function(err,fd){
			//tem = fd.slice(-6,-1);
			//tem = parseInt(tem);
			//tem = tem/1000;
			//iotproject.updateTemp(tem);
			//console.log("current temp:%d",tem);
			//})
//}
})()




