let Gpio = require("rpio2").Gpio;
let fs = require('fs');
let Logs = require('./Logs.json')
let address = require('./logsAddress.json') 

let led = new Gpio(36);

let Web3 =  require('web3');

let web3;
// 服务器环境或者没有安装 Metamask
web3 = new Web3(new Web3.providers.WebsocketProvider('https://ropsten.infura.io:8545/v3/00b6e151612241c49a9730ba48855ee6'));

(() => {
	let accounts = web3.eth.getAccounts()[0];
	let logsContract = new web3.eth.Contract(JSON.parse(Logs.interface), address);

	console.log(accounts)
	// 监听点灯操作
	logsContract.events.ReturnLedStatus({
	   	filter: {},
	   fromBlock:0
	},function(error, event) {
		if(error) {
			console.log(error);
			return;
		}
		// 树莓派实现点灯
		ledOn();
		// 记录点灯时的温度和时间
		recordLog();
	})

	
	function ledOn(){
		led.open(Gpio.OUTPUT,Gpio.LOW);
		console.log("now the led turns on");
		led.toggle();
		led.sleep(10000);
		led.close();
	}
	
	async function recordLog(){
		fs.readFile('/sys/bus/w1/devices/28-020b92456572/w1_slave','utf-8',async function(err,fd){
			tem = fd.slice(-6,-1);
			tem = parseInt(tem);
			tem = tem/1000;
			let time = formatDate(new Date(), 'yyyy/MM/dd hh:mm:ss')
			// 记录温度
			try {
		      const logResult = await logsContract.methods
		        						.createLogs(tem, time)
	        	   						.send({ from: '0x84ada67e0ed42e4f886f900d79f29b76e749d370', gas: '5000000' });
			} catch(err) {
				console.log(err)
			}
			console.log("current temp: ", tem, time);
		})
	}
	
	// 对Date的扩展，将 Date 转化为指定格式的String   
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
	// 例子：   
	// formatDate(new Date(),"yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
	// formatDate(new Date(), "yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18           
	function formatDate(date, fmt) {
	  var o = {
	    "M+": date.getMonth() + 1, //月份
	    "d+": date.getDate(), //日
	    "h+": date.getHours(), //小时
	    "m+": date.getMinutes(), //分
	    "s+": date.getSeconds(), //秒
	    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
	    "S": date.getMilliseconds() //毫秒
	  };
	  if (/(y+)/.test(fmt))
	    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	  for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt))
	      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	  return fmt;
}
})()




