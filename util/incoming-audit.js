const FS = require('fs')
;

FS.readFIle('incoming-edges.json',(err,dat)=>{
	
	let jsons = JSON.parse(dat);

	console.log(jsons)

})