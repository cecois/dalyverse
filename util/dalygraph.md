# TMP

2002 - cactustonyscoloradoarson
https://en.wikipedia.org/wiki/Hayman_Fire

week of the murder:
cactus tony remembers nothing
except:
  cactus tony visited tommy's chili burgers (two weeks prior to murder)
  cactus tony visited 21 choices in old town (@colorado) (9 days after the murder)

Trial of Cactus Tony
  miltonanddupree

Cactus Tony is Incarcerated at San Quentin
  date: post-trial
  Cactus Tony is sent to San Quentin, where he settles in nicely, playing checkers and Twister all day long and 'sometimes just get down on the floor and tangle up and just laugh and giggle.'

Interview w/ Cactus Irene (at a peter cetera concert)
  she remembers (from the week of the murder) only that they visited an all-you-can-eat crab shack; there she began suffering from crabsweats and had to be ushered out rapidly to lay down in an adjacent park



# GRAPH

### per person:

'things' error probably due to missing graph chunks

        for prsn in people
        let g = (
        FOR v, e, p IN 1..2 ANY 'people/_:russelshein' edges RETURN {
        vid: v._id,
        vna: v.name,
        ety: e.type,
        efr: e._from,
        eto: e._to
        }
        )
        return {person:{name:prsn.name,article:prsn.article,_id:prsn._id},graf:g}

        or

        for pp in people
        filter pp._key == '_:jimmorrison'
        FOR v, e, p IN 1..2 ANY pp 
        edges
        RETURN {v,e}

        let ppls = (for p in people return {_id:p._id,name:p._name,article:p._article})
let tngs = (for t in things return {_id:t._id,name:t._name,article:t._article})
RETURN MERGE({ persons:ppls,things:tngs } )

### type

* islocateAt
* hasFriend
* isCaredForBy
* isChildOf
* isClientOf
* isFormerSpouseOf
* isMemberOf
* isFormerMemberOf
* isPetOf
* isSiblingOf
* isSpouseOf
* workedAt
* workedFor
* worksAt
* worksFor
* participatedIn
* seeAlso

## PEOPLE

livesAt
hasFriend
hasParticipant
worksFor
worksAt
hasWorkedAt
isMemberOf
hasWorkedFor
isSpouseOf
caresFor
seeAlso
isChildOf
isSiblingOf
wasClientOf
isClientOf
wasSpouseOf
isFormerMemberOf
isPossibleChildOf
isPetOf

	* people.has_murdered==true
	* people.attributes



### ALL:GRAPH
* livesAt
* worksAt
* caresFor
* seeAlso
* isChildOf
* hasFriend
* isSiblingOf
* isSpouseOf
* isMemberOf
* hasWorkedAt
* hasWorkedFor
* worksFor
* wasClientOf
* isClientOf
* wasSpouseOf
* isFormerMemberOf
* isPossibleChildOf
* isPetOf


#### Arango Notes

### PEOPLE per EVENT

* for a given event (e.g. "events/_:andicallahangetsanape"), pull participants ARRAY and places ARRAY:
			LET event = (for vertices, edges, paths in OUTBOUND "events/_:thegreatminingoflakesuperior" edges
			return distinct {
			name: FIRST(paths.vertices).name,
			evid: FIRST(paths.edges)._from
			}) LET people = (
			for v,e,p in 1..1 OUTBOUND "events/_:thegreatminingoflakesuperior" edges
			filter e.type=='hasParticipant'
			RETURN {name:v.name,key:v._id}
			)
			LET places = (
			for v,e,p in 1..1 OUTBOUND "events/_:thegreatminingoflakesuperior" edges
			filter e.type=='occurredAt'
			RETURN {name:v.name,key:v._id}
			)
			return {
			event:event,
			participants:people,
			locations:places
			}


### EVENTS:TIMELINE

`for e in events e.hasParticant(s)
		for e in edges
		filter e.type=='hasParticipant'
		for ev in events
		filter e._from==ev._id
		for p in people
		filter e._to==p._id
		return {"evkey":ev._key,"p":p.name}`

`for event in events
    for edge in edges filter(edge._from==event._id && edge.type=='hasParticipant')
    for person in people filter(edge._to==person._id)
    return {event:event._key,edge:edge._id,person:person.name}`


### PLACES:MAP

	* for e in places (no grouping)
		for e in edges
		filter e.type=='occurredAt'
		for ev in events
		filter e._from==ev._id
		for pl in places
		filter e._to==pl._id
		return {"evkey":ev._key,"pl":pl.name}

	* for e in edges filter e.type=='occurredAt' for ev in events filter e._from==ev._id for pl in places filter e._to==pl._id collect placeid = pl._id,placename=pl.name INTO involved return {plid:placeid,plname:placename,participants:involved}



##### Docker

https://docs.arangodb.com/3.4/Manual/Deployment/Docker/

docker cp incoming-edges.json arango:/tmp && docker cp incoming-events.json arango:/tmp && docker cp incoming-people.json arango:/tmp/ && docker cp incoming-places.json arango:/tmp/

docker exec arango arangoimport --file "/tmp/incoming-places.json" --type json --collection "places" --create-collection true
docker exec arango arangoimport --file "/tmp/incoming-people.json" --type json --collection "people" --create-collection true
docker exec arango arangoimport --file "/tmp/incoming-events.json" --type json --collection "events" --create-collection true
docker exec arango arangoimport --file "/tmp/incoming-edges.json" --type json --collection "edges" --create-collection-type edge --create-collection true

docker exec arango arangoimport --file "/tmp/incoming-places.json" --type json --collection "places" --overwrite true
docker exec arango arangoimport --file "/tmp/incoming-people.json" --type json --collection "people" --overwrite true
docker exec arango arangoimport --file "/tmp/incoming-events.json" --type json --collection "events" --overwrite true
docker exec arango arangoimport --file "/tmp/incoming-edges.json" --type json --collection "edges" --overwrite true

##### Query

curl -X POST --header 'accept: application/json' --data-binary @- --dump - http://155.34.170.88:8529/_api/query <<EOF
{
  "query" : "for e in edges filter e.type=='hasParticipant' for ev in events filter e._from==ev._id return { id:ev._key, content:ev.name, article:ev.article}"
}
EOF
