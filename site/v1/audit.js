const FS = require('fs')
,__ = require('underscore')
;

FS.readFile('../../util/incoming-things.json',(err,dat)=>{
	
	let jsons = JSON.parse(dat);

__.each(jsons,(J)=>{
	console.log((J._key.indexOf('_:')<0)?J:'');
	// if(typeof J._key == 'undefined'){console.log(J)}
})

})