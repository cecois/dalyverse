const FS=require('fs')
;

FS.readFile('./incoming-people.json', (e,d) => {
  if (e) throw e;
  console.log(JSON.parse(d));
});