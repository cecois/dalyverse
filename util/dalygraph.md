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



# VUE

## EVENTS

### URL
	tstart,tend,activetimelineitem
### ONLOAD
	console.msg
	fetch items in range
	_.map timetimes
	map places
### ACTIVATEITEM
	render participants
	zoom place
	highlight place


### EVENTS.events
	move(url start/end update)
	activate/deactivate item(url update; event edges queried, participant and places returned)

		"hasParticipant"
		"occurredAt"

# GRAPH

## EDGES

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

* for a given event (e.g. "events/_:andicallahangetsanape"), pull participants ARRAY:
			LET event = (for vertices, edges, paths in OUTBOUND "events/_:andicallahangetsanape" edges
			return distinct {
			name: FIRST(paths.vertices).name,
			evid: FIRST(paths.edges)._from
			}) LET people = (
			for v in 1..1 OUTBOUND "events/_:andicallahangetsanape" edges
			RETURN {name:v.name,key:v._id}
			) return {
			event:event,
			people:people
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

docker exec 7d7c2470953a arangoimport --file "/tmp/incoming-edges.json" --type json --collection "edges" --create-collection-type edge --batch-size 33554432 --create-collection true
docker exec 7d7c2470953a arangoimport --file "/tmp/incoming-places.json" --type json --collection "places" --batch-size 33554432 --overwrite --create-collection true
docker exec 7d7c2470953a arangoimport --file "/tmp/incoming-places.json" --type json --collection "places" --batch-size 33554432 --create-collection true

##### Query

curl -X POST --header 'accept: application/json' --data-binary @- --dump - http://155.34.170.88:8529/_api/query <<EOF
{
  "query" : "for e in edges filter e.type=='hasParticipant' for ev in events filter e._from==ev._id return { id:ev._key, content:ev.name, article:ev.article}"
}
EOF
