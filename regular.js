// Regular script
var USER = "A"; // username selected

// HP level required before attempting to climb tower.
var ALLACTIONHP = {
	"A" : 16,
	"K" : 23
};

// AS level required before attempting to attack people.
var ALLACTIONAS = {
	"A" : 30,
	"K" : 30
};

// maximum DS willing to attack.
var ALLMAXDS = {
	"A" : 15,
	"K" : 15
};

var ALLINVESTIGATEURL = {
	"A" : "http://zc2.ayakashi.zynga.com/app.php?_c=adventure&action=stage&island_id=11&area_id=38&stage_id=150",
	"K" : "http://zc2.ayakashi.zynga.com/app.php?_c=adventure&action=stage&island_id=18&area_id=65&stage_id=276"
};

var HOMEURL = "http://zc2.ayakashi.zynga.com/app.php?_c=entry&action=mypage";
var KILLURL = "http://zc2.ayakashi.zynga.com/app.php?_c=battle&action=exec_battle&target_parts_id=0&from_battle_tab=&ref=undefined&target_user_id=";
var BATTLEURL = "http://zc2.ayakashi.zynga.com/app.php?_c=battle";

var STATES = Object.freeze({
	// base states
	"RTB" : "RTB", // returning to base
	"BASE" : "BASE", // base state

	// investigation states
	"INVESTIGATE" : "INVESTIGATE", // investigate the tower
	"DRAMA" : "DRAMA", // pre-fight drama
	"FIGHT" : "FIGHT", // fight screen
	"RESULT" : "RESULT", // result screen
	"NEGOTIATION" : "NEGOTIATION", // negotiation

	// pvp states
	"ORIENTING" : "ORIENTING", // state for determining which SS to hit
	"SEARCH" : "SEARCH", // finding enemies
	"PROCESS" : "PROCESS", // processing the found list

	// end state
	"ENDSTATE" : "ENDSTATE" // stops the program.
});

var ACTIONHP = ALLACTIONHP[USER];
var ACTIONAS = ALLACTIONAS[USER];
var MAXDS = ALLMAXDS[USER];
var INVESTIGATEURL = ALLINVESTIGATEURL[USER];

// other constants
var TIMEOUT = 30000; // number of miliseconds before purging
var MAXATTEMPTS = 100; // max number of search attempts for a ss
var DISPLAYLOGS = false; // displays logging information (leave off)

// state variables
var operation = window.open(HOMEURL); // window being operated.
var state = STATES.BASE; // current state
var timeoutCounter = 0; // counter for determining timeout before purging.
var delay = 5000; // delay between heartbeats
var searchAttempts = 0; // searches attempted

// other variables
var currentHP; // last known player HP
var currentas; // last known player AS
var opponents; // list of opponents for pvp

// locals
var i; // generic for loop counter
var def; // enemy player defense

function heartbeat() {
	if (operation.document && operation.$) {
		if (operation.document.readyState == 'complete') {
			if (state == STATES.RTB) {
				operation.location.href = HOMEURL;
				state = STATES.BASE;
				timeoutCounter = 0;
			} else if (state == STATES.BASE) {
				if (operation.$(".value") != null && operation.$(".value").length > 7 && operation.$(".current") != null) {
					timeoutCounter = 0;
					console.log("Remaining HP:" + operation.$(".current")[0].innerHTML);
					console.log("Remaining AS:" + operation.$(".value")[7].innerHTML);
					currentHP = parseInt(operation.$(".current")[0].innerHTML, 10);
					currentas = parseInt(operation.$(".value")[7].innerHTML, 10);
					if (currentHP >= ACTIONHP) {
						state = STATES.INVESTIGATE;
					} else if (currentas >= ACTIONAS) {
						state = STATES.SEARCH;
						delay = 5000;
					} else {
						state = STATES.RTB;
						delay = 60 * 1000;
					}
				}
			} else if (state == STATES.SEARCH) {
				$.get(BATTLEURL, {
					action : "opponents_for_level",
					from_battle_tab : "level"
				}).then(function(data) {
					console.log('Got Opponents');
					opponents = data.opponents;
					timeoutCounter = 0;
				}, function() {
					opponents = undefined;
					state = STATES.SEARCH;
				});
				state = STATES.PROCESS;
			} else if (state == STATES.PROCESS) {
				if (opponents != undefined) {
					timeoutCounter = 0;
					for (i = 0; i < opponents.length; i++) {
						def = opponents[i].detail.defense;
						if (def <= MAXDS) {
							console.log("Attacking: " + opponents[i].detail.userId);
							operation.location.href = KILLURL + opponents[i].detail.userId;
							state = STATES.RTB;
							delay = 5000;
							break;
						}
					}
					if (searchAttempts++ >= MAXATTEMPTS) {
						state = STATES.RTB;
						searchAttempts = 0;
					}
					opponents = undefined;
					if (state == STATES.PROCESS) {
						state = STATES.SEARCH;
					}
				}
			} else if (state == STATES.INVESTIGATE) {
				if (operation.window.location.href.indexOf("npc_battle") != -1) {
					operation.$(operation.$(".button")[0])[0].click();
					delay = 5000;
					state = STATES.DRAMA;
				} else if (operation.window.location.href.indexOf("empty_energy") != -1) {
					state = STATES.RTB;
				} else if (operation.window.location.href.indexOf(INVESTIGATEURL) == -1) {
					operation.window.location.href = INVESTIGATEURL;
					delay = 5000;
				} else {
					delay = 1000;
					if (operation.$("#card-acquisition-page").hasClass("ui-page-active")) {
						operation.$(operation.$(".button")[3]).trigger("click");
						timeoutCounter = 0;
					} else if (operation.$("#encounter-other-player-page").hasClass("ui-page-active")) {
						if (operation.$(operation.$(".button")[3]).attr("data-rel") == "back") {
							operation.$(operation.$(".button")[3]).trigger("click");
						} else {
							operation.$(operation.$(".button")[4]).trigger("click");
						}
						timeoutCounter = 0;
					} else if (operation.$("#treasure-acquisition-page").hasClass("ui-page-active")) {
						delay = 2000;
						operation.$(operation.$(".button")[3]).trigger("click");
						timeoutCounter = 0;
					} else if (operation.$("#parts-pvp-acquisition-page").hasClass("ui-page-active")) {
						operation.$("#btn-adventure-l").trigger("click");
						timeoutCounter = 0;
					} else if (operation.$("#do-adventure")[0]) {
						if (!((operation.$("#do-adventure").hasClass("loading")) || (operation.$("#cut-in-window").css("display") == 'block'))) {
							operation.$("#do-adventure").trigger("click");
						}
					}
				}
			} else if (state == STATES.DRAMA) {
				if (operation.$ && operation.window.location.href.indexOf("drama_id") != -1) {
					operation.window.location = getParameterByName('next_url', operation.location);
					delay = 5000;
					state = STATES.FIGHT;
				}
			} else if (state == STATES.FIGHT) {
				if (operation.window.location.href.indexOf("battle_scene") != -1) {
					operation.window.location = "http://zc2.ayakashi.zynga.com/app.php?hid=0&encounter_battle_mode=0&_c=npc_battle&action=battle_result";
					delay = 5000;
					state = STATES.RESULT;
				}
			} else if (state == STATES.RESULT) {
				if (operation.window.location.href.indexOf("battle_result") != -1) {
					operation.$(operation.$(".button")[0])[0].click();
					delay = 5000;
					state = STATES.NEGOTIATE;
				}
			} else if (state == STATES.NEGO) {
				if (operation.window.location.href.indexOf("negotiation") != -1) {
					operation.$(operation.$(".button")[0])[0].click();
					delay = 5000;
					state = STATES.INVESTIGATE;
				}
			}
		}
		if (timeoutCounter > TIMEOUT / delay) {
			console.log("Timeout");
			purge();
		} else {
			timeoutCounter++;
			if (state != STATES.ENDSTATE) {
				window.setTimeout(heartbeat, delay);
			}
		}
	} else {
		console.log("Connection Lost");
		purge();
	}
}

function purge() {
	console.log("Purging");
	delay = 5000; // simple reset.
	state = STATES.RTB;
	timeoutCounter = 0;
	window.setTimeout(heartbeat, delay);
}

function getParameterByName(name, loc) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(loc.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

heartbeat();