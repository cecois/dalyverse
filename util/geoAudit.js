const AXIOS=require('axios')
,__=require('underscore')
,FS=require('fs')
;

// let confirmeds=[]
let confirmeds=[
"shadyviewboardandcare"
,"unnamedlotionshop"
,"schmiedebergpretzelcompany"
,"starbucksgowergulch"
,"ballyshollywood"
,"radiocity"
,"griffithobservatory"
,"pasadenafairytaletheatre"
,"sixflagsmagicmountain"
,"bergenregional"
,"huntingtonbeach"
,"arclightcinemas"
,"hiltonhotelhawaii"
,"maunaloa"
,"necromance"
,"georgemackenzieofrosehaughmausoleum"
,"edinburghscotland"
,"polkcityfl"
,"hmprisonwandsworth"
,"lochness"
,"venicefishingpier"
,"largo"
,"mdhs"
,"internationalwaters"
,"tombofjimmorrison"
,"londonbridgehavasu"
,"earwolfsunset"
,"ctusa"
,"hollywoodsign"
,"gracelandelvis"
,"epcotcenter"
,"thepinebarrensofnj"
,"1031wilshire"
,"melroseatgower"
,"thegrovela"
,"nordstromsantamonica"
,"courtyardoldtown"
,"marktwainhotella"
,"gowergulch"
,"laramiefeedandwesternsupply"
,"dresdende"
,"coronaca"
,"newmexicousa"
]

let places = JSON.parse(FS.readFileSync('/Users/ccmiller/git/dalyverse/util/incoming-places.json'))

__.each(places,(p)=>{

if(!__.contains(confirmeds,p._key.replace("_:",'')))
{
	console.log("\r\r")
	console.log({url:"http://wompupthejams.com:3030/geoms/simple?q="+p.geo_key.type+':'+p.geo_key.id,name:p.name,article:p.article,key:p._key})
}

})