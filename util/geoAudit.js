const AXIOS=require('axios')
,__=require('underscore')
,FS=require('fs')
;

// let confirmeds=[]
var confirmeds=[
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
,"hopitaljasonsendweer"
,"tommybahamaskokie"
,"annefrankhuis"
,"seattlespaceneedle"
,"altadenaca"
,"bahrain"
,"limerickhuntmuseum"
,"limericktreatystone"
,"lakesuperior"
,"burtonchacepark"
,"historicmarinadelreylighthouse"
,"bajacantinamdr"
,"tikimermaidchartersharborcruiseboat"
,"tonypsdocksidemdr"
,"ritzcarltonmdrparking"
,"maricopastphoenix"
,"toweringpinespsychiatric"
,"hotelduvin"
,"brewlabcoffeeedinburgh"
,"tolboothtavern"
,"edinburghcastle"
,"braidwoodcentre"
,"sanquentin"
,"21choices"
,"tommyschiliburger"
,"johnnyssportshop"
,"sanrafaelhills"
,"miamibeach"
,"madisonwi"
,"parisfr"
,"lacanadaflintridge"
,"minnellimansion"
,"romeny"
]

var places = JSON.parse(FS.readFileSync('/Users/ccmiller/git/dalyverse/util/incoming-places.json'))

// 'http://wompupthejams.com:3030/geoms/simple?q=poly:1188',
// 'http://wompupthejams.com:3030/geoms/simple?q=poly:1186',
// 'http://wompupthejams.com:3030/geoms/simple?q=poly:1190',

const main = async () =>{

__.each(places,async (p)=>{

let uri = "http://wompupthejams.com:3030/geoms/simple?q="+p.geo_key.type+':'+p.geo_key.id

AXIOS.head(uri)
    .then(response => console.info(response.statusText=='OK'?'':response)) //Log is giving an undefined response
    .catch((error)=>{console.log(error)});

})//each



} //main

main();
