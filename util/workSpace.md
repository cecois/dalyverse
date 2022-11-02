caresFor
hasFriend
hasParticipant
hasWorkedAt
hasWorkedFor
isChildOf
isClientOf
isFormerMemberOf
isMemberOf
isOwnerOf
isPetOf
isPossibleChildOf
isSiblingOf
isSpouseOf
livedAt
livesAt
miscellaneous
occurredAt
seeAlso
wasClientOf
wasSpouseOf
worksAt
worksFor

---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------

# graph


609 Channel St, Santa Monica

##### place
    ,{
        "_key": "_:victormaitlandmansion",
        "name": "Victor Maitland's Mansion",
        "article": [
            "Victor Maitland's Mansion was formerly occupied by movie villain Victor Maitland but now houses Mutt Taylor."
        ],
        "geo_key": {
            "type": "point",
            "id": 
        }
    }


##### person

    ,{
        "_key": "_:victormaitland",
        "daly": "false",
        "name": "Victor Maitland",
        "nami": "Maitland, Victor",
        "article": ["Victor Maitland is a fictitious movie villian played by actor Steven Berkoff."]
    }

##### edges

    ,{
        "_from": "people/_:mutttaylor",
        "_to": "places/_:victormaitlandmansion",
        "type": "livesAt",
        "vertex": "_:mutttaylor"
    }

    ,{
        "_from": "people/_:victormaitland",
        "_to": "places/_:victormaitlandmansion",
        "type": "livedAt",
        "vertex": "_:victormaitland"
    }

---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------

# graph

##### place

https://en.wikipedia.org/wiki/Ponderosa_Ranch

    ,{
        "_key": "_:ponderosaranch",
        "name": "Ponderosa Ranch",
        "article": [
            "Ponderosa Ranch is the (fictitious) Cartwright family's sprawling land off Lake Tahoe, NV."
        ],
        "geo_key": {
            "type": "poly",
            "id": 
        }
    }

##### event

    ,{
        "key": "mutttaylorbuildsshippingcontainermansionsontheponderosa",
        "name": "Mutt Taylor Builds Multiple Shipping Container Mansions on The Ponderosa",
        "article": [
            "According to BNSFB#18, in 2021-2022 at least, Mutt Taylor is overseeing the construction of multiple luxury shipping container homes on the land that was once the Cartwright's Ponderosa."
        ],
        "timestamp": {
            "start": "2021-08-01T06:00:00Z",
            "end": "2022-08-01T23:59:59Z"
        },
        "nb_timestamp": {
            "class": "estimate to the year",
            "nb": "how long does it take to build multiple shipping container mansions, ya know?"
        }
    }

##### people

mutttaylor

##### edges


    ,{
        "_from": "events/_:mutttaylorbuildsshippingcontainermansionsontheponderosa",
        "_to": "places/_:ponderosaranch",
        "type": "occurredAt",
        "vertex": "_:mutttaylorbuildsshippingcontainermansionsontheponderosa"
    }

    ,{
        "_from": "events/_:mutttaylorbuildsshippingcontainermansionsontheponderosa",
        "_to": "people/_:mutttaylor",
        "type": "hasParticipant",
        "vertex": "_:mutttaylorbuildsshippingcontainermansionsontheponderosa"
    }


---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------------------------------

# graph

##### place


    ,{
        "_key": "_:", //harryandmeghansmainhousemontecito
        "name": "Harry and Meghan's Montecito House",
        "article": [
            "Harry and Meghan's Montecito House is the home of Prince Harry and his wife, Meghan Marke, the Duke and Duchess of Sussex."
        ],
        "geo_key": {
            "type": "point",
            "id":1621 
        }
    }

##### event

    ,{
        "key": "byrondennistonobservesabreastfeedingmixup",
        "name": "Byron Denniston Observes a Breastfeeding Mixup",
        "article": [
            "On BE#2, Byron Denniston reports that he observed Prince Harry complain to Meghan that he was 'jealous' of the breastfeeding of young Lilibet. There remains confusion regarding the true cause of his jealousy."
        ],
        "timestamp": {
            "start": "2021-10-24T06:00:00Z",
            "end": "2022-10-24T23:59:59Z"
        },
        "nb_timestamp": {
            "class": "accurate to the day",
            "nb": "'this past sunday' relative to the recording on 2021.Oct.28"
        }
    }    

##### people

    ,{
        "_key": "_:princeharrydukeofsussex",
        "daly": "false",
        "name": "Prince Harry, Duke of Sussex",
        "nami": "Prince Harry",
        "article": [
            "Prince Harry is a fromer British Royal."
        ]
    }

    ,{
        "_key": "_:meghanduchessofsussex",
        "daly": "false",
        "name": "Meghan Markle, Duchess of Sussex",
        "nami": "Markle, Meghan",
        "article": [
            "Meghan Markle is a retired American actor."
        ]
    }

    ,{
        "_key": "_:lilibetdianamountbattenwindsor",
        "daly": "false",
        "name": "Lilibet Diana Mountbatten-Windsor",
        "nami": "Mountbatten-Windsor, Lilibet Diana",
        "article": [
            "Lilibet Diana Mountbatten-Windsor is the granddaughter of King Charles III."
        ]
    }



##### edges

    ,{
        "_from": "events/_:byrondennistonobservesabreastfeedingmixup",
        "_to": "places/_:harryandmeghansmainhousemontecito",
        "type": "occurredAt",
        "vertex": "_:byrondennistonobservesabreastfeedingmixup"
    }

    ,{
        "_from": "events/_:byrondennistonobservesabreastfeedingmixup",
        "_to": "people/_:byrondenniston",
        "type": "hasParticipant",
        "vertex": "_:byrondennistonobservesabreastfeedingmixup"
    }

    ,{
        "_from": "events/_:byrondennistonobservesabreastfeedingmixup",
        "_to": "people/_:princeharrydukeofsussex",
        "type": "hasParticipant",
        "vertex": "_:byrondennistonobservesabreastfeedingmixup"
    }

    ,{
        "_from": "events/_:byrondennistonobservesabreastfeedingmixup",
        "_to": "people/_:meghanduchessofsussex",
        "type": "hasParticipant",
        "vertex": "_:byrondennistonobservesabreastfeedingmixup"
    }

    ,{
        "_from": "events/_:byrondennistonobservesabreastfeedingmixup",
        "_to": "people/_:lilibetdianamountbattenwindsor",
        "type": "hasParticipant",
        "vertex": "_:byrondennistonobservesabreastfeedingmixup"
    }
