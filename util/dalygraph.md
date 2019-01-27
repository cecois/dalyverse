# VUE

## EVENTS

### URL
	tstart,tend,activetimelineitem

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

### EVENTS:TIMELINE

* for e in events
	** e.hasParticant(s)
		for e in edges
		filter e.type=='hasParticipant'
		for ev in events
		filter e._from==ev._id
		for p in people
		filter e._to==p._id
		return {"evkey":ev._key,"p":p.name}
	** e.occurredAt

### PLACES:MAP

	* for e in places (no grouping)
		for e in edges
		filter e.type=='occurredAt'
		for ev in events
		filter e._from==ev._id
		for pl in places
		filter e._to==pl._id
		return {"evkey":ev._key,"pl":pl.name}

	* for e in places (grouping)
		for e in edges
		filter e.type=='occurredAt'
		for ev in events
		filter e._from==ev._id
		for pl in places
		filter e._to==pl._id
		collect placeid = pl._id,placename=pl.name INTO involved
		return {"plid":placeid,"plname":placename,"participants":involved}



##### Docker
9696  arangoimp --file ~/Downloads/airports.csv --collection airports --create-collection true --type csv
 9700  arangoimp --file ~/Downloads/airports.csv --collection airports --create-collection true --type csv
 9702  brew search arango
 9707  docker exec -it 7d7c2470953a arangoimp --file ~/Downloads/airports.csv --collection airports --create-collection true --type csv
 9710  docker exec -it 7d7c2470953a arangoimp --file /tmp/airports.csv --collection airports --create-collection true --type csv
 9712  docker exec -it 7d7c2470953a arangoimp --file /tmp/flights.csv --collection flights --create-collection true --type csv
 9713  docker exec -it 7d7c2470953a arangoimp --file /tmp/flights.csv --collection flights --create-collection true --type csv --create-collection-type edge
10019* history | grep arango
10022* docker start arangodb
10045  arangoimport --file "incoming-things.json" --type json --collection "things" --batch-size 33554432
10060  docker exec 'arangoimport --file "/tmp/incoming-things.json" --type json --collection "things" --batch-size 33554432'
10061  docker exec -d 7d7c2470953a arangoimport --file "/tmp/incoming-things.json" --type json --collection "things" --batch-size 33554432
10062  docker exec 7d7c2470953a arangoimport --file "/tmp/incoming-things.json" --type json --collection "things" --batch-size 33554432
10064  docker exec 7d7c2470953a arangoimport --file "/tmp/incoming-things.json" --type json --collection "things" --batch-size 33554432 --create-collection true
10126  history | grep arang
10127  docker exec 7d7c2470953a arangoimport --file "/tmp/incoming-people.json" --type json --collection "people" --batch-size 33554432 --create-collection true
10129  docker exec 7d7c2470953a arangoimport --file "/tmp/incoming-people.json" --type json --collection "people" --batch-size 33554432 --create-collection true
10130  docker exec 7d7c2470953a arangoimport --file "/tmp/incoming-events.json" --type json --collection "events" --batch-size 33554432 --create-collection true
10131  docker exec 7d7c2470953a arangoimport --file "/tmp/incoming-edges.json" --type json --collection "edges" --create-collection-type edge --batch-size 33554432 --create-collection true
10133  docker exec 7d7c2470953a arangoimport --file "/tmp/incoming-edges.json" --type json --collection "edges" --create-collection-type edge --batch-size 33554432 --create-collection true
10156  history | grep arang
10157  docker exec 7d7c2470953a arangoimport --file "/tmp/incoming-places.json" --type json --collection "places" --batch-size 33554432 --create-collection true
10159  docker exec 7d7c2470953a arangoimport --file "/tmp/incoming-places.json" --type json --collection "places" --batch-size 33554432 --overwrite --create-collection true

##### Query

curl -X POST --header 'accept: application/json' --data-binary @- --dump - http://localhost:8529/_api/query <<EOF
{
  "query" : "for e in edges filter e.type=='hasParticipant' for ev in events filter e._from==ev._id for p in people filter e._to==p._id return {evkey:ev._key,p:p.name}"
}
EOF
