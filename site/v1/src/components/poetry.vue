<template>
<div id="vue-root" class="">
  <vue-topprogress ref="topProgress"></vue-topprogress>
  <vue-headful :title="page.title" description="People, Places, Events & Things in the Andy Dalyverse" />
  <div class="columns" style="padding-top:2em;">
    
    <div class="column has-text-grey-light">
      <div class="title">Poetry</div>
      <!-- <div class="has-text-grey is-size-7">(bolded == played by Daly)</div> -->
    </div>

  </div>
  <div class="columns dv-vertical-columns has-text-left">
    <div class="column is-6" style="padding-top:2em;">
      <div class="columns" style="margin-bottom:2em;">
        <div class="column is-3"></div NB=".column.is-3">
        <div class="column is-6">
        
        <input class="input is-large" type="text" placeholder="" v-model="livefilter">
          
        </div NB=".column.is-6">
        <div class="column is-3"></div NB=".column.is-3">
      </div  NB=".columns">

      <div class="table-container">
        <!-- TILES PER LETTER? -->
        <table class="table dv-index-table is-striped">
          <tbody>
            <tr v-for="P in poetry.poems" v-if="(!livefilter || P.title.toLowerCase().indexOf(livefilter.toLowerCase())>=0 || P.author.toLowerCase().indexOf(livefilter.toLowerCase())>=0 || P._id.toLowerCase().indexOf(livefilter.toLowerCase())>=0)">
              <!-- <th>{{P.title}}</th> -->
              <td>
                <span @click="setActive(P._id)" class="dv-trigger-active">{{P.title}}</span>
                <div style="padding-left:2em;" class="has-text-grey-light is-size-7">&nbsp;({{P.author}})</div>
              </td>
              <!-- <td>v-vor=e in N.entities</td> -->
            </tr>
          </tbody>
        </table>
      </div nb="/.table-container">
    </div note="/.column is-6">
    <div class="column is-6" style="padding-top:4em;">
      
      <div v-if="active" style="padding-left:2em;">
      <div class="level-right">
            <a @click="setActive()" class="delete" style="margin-top: 7vh;right: 2vw;position:relative;"></a>
          </div>
          <p class="title">{{active.title}}</p>
                <p class="subtitle">&nbsp;&nbsp;by {{active.author}}</p>
                <p class="has-text-grey-light">&nbsp;&nbsp;({{active.meta}})</p>
                <ul style="padding:1em 0;" v-for="stanza in active.stanzas">
                  <li v-for="line in stanza.lines">{{line}}</li>
                </ul>
      </div>
    </div>
  </div>
</div>
<!-- ./#vue-root -->
</template>

<script>
// import * as d3 from 'd3';
import simplebar from 'simplebar-vue';
  import 'simplebar/dist/simplebar.min.css';

export default {
  name: "Poetry",
  components: {
    simplebar
  },
  data () {
    return {
      active:null,
      poetry: {poems:[
        {"_id":"ithinkyoutwoguysareprickslimerick",
"title":"I Think You Two Guys are Pricks",
"author":"Patrick McMahon",
"meta":"prem. CBB 74 ~1:25:15",
"stanzas":[
{"lines":
[
"I think you two guys are pricks."
,"I think you two guys are dicks."
]
}
,{"lines":
[
"I came in here to tell stories"
,"about poor old Johnny McGorry."
,"And it turns out that Nicole Kidman and her entire family were all ghosts."
]
}
]},
        {"_id":"margaretandtedlimerick",
"title":"In Commemoration of the 50th Wedding Anniversary of Margaret & Ted",
"author":"Patrick McMahon",
"meta":"prem. CBB 74 ~1:10:00",
"stanzas":[
{"lines":
[
"Happy 50th to Margaret and Ted."
,"I thank god that neither is dead."
]
}
,{"lines":
[
"I've slept with you both"
,"despite your sacred oath."
,"Turns out Rosebud was a sled."
]
}
]},
        {"_id":"obamacarelimerick",
"title":"Obamacare",
"author":"Patrick McMahon",
"meta":"prem. CBB 74 ~1:07:50",
"stanzas":[
{"lines":
[
"There once was a fella named Obama"
,"he was sad because of the cancer that killed his mama."
]
}
,{"lines":
[
"He wanted to make it better"
,"so he rolled up his sweater."
,"And he handed it to Big Insurance and Pharma."
]
}
]},
        {"_id":"thereoncewasahousethatwasdarklimerick",
"title":"There Once was a House that was Dark",
"author":"Patrick McMahon, Scott Aukerman, Jason Mantzoukas",
"meta":"prem. CBB 74 ~1:06:30",
"stanzas":[
{"lines":
[
"There once was a house that was dark"
,"and that is where I wanted to park."
]
}
,{"lines":
[
"She turned off the lights"
,"and it gave me a fright."
,"Seriously, shut the fuckin lights off."
]
}
]},
        {"_id":"iiveneverseenthesouthoffrancebartlebymulcahy",
"title":"I've Never Seen the South of France",
"author":"Bartleby Mulcahy",
"meta":"prem. ADPPP 9 ~1:20:15",
"stanzas":[
{"lines":
[
"i've never seen the south of france"
,"nor a breakfast nook wearin pants"
]
}
]},
        {"_id":"icanrelatetobonanzabartlebymulcahy",
"title":"I Can Relate to Bonanza",
"author":"Bartleby Mulcahy",
"meta":"prem. ADPPP 9 ~1:17:45",
"stanzas":[
{"lines":
[
"there are many paths in life"
,"and some i've never took"
,"i've never seen the south of france"
,"nor have i seen a brook"
]
}
,{"lines":
[
"but of all the things i've never done"
,"along the paths in life"
,"the one i've missed the most"
,"is that i've never had a wife"
]
}
,{"lines":
[
"ben cartwright had three"
,"he'd see a woman and right away he'd choose her"
,"but though i've never had one"
,"at least i never had to lose her"
]
}
]},
        {"_id":"bencartwrightburiedthreewivesdaltonwilcox",
"title":"Ben Cartwright Buried Three Wives",
"author":"Dalton Wilcox",
"meta":"prem. ADPPP 9 ~1:11:30",
"stanzas":[
{"lines":
[
"a true Cowboy of the american west"
,"doesn't need tv - he likes campfires best"
,"if he wants to watch some ranchers workin on the land"
,"he can look out his damn window and then go lend a hand"
]
}
,{"lines":
[
"but what about those ignorant city-slickin jackasses?"
,"how could Cowboys educate the stupid, stupid masses?"
,"bonanza! bonanza! bonanza! bonanza!"
,"a real, no bullshit, television extravaganza"
]
}
,{"lines":
[
"four real men livin on the ponderosa"
,"doin what they want to and doin what they're supposeda"
,"adam has a face but it aint too expressive"
,"hoss is a giant and that there is impressive"
]
}
,{"lines":
[
"little joe is pretty (too pretty if you ask me)"
,"but the cartwright i like best is ben - tough and fair and free"
,"he's a hell of a rancher and a real good dad"
,"and you'll regret it if you make him mad"
]
}
,{"lines":
[
"he's got more good qualities than a short poem can mention"
,"but there's one thing about him that's caught my attention"
,"ben cartwright has buried three wives"
,"because they died - something ended their lives"
]
}
,{"lines":
[
"the story goes that childbirth is the thing that killed the first"
,"the second died by indian (cuz indians are the worst)"
,"the third fell off a horse and was that way dismembered"
,"but except for ol ben cartwright there's no one else remembers"
]
}
,{"lines":[
"no one else can tell the tales of how these women died"
,"is it possible that when ol ben cartwright said those things he lied?"
]}

,{"lines":[
"maybe his first wife was cursed by a mummy"
,"he'd'a shot her then cuz men aint no dummy"
,"maybe his second was a black lagoon creature"
,"he'd'a killed her, too - yep, that'd teach her"
]
}
,{"lines":[
"the third one, a werewolf? who knows - you get the point"
,"the ponderosa's too nice a place to have monsters in the joint"
,"ben cartwright is smart - he puts safety before romance"
,"the type of guy who probly keeps a stake of wood down his pants"
]
},{"lines":
["which i do in case i'm gonna run into any vampires"]
}
]},
  {
    "_id":"untitledrussellshein",
    "title": "Untitled",
    "author": "Russell Shein",
    "meta": "prem. ADPPP #1 ~1:09:30",
    "stanzas": [
      {
        "lines": [
          "psycopaths, murderers, running around",
          "telling their poems, putting people into the ground",
          "publishing books that no one will buy",
          "who is to blame? certainly not i"
        ]
      },
      {
        "lines": [
          "why am i beset by this crazy old man?",
          "he lies about my wife - i do what i can"
        ]
      },
      {
        "lines": [
          "the end"
        ]
      }
    ]
  },
  {
    "_id":"untitledbartlebymulcahy",
    "title": "Untitled",
    "author": "Bartleby Mulcahy",
    "meta": "prem. ADPPP #1 ~58:30",
    "stanzas": [
      {
        "lines": [
          "raised in the mountains of iowa",
          "i've rode the range all my life",
          "from the north to the south, from the side to the side",
          "neither time nor desire for a wife"
        ]
      },
      {
        "lines": [
          "some nights i do get lonely",
          "some days i have needs to tend",
          "when i want a caress or some tenderness",
          "my pillow is my best friend"
        ]
      }
    ]
  },
  {
    "_id":"whoamisallyjespa",
    "title": "Who Am I?",
    "author": "Sally Jespa",
    "meta": "prem. ADPPP #1 ~51:30",
    "stanzas": [
      {
        "lines": [
          "my boots are heavy",
          "my clothes are thick and dusty",
          "my hair is hidden under a hat"
        ]
      },
      {
        "lines": [
          "i am a cowgirl",
          "i rise with the sun",
          "i move like a semi truck",
          "i have but one friend - a horse",
          "i am a cowgirl"
        ]
      },
      {
        "lines": [
          "but woa, alas - i am changing like a butterfly going through that one process"
        ]
      },
      {
        "lines": [
          "i am becoming anew"
        ]
      },
      {
        "lines": [
          "i burst forth from the cocoon",
          "but who am i?"
        ]
      },
      {
        "lines": [
          "my shoes are light and support my arches",
          "my clothes are bright and full of wild patterns",
          "my hair is free and pumped with volume and bounce",
          "i am a fly girl"
        ]
      },
      {
        "lines": [
          "i rise for rehearsals and a taping",
          "i move like i can't be stopped",
          "i have more friends than ever, including jlo and rosie perez",
          "i am a fly girl"
        ]
      },
      {
        "lines": [
          "so do what you want to do",
          "in living color"
        ]
      }
    ]
  },
  {
    "_id":"ionetimekilledafrankensteindaltonwilcox",
    "title": "I One Time Killed a Frankenstein",
    "author": "Dalton Wilcox",
    "meta": "prem. ADPPP #1 ~43:45",
    "stanzas": [
      {
        "lines": [
          "i one time killed a frankenstein whilst shopping in a store",
          "he lurched toward me, arms outstretched, as i ambled toward the door",
          "in my hands, a new bandana; a hat, ten gallons deep",
          "in my body was a soul which my body aimed to keep"
        ]
      },
      {
        "lines": [
          "his voice was ghastly as he spoke in halting monster speech",
          "and i tried with all my might to stay out of his reach",
          "he said 'you gotta pay for that' and filled my heart with dread",
          "and then i drew my six-gun and shot the monster dead"
        ]
      },
      {
        "lines": [
          "the news reports described the monster simply as a man",
          "to keep from terrifying folks (as only a frankenstein can)"
        ]
      }
    ]
  },
  {
    "_id":"ihavebeentogoddamnedeuropedaltonwilcox",
    "title": "I Have Been to Goddamned Europe",
    "author": "Dalton Wilcox",
    "meta": "prem. Comedy Bang! Bang! 529 ~1:10:20",
    "stanzas": [
      {
        "lines": [
          "when a Cowboy from the american west goes to europe",
          "he finds things we have here like cars and maple syrup",
          "but their food is so bad it'll give a Cowboy the runs",
          "and they'll sure get upset when he tries to sneak in his guns"
        ]
      },
      {
        "lines": [
          "in his carry-on bag or his checked luggage, too",
          "which that Cowboy may not realize they were going to look through",
          "he may spend a few hours being detained and harrassed",
          "before they give up, pussy out, and let him pass"
        ]
      },
      {
        "lines": [
          "that Cowboy will sure be glad, i can tell ya",
          "that he also mailed some pistols to himself - how's that, fella?",
          "in a country where no one else is ever armed",
          "a Cowboy can do whatever with no fear of being harmed"
        ]
      },
      {
        "lines": [
          "he can take what he wants or who he wants, in fact",
          "and no one will criticize the way that he acts",
          "he can shoot lots of people, lots of people - quite a few",
          "that's just something a Cowboy needs to do"
        ]
      },
      {
        "lines": [
          "so europe is awful and stupid and weird",
          "but a Cowboy can go there without being afeared",
          "of not bein able to shoot people"
        ]
      }
    ]
  },
  {
    "_id":"theresotherthingsacowboycanalsofuckdaltonwilcox",
    "title": "There's Other Things a Cowboy Can Also Fuck",
    "author": "Dalton Wilcox",
    "meta": "prem. Comedy Bang! Bang! 442 ~1:11:00",
    "stanzas": [
      {
        "lines": [
          "a loneseme Cowboy out on the range",
          "will fuck things a city slicker might find strange",
          "i am not speaking of the horse or the cow",
          "because fucking them isn't so strange anywhow"
        ]
      },
      {
        "lines": [
          "in the natural relationship between man and those beasts",
          "there will always be a fuckin once in a while at least",
          "so i, my friends, am not talking of that",
          "nor am i talkin about fucking your hat"
        ]
      },
      {
        "lines": [
          "there's nothin strange about Cowboy hat fuckin",
          "this is not a topic any Cowboy will try ducking",
          "we all fuck our horses and our cows and our hats",
          "and our holsters and our boots and piles of coyote scat"
        ]
      },
      {
        "lines": [
          "i've told you before we fuck holes in the ground",
          "in the poem which is, deservedly, my most renowned",
          "but there's other things a Cowboy can also fuck",
          "some he has handy; others require some luck"
        ]
      },
      {
        "lines": [
          "it is no great matter to fuck a tree",
          "a wallet or a can of beans - those things you can see",
          "but a Cowboy who's serious, determined, and disciplined",
          "a Cowboy like this can fuck the wind"
        ]
      },
      {
        "lines": [
          "gotta have a speed of at least forty miles an hour",
          "and your hips have to have some real thrusting power",
          "but when conditions are right she's a very tender lover",
          "one of the best sex partners this Cowboy has discovered"
        ]
      },
      {
        "lines": [
          "but don't do it too often; don't get overzealous",
          "because if you fuck the wind too much the earth will get jealous"
        ]
      }
    ]
  },
  {
    "_id":"regardingthesituation...daltonwilcox",
    "title": "Regarding the Situation of the Evil Versus Good Battle that is Commencing Here on the Twilight Nether Region to Decide Whether Everybody Who's Died Since 1981 is Going to Heaven or Hell",
    "author": "Dalton Wilcox",
    "meta": "prem. Comedy Bang! Bang! 300 ~45:30",
    "stanzas": [
      {
        "lines": [
          "ever since satan fell out with his buddy, god",
          "he's been goin around pickin up members for his evil squad",
          "tempting men to sin; consigning them to hell",
          "always in the market for souls men want to sell"
        ]
      },
      {
        "lines": [
          "he's taken many earthly forms - a lot of times, vampires",
          "mummies, werewolves, frankensteins who are, ironically, afraid of fires",
          "i've killed satan a buncha times, which is why i am a hero",
          "right now the score is: dalton, a lot; and satan's forces, zero"
        ]
      },
      {
        "lines": [
          "but now he is a game show host and candidate for honorary mayor",
          "to defeat the evil within this man will take much more than prayer",
          "and he has a supreme commander - a shapeshifting ventriloquist dummy",
          "he can take the form of water, a hairbrush, or a mummy"
        ]
      },
      {
        "lines": [
          "his name is Golly; and you might think he's as evil as it gets",
          "but if that's your bet you, sir, are not good at making bets",
          "for there is another - a supreme commander to this supreme commander",
          "a theatrical director who speaks with a voice like a black & decker electric sander"
        ]
      },
      {
        "lines": [
          "dom dimello, satan's boss' boss, has amassed a deadly force",
          "which is why i've ridden to the rescue atop my tallest horse",
          "with six guns a-blazin i ride out from the west",
          "a steak of wood down my pantleg to plunge into your chest"
        ]
      },
      {
        "lines": [
          "my horse's hoofs land on the turf a-thunderin like a bomb",
          "and 'you must buy your wife at least as much jewelry as you buy your horse and other poems and observations, humorous and otherwise, from a life on the range...' is now available as an audiobook at audible.com"
        ]
      }
    ]
  },
  {
    "_id":"ebenezerwilcoxdaltonwilcox",
    "title": "Ebenezer Wilcox",
    "author": "Dalton Wilcox",
    "meta": "prem. Comedy Bang! Bang! 262 ~36:00",
    "stanzas": [
      {
        "lines": [
          "it was christmastime out in the west",
          "the time of year Cowboys like the best",
          "but i had had a real hard year and was not filled with christmas cheer",
          "i'd lost 20 head of cattle to a vampire coven",
          "and another girlfriend had been found with her head in the oven"
        ]
      },
      {
        "lines": [
          "and i know what happens when you feel this way",
          "when christmas comes and you are not gay",
          "so i kept my ears out for those three christmas spirits",
          "if a ghost tried to get me i'd damn well hear it"
        ]
      },
      {
        "lines": [
          "and sure enough: a ghost! a ghost! a ghost! a ghost! a ghost!",
          "the thing, next to vampires and mummies, that a Cowboy fears the most",
          "it came at me to remind me of bad things from my past",
          "like the time i ran over a family cuz i was driving a little too fast"
        ]
      },
      {
        "lines": [
          "yes he came in the form of sheriff Lomax with a warrant for hit and run",
          "and that ghost got the action end of my smith & wesson gun",
          "i was tryin to bury him when the next ghost did appear",
          "the ghost of christmas of present in the form of Jimmy Greer, my old ranch hand, tryin to haunt me about burying a man"
        ]
      },
      {
        "lines": [
          "so i hit him with the shovel and began to dig again"
        ]
      },
      {
        "lines": [
          "the ghost of christmas future was a fella from the bank",
          "i stuffed his mouth and nose with money as a funny kind of prank",
          "and after that a strange thing happened - i was in a better mood",
          "those christmas ghosts had done their job: i was no longer being rude"
        ]
      },
      {
        "lines": [
          "i told a boy to buy me the biggest goose in town",
          "he turned out to be a mummy so i had to gun him down",
          "but it's shapin up to be the greatest christmas of them all",
          "so from the heart of the west comes a cheerful cry: merry christmas one and all!"
        ]
      }
    ]
  },
  {
    "_id":"alsomummmiesdaltonwilcox",
    "title": "Also Mummies",
    "author": "Dalton Wilcox",
    "meta": "prem. Comedy Bang! Bang! 148 ~57:20 - dedicated to Pete Dawson, Lennox Wilder, Boone Wilde, Cal Turner, Marlon Keaton, Don Holt",
    "stanzas": [
      {
        "lines": [
          "in the sands of ancient Egypt when a pharaoh died",
          "they were wrapped in bandages while their kinfolk cried",
          "they were buried with their treasures in pyramids of stone",
          "and curses were placed on these crypts, the pharaoh's eternal home"
        ]
      },
      {
        "lines": [
          "but eons passed and greedy men began to poke about",
          "in hopes of finding gold and taking that gold out",
          "and in so doing the greedy men stirred the pharaoh's curse",
          "just to get a little bit of gold inside their goldpiece purse"
        ]
      },
      {
        "lines": [
          "and now there's mummies roaming the plains",
          "seeking revenge for ancient pains",
          "a Cowboy never knows when a mummy may appear",
          "which will help explain his ever-present mummy fear"
        ]
      },
      {
        "lines": [
          "and why he sets fire to you first and then asks questions later",
          "a mummy can look like a ranch hand or a waiter",
          "or a sheriff or a child or anyone a Cowboy might meet in the wild",
          "so many mummies that lived centuries ago",
          "meet their end at the hands of the Cowboy, you know"
        ]
      },
      {
        "lines": [
          "perhaps Cowboys should be stationed at every crypt",
          "buried deep beneath the pyramids of good, old Egypt"
        ]
      },
      {
        "lines": [
          "mummies! mummies! mummies! mummies!"
        ]
      }
    ]
  },
  {
    "_id":"adangerouslifedaltonwilcox",
    "title": "A Dangerous Life",
    "author": "Dalton Wilcox",
    "meta": "prem. Comedy Bang! Bang! 148 ~44:00 - dedicated to the memories of Winston Black, Carlise Dunhill, Baxter Fields, Tom Sherwood, Lester Delwood, Wesley Norton",
    "stanzas": [
      {
        "lines": [
          "the Cowboy's life is full of danger",
          "to risks to his life he is never a stranger",
          "he knows there's a chance his horse may throw him",
          "he lives in a fear that a storm may blow him"
        ]
      },
      {
        "lines": [
          "of all the ways a Cowboy may meet his end",
          "there are few against which he can defend",
          "his rifle can't shoot the wind or the fire",
          "it will not work against vampires who stalk the plains for Cowboy blood and leave their prey dead in the mud"
        ]
      },
      {
        "lines": [
          "every shadow that moves in the night gives the Cowboy vampire fright",
          "vampires!, vampires!, vampires!, vampires!",
          "with fangs as sharp as new barbed wire",
          "they sneak up on Cowboys - sit behind em on their horse",
          "and ride that way for miles, of course"
        ]
      },
      {
        "lines": [
          "the Cowboy, riding unawares until he feels icy fingers brushing his hairs",
          "off of his neck to get a clean bite",
          "and reduce his palor to a ghostly white",
          "a vampire can look like anyone - getting killed by one would not be fun",
          "a smart Cowboy will carry a stake of wood",
          "and bury it in the heart of anyone he thinks he should"
        ]
      },
      {
        "lines": [
          "some of these may turn out to be regular men",
          "but better safe than sorry then"
        ]
      }
    ]
  },
  {
    "_id":"thatlonesomecowboyin2018daltonwilcox",
    "title": "That Lonesome Cowboy in 2018",
    "author": "Dalton Wilcox",
    "meta": "prem. ADPPP 9 ~37:00",
    "stanzas": [
      {
        "lines": [
          "a Cowboy in 2018 is a lonesome man",
          "there's none more lonesome in the land",
          "he rides atop his only friend - his horse, a companion on whom he can depend",
          "his woman may be miles behind him in 2018",
          "sadness and desperation may find him in 2018"
        ]
      },
      {
        "lines": [
          "but a Cowboy who's wise will turn to the earth to lend him solace and even mirth",
          "the earth from which all beauty springs, such bounty forth she always brings",
          "he'll dig a hole with cracked, scorched hands; pour in all the water that hole demands in 2018",
          "until that hole is moist, just right - the earth'll never put up any kind of a fight in 2018"
        ]
      },
      {
        "lines": [
          "his cries of joy no one will hear in 2018",
          "in case i am not being clear - i'm saying that Cowboy is gonna fuck a hole in the ground in 2018",
          "we all do it, that's what i have found",
          "any Cowboy that knows that lonesome hell can fashion a land virginie well",
          "if a Cowboy's seed worked like other seeds there'd be Cowboys growing everywhere across the plains like weeds"
        ]
      }
    ]
  },
  {
    "_id":"thelonesomecowboydaltonwilcox",
    "title": "The Lonesome Cowboy",
    "author": "Dalton Wilcox",
    "meta": "prem. Comedy Bang! Bang! 148 ~32:30",
    "stanzas": [
      {
        "lines": [
          "a Cowboy is a lonesome man",
          "there's none more lonesome in the land",
          "he rides atop his only friend - his horse, a companion on whom he can depend",
          "his woman may be miles behind him",
          "sadness and desperation may find him"
        ]
      },
      {
        "lines": [
          "but a Cowboy who's wise will turn to the earth to lend him solace and even mirth",
          "the earth from which all beauty springs, such bounty forth she always brings",
          "he'll dig a hole with cracked, scorched hands; pour in all the water that hole demands",
          "until that hole is moist, just right - the earth'll never put up any kind of a fight"
        ]
      },
      {
        "lines": [
          "his cries of joy no one will hear",
          "in case i am not being clear - i'm saying that Cowboy is gonna fuck a hole in the ground",
          "we all do it, that's what i have found",
          "any Cowboy that knows that lonesome hell can fashion a land virginie well",
          "if a Cowboy's seed worked like other seeds there'd be Cowboys growing everywhere across the plains like weeds"
        ]
      }
    ]
  },
  {
    "_id":"avisittopittickmansiondaltonwilcox",
    "title": "A Visit to Pittick Mansion",
    "author": "Dalton Wilcox",
    "stanzas": [
      {
        "lines": [
          "a mansion - large, forbidding, old",
          "in the summer it is hot; in the winter, probably cold",
          "because of an outdated heating system and a lack of central air",
          "but there's worse things, by far, that is probably hidden in there",
          "a mansion like this, like i am describing",
          "is just the perfect place for a ghost to be hiding"
        ]
      },
      {
        "lines": [
          "a ghost, a specter, a phaint, and a spirit",
          "stop listening now if you're too scared to hear it",
          "i went in there looking - knowing what i would find",
          "to slaughter a ghost is what i had in mind",
          "the entryway was fine; and so was the toilet",
          "the kitchen door howled like a ghost (so someone ought to oil it)"
        ]
      },
      {
        "lines": [
          "i went room-to-room looking for signs of haunting",
          "and there's a lot of rooms there so that job is pretty daunting",
          "but i saw nothing strange, nothing scary or dramatic",
          "until i decided it was time to check the attic",
          "'the attic's off-limits,' said a man in a red vest with a pin reading 'volunteer' a-pinned onto his chest",
          "'i know why you don't want me there,' i said as i pulled my gun",
          "cuz that's where you and the other ghosts live, work, and have fun"
        ]
      },
      {
        "lines": [
          "the attic! of course that's where the ghosts of pittick house dwell",
          "and this, here, was a-one of em (just trust me, i can tell)",
          "he said 'what are you talking about? put that gun away.' in fear",
          "and well, sir, as per usual that was all i needed to hear",
          "three silver bullets -- blam, blam, blam, blam -- okay, i guess it was four",
          "and the ghost of pittick mansion doesn't live there anymore"
        ]
      },
      {
        "lines": [
          "so you feel free to visit there if you live here or you're touring",
          "but honestly i would skip it - it's an old house, it's kind of boring"
        ]
      }
    ]
  }
]},
      livefilter:null,
      page: {
        title: "Andy Dalyverse - Poetry"
      },
      meta: { graph: { loading: false } },
      loadings:[
      {mod:"init",isLoading:false},
      {mod:"item",isLoading:false},
      {mod:"subgraph",isLoading:false}
      ],
      console: {
        msgs: [],
        clazz: null,
        throb: false
      }
    }
  }, // data
  beforeCreate () {}, // beforeCreate
  created () {


    console.info(
      process.env.VERBOSITY === "DEBUG" ? "begin CREATED, processing incoming vars" : null
    );

  }, // created
  mounted: function () {
    console.info(
      process.env.VERBOSITY === "DEBUG" ? "running in mode:" + process.env.MODE : null
    );

  }, //mounted
  methods: {
    setRoute: function () {
        console.info(process.env.VERBOSITY === "DEBUG" ? "setRoute()..." : null);

        this.$router.push({
          params: {
            activeKey: this.active.key
          }
        });
      } //setRoute
    ,setActive: function (p) {

if(p){
  this.active=this.$_.findWhere(this.poetry.poems,{_id:p})
} else {
  this.active=null;
}

      } //setActive
    ,setPageTitle: function () {
      let sub = null;

      switch (true) {
        case typeof this.active.item == "undefined":
          sub = this.active.key;
          break;
        default:
          sub = this.active.item.content;
          break;
      }

      this.page.title = "Dalyverse Entities Graph: " + sub;
    } //setPageTitle
  }, //methods
  computed: {}, //computed

  watch: {
    "loadings": {
      handler: function (vnew, vold) {

        // this.$refs.topProgress.done();
        this.$_.contains(this.$_.pluck(vnew,'isLoading'),true)?this.$refs.topProgress.start():this.$refs.topProgress.done();
      }//handler
      ,
     deep: true
    },
  } //watch
}; //export.timeline
</script>

<style scoped=true>
/* ---------------------------------- BULMA -- */

.hero.is-medium > .hero-body {
  padding: 0px;
}
</style>
