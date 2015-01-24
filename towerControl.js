// Auto Tower Runner
// WARNING: all wandering ghosts will be automatically rejected if fought.
var USER = "K"; // username selected
var EVID = "80"; // event id of the tower
var SSID = "1599"; // tower SS monster ID;

// These are inventory_monster_id.
var ALLLEADS = {
	"A" : {
		"10101590" : "51852",
		"10101591" : "62039",
		"10101592" : "88738",
		"10101593" : "54046",
		"10101594" : "86438",
		"10101598" : "115867"
	},
	"K" : {
		"10101590" : "26116",
		"10101591" : "26232",
		"10101592" : "27250",
		"10101593" : "26232"
	}
};

var ALLTEAMS = {
	"A" : {
		"10101590" : "77312,77859,22559,21917",
		"10101591" : "77859,77312,95937,51852",
		"10101592" : "95937,93019,64128,52060",
		"10101593" : "76520,95937,77580,77312",
		"10101594" : "95937,93019,64128,52060",
		"10101595" : "104313,89315,82603,7274"
	},
	"K" : {
		"10101590" : "30501,30506,30485,30476",
		"10101591" : "26116,30506,30485,30476",
		"10101592" : "26116,27251,30485,30476",
		"10101593" : "27250,27251,27252,30476"
	}
};

var ALLCOSTS = {
	"A" : {
		"10101590" : 24,
		"10101591" : 38,
		"10101592" : 72,
		"10101593" : 99,
		"10101594" : 92,
		"10101595" : 128
	},
	"K" : {
		"10101590" : 38,
		"10101591" : 60,
		"10101592" : 96,
		"10101593" : 124
	}
};

//WGs to buy if buyable
var ALLBUYWG = {
	"A" : ["1598"],
	"K" : ["1598"]
};

// HP level required before attempting to climb tower.
var ALLACTIONHP = {
	"A" : 800,
	"K" : 200
};

// AS level required before attempting to attack people.
var ALLACTIONAS = {
	"A" : 300,
	"K" : 300
};

// maximum DS willing to attack.
var ALLMAXDS = {
	"A" : 51,
	"K" : 44
};

// pvp team as well as the gg/wg fallback team leader (if a specific team isn't defined)
var ALLATTACKLEAD = {
	"A" : "68293",
	"K" : "27250"
};

// pvp team as well as the gg/wg fallback team (if a specific team isn't defined)
var ALLATTACKTEAM = {
	"A" : "77859,22559,21917,21736",
	"K" : "30501,30506,30485,30476"
};

// cost of the attacking team
var ALLATTACKTEAMCOST = {
	"A" : 51,
	"K" : 44
};

// true if the user has found a seal stone, false otherwise.
var ALLSSFOUND = {
	"A" : true,
	"K" : false
};

// DO NOT EDIT below this line
// URL constants
// base URLs
var BASEURL = "http://zc2.ayakashi.zynga.com/app.php?";
var HOMEURL = "http://zc2.ayakashi.zynga.com/app.php?_c=entry&action=mypage";

// teaming URLS
var TEAMDATAURL = "http://zc2.ayakashi.zynga.com/app.php?_c=monster&action=jsonlist&list_type=offense&order_by=attack-desc";

// Tower
var TOWERURL = "http://zc2.ayakashi.zynga.com/app.php?_c=extra_quest_event_adventure&evid=" + EVID;
var TOWERURL2 = "http://zc2.ayakashi.zynga.com/app.php?evid=" + EVID + "&_c=extra_quest_event_adventure";
var TOWERURL3 = "http://zc2.ayakashi.zynga.com/app.php?island_id=1&area_id=1&stage_id=1&no_drama=1&evid=" + EVID + "&newest=1&_c=ExtraQuestEventAdventure&action=stage";
var ENCOUNTERURL = "http://zc2.ayakashi.zynga.com/app.php?&evid=" + EVID + "&_c=extra_quest_event_npc_battle&action=confirm&battle_id=";
var RESULTURL = "http://zc2.ayakashi.zynga.com/app.php?hid=0&evid=" + EVID + "&_c=extra_quest_event_npc_battle&action=battle_result&encounter_battle_mode=";
var ACCEPTURL = "http://zc2.ayakashi.zynga.com/app.php?_c=extra_quest_event_negotiation&action=negotiate&evid=" + EVID;
var REJECTURL = "http://zc2.ayakashi.zynga.com/app.php?_c=extra_quest_event_negotiation&action=resign&evid=" + EVID;
var WALKURL = "http://zc2.ayakashi.zynga.com/app.php?_c=ExtraQuestEventAdventure&action=proceed&island_id=1&evid=" + EVID + "&newest=1";

// PVP URLS
var BATTLEURL = "http://zc2.ayakashi.zynga.com/app.php?_c=battle";
var KILLURL = "http://zc2.ayakashi.zynga.com/app.php?_c=battle&action=exec_battle&from_battle_tab=&ref=undefined&target_user_id=";
var BATTLESSURL = "http://zc2.ayakashi.zynga.com/app.php?from_where=stone&_c=battle&action=battle_list&target_parts_id=";
var ACCEPTSSURL = "http://zc2.ayakashi.zynga.com/app.php?_c=parts&action=accept_reward&_=1422076921850&id=";

// state constants
var STATES = Object.freeze({
	// base states
	"RTB" : "RTB", // returning to base
	"BASE" : "BASE", // base state
	"ACTION" : "ACTION",// action

	// set team states
	"RESETTING" : "RESETTING", // resetting team
	"SETLEAD" : "SETLEAD", // setting lead
	"CHECKLEAD" : "CHECKLEAD", // checking lead
	"SETTEAM" : "SETTEAM", // setting team
	"CHECKTEAM" : "CHECKTEAM", // checking team

	// investigation states
	"INVESTIGATE" : "INVESTIGATE", // investigate the tower
	"RETURN" : "RETURN", // return to ghost after changing team
	"DRAMA" : "DRAMA", // pre-fight drama
	"FIGHT" : "FIGHT", // fight screen
	"RESULT" : "RESULT", // result screen
	"AFTERDRAMA" : "AFTERDRAMA", // post-fight drama

	// pvp states
	"ORIENTING" : "ORIENTING", // state for determining which SS to hit
	"SEARCH" : "SEARCH", // finding enemies
	"PROCESS" : "PROCESS", // processing the found list

	// end state
	"ENDSTATE" : "ENDSTATE" // stops the program.
});

// user constants
var LEADS = ALLLEADS[USER];
var TEAMS = ALLTEAMS[USER];
var COSTS = ALLCOSTS[USER];
var BUYWG = ALLBUYWG[USER];
var ACTIONHP = ALLACTIONHP[USER];
var ACTIONAS = ALLACTIONAS[USER];
var MAXDS = ALLMAXDS[USER];
var ATTACKLEAD = ALLATTACKLEAD[USER];
var ATTACKTEAM = ALLATTACKTEAM[USER];
var ATTACKTEAMCOST = ALLATTACKTEAMCOST[USER];

// other constants
var TIMEOUT = 30000; // number of miliseconds before purging
var MAXATTEMPTS = 100; // max number of search attempts for a ss
var DISPLAYLOGS = false; // displays logging information (leave off)

// state variables
var operation = window.open(HOMEURL); // window being operated.
var state = STATES.BASE; // current state
var timeoutCounter = 0; // counter for determining timeout before purging.
var delay = 5000; // delay between heartbeats
var validTeam = true; // determines whether a team change should occur at base.
var validSession = true; // if session is invalid, do not process any return calls
var investigating = true; // only false when HP has run out.
var isGG = false; // attacking a tower ghost?
var ssFound = ALLSSFOUND[USER]; // if false, steals silver instead.
var stoneid = 1; // current ss id;
var searchAttempts = 0; // searches attempted

// other variables
var currentHP; // last known player HP
var currentas; // last known player AS
var enemy; // last known enemy
var oldenemy; // second last known enemy
var opponents; // list of opponents for pvp
var cost; // cost of team needed
var lead; // lead of team needed
var team; // team needed
var teamData; // team data for checking team set

// locals
var i; // generic for loop counter
var def; // enemy player defense
var ccost; // sum cost of set team during check
var killcost; // determines if there's enough as to go for GG/WG
var negoid; // id of the WG being negociated
var negoidcut // cut positions of the negoid string

function heartbeat() {
	displayLogs("------INIT------");
	if (operation.document) {
		if (operation.document.readyState == 'complete' && operation.$) {
			if (state == STATES.RTB) {
				operation.location.href = HOMEURL;
				delay = 5000;
				state = STATES.BASE;
				timeoutCounter = 0;
			} else if (state == STATES.BASE) {
				if (operation.$(".value") != null && operation.$(".value").length > 7 && operation.$(".current") != null) {
					timeoutCounter = 0;
					console.log("Remaining HP:" + operation.$(".current")[0].innerHTML);
					console.log("Remaining AS:" + operation.$(".value")[7].innerHTML);
					currentHP = parseInt(operation.$(".current")[0].innerHTML, 10);
					currentas = parseInt(operation.$(".value")[7].innerHTML, 10);
					delay = 1000;
					if (validSession && validTeam && enemy == oldenemy) {
						state = STATES.ACTION;
					} else {
						console.log("Invalidating Team");
						cost = COSTS[enemy];
						lead = LEADS[enemy];
						team = TEAMS[enemy];
						validTeam = false;
						if (!cost) {
							cost = ATTACKTEAMCOST;
							lead = ATTACKLEAD;
							team = ATTACKTEAM;
						}
						oldenemy = enemy;
						validSession = true;
						console.log("Resetting Team...");
						state = STATES.RESETTING;
						$.get(BASEURL, {
							_c : "monster",
							action : "resetPriority",
							list_type : "offense"
						}).then(function() {
							if (validSession) {
								console.log("Reset Complete...");
								state = STATES.SETLEAD;
							}
						}, function() {
							timeoutCounter = 99999;
						});
					}
				}
			} else if (state == STATES.SETLEAD) {
				validTeam = false;
				console.log("Setting Lead...");
				timeoutCounter = 0;
				delay = 5000;
				$.get(BASEURL, {
					_c : "monster",
					action : "setLeader",
					inventory_monster_id : lead
				}).then(function() {
					if (validSession) {
						state = STATES.CHECKLEAD;
					}
				}, function() {
					timeoutCounter = 99999;
				});
			} else if (state == STATES.CHECKLEAD) {
				validTeam = false;
				timeoutCounter = 0;
				state = STATES.SETTEAM;
				delay = 5000;
				$.get(TEAMDATAURL).then(function(data) {
					teamData = data;
				}, function() {
					timeoutCounter = 99999;
				});
			} else if (state == STATES.SETTEAM) {
				validTeam = false;
				if (teamData) {
					if (teamData.regularMonsters[0].inventory_monster_id == parseInt(lead, 10)) {
						console.log("Lead Confirmed, Setting Team...");
						timeoutCounter = 0;
						delay = 30000;
						$.post(BASEURL, {
							_c : "monster",
							action : "AttackBulk",
							inventory_monster_ids : team
						}).then(function() {
							if (validSession) {
								state = STATES.CHECKTEAM;
							}
						}, function() {
							timeoutCounter = 99999;
						});
					} else {
						console.log("Lead Incorrect... Resetting...");
					}
					teamData = undefined;
				}
			} else if (state == STATES.CHECKTEAM) {
				validTeam = false;
				timeoutCounter = 0;
				delay = 1000;
				state = STATES.ACTION;
				$.get(TEAMDATAURL).then(function(data) {
					teamData = data;
				}, function() {
					timeoutCounter = 99999;
				});
			} else if (state == STATES.ACTION) {
				ccost = 0;
				if (teamData) {
					for (i = 0; i < 5; i++) {
						ccost += teamData.regularMonsters[i].required_guts;
					}
					teamData = undefined;
				}
				if (validTeam || ccost == cost) {
					console.log("Team Confirmed... Acting...");
					timeoutCounter = 0;
					validTeam = true;
					if (enemy && currentas > cost) {
						operation.window.location = ENCOUNTERURL + enemy + (isGG ? "" : "&encounter_battle_mode=1");
						state = STATES.RETURN;
						delay = 5000;
					} else if (!enemy && (investigating || currentHP >= ACTIONHP)) {
						state = STATES.INVESTIGATE;
					} else if (!enemy && currentas >= ACTIONAS) {
						if (ssFound) {
							stoneid = 1;
							operation.window.location = BATTLESSURL + SSID + stoneid;
							state = STATES.ORIENTING;
						} else {
							stoneid = 0;
							state = STATES.SEARCH;
						}
						delay = 500;
					} else {
						state = STATES.RTB;
						delay = 60 * 1000;
					}

				} else if (ccost > 0 && ccost != cost) {
					validTeam = false;
					console.log("Team Incorrect... Resetting...");
					timeoutCounter = 99999;
				}
			} else if (state == STATES.INVESTIGATE) {
				if (operation.window.location.href.indexOf("npc_battle") != -1) {
					operation.$(operation.$(".button")[0])[0].click();
					delay = 5000;
					enemy = getParameterByName('battle_id', operation.location);
					console.log("Fighting: " + enemy);
					isGG = (enemy.charAt(3) == '5');
					operation.window.location = HOMEURL;
					state = STATES.BASE;
					timeoutCounter = 0;
				} else if (operation.window.location.href.indexOf("negotiation") != -1) {
					if (isGG) {
						operation.window.location = ACCEPTURL;
					} else {
						negoid = $(operation.$(".monster")[0]).children()[0].style.background
						negoidcut = negoid.indexOf("/monsters/");
						negoid = negoid.substring(negoidcut + 10);
						negoidcut = negoid.indexOf("/");
						negoid = negoid.substring(0, negoidcut);
						if ((BUYWG.indexOf(negoid) == -1) || (operation.$("#use-item-button").attr("disabled") == "disabled")) {
							operation.window.location = REJECTURL;
						} else {
							operation.window.location = ACCEPTURL + "&method=use";
						}
					}
					delay = 5000;
					state = STATES.RTB;
					validTeam = false;
					enemy = undefined;
				} else if (operation.window.location.href.indexOf("empty_energy") != -1) {
					state = STATES.RTB;
					investigating = false;
				} else if ((operation.window.location.href.indexOf(TOWERURL) == -1) && (operation.window.location.href.indexOf(TOWERURL2) == -1) && (operation.window.location.href.indexOf(TOWERURL3) == -1)) {
					operation.window.location.href = TOWERURL;
					delay = 5000;
					timeoutCounter = 0;
				} else {
					delay = 1000;
					if (operation.$("#card-acquisition-page").hasClass("ui-page-active")) {
						operation.$(operation.$(".button")[2]).trigger("click");
						timeoutCounter = 0;
					} else if (operation.$("#encounter-other-player-page").hasClass("ui-page-active")) {
						if (operation.$(operation.$(".button")[2]).attr("data-rel") == "back") {
							operation.$(operation.$(".button")[2]).trigger("click");
						} else {
							operation.$(operation.$(".button")[2]).trigger("click");
						}
						timeoutCounter = 0;
					} else if (operation.$("#treasure-acquisition-page").hasClass("ui-page-active")) {
						delay = 2000;
						operation.$(operation.$(".button")[2]).trigger("click");
						timeoutCounter = 0;
					} else if (operation.$("#parts-pvp-acquisition-page").hasClass("ui-page-active")) {
						ssFound = true;
						operation.$("#btn-adventure-l").trigger("click");
						timeoutCounter = 0;
					} else if (operation.$("#event-point-acquisition-page").hasClass("ui-page-active")) {
						operation.$(operation.$(".button")[2]).trigger("click");
						timeoutCounter = 0;
					} else if (operation.$("#level-up-page").hasClass("ui-page-active")) {
						operation.$(operation.$(".button")[2]).trigger("click");
						timeoutCounter = 0;
					} else if (operation.$("#do-adventure")[0]) {
						if (!((operation.$("#do-adventure").hasClass("loading")) || (operation.$("#cut-in-window").css("display") == 'block'))) {
							operation.$("#do-adventure").trigger("click");
							investigating = true;
						}
					}
				}
			} else if (state == STATES.RETURN) {
				if (operation.window.location.href.indexOf("battle_id") != -1) {
					operation.$(operation.$(".button")[0])[0].click();
					state = STATES.DRAMA;
				}
			} else if (state == STATES.DRAMA) {
				if (operation.$ && operation.window.location.href.indexOf("drama_id") != -1) {
					operation.window.location = getParameterByName('next_url', operation.location);
					delay = 5000;
					state = STATES.FIGHT;
					timeoutCounter = 0;
				}
			} else if (state == STATES.FIGHT) {
				if (operation.$ && operation.window.location.href.indexOf("battle_scene") != -1) {
					operation.window.location = RESULTURL + (isGG ? "0" : "1");
					delay = 5000;
					state = STATES.RESULT;
					timeoutCounter = 0;
					enemy = undefined;
				}
			} else if (state == STATES.RESULT) {
				if (operation.$ && operation.window.location.href.indexOf("battle_result") != -1) {
					operation.$(operation.$(".button")[0])[0].click();
					delay = 5000;
					state = STATES.AFTERDRAMA;
					timeoutCounter = 0;
					enemy = undefined;
				}
			} else if (state == STATES.AFTERDRAMA) {
				if (operation.window.location.href.indexOf("drama_id") != -1) {
					operation.window.location = getParameterByName('next_url', operation.location);
					delay = 5000;
					timeoutCounter = 0;
					enemy = undefined;
					state = STATES.INVESTIGATE;
				}
			} else if (state == STATES.ORIENTING) {
				if (!$(operation.document.getElementsByTagName('html')).hasClass('ui-loading') && operation.$(".data")[0]) {
					if (operation.$(".data").children()[1].innerHTML.charAt(0) == "6") {
						timeoutCounter = 0;
						$.get(ACCEPTSSURL + SSID);
						stoneid = 1;
						delay = 5000;
					} else if (operation.$(".data").children()[3].innerHTML.charAt(0) == "0") {
						state = STATES.SEARCH;
						timeoutCounter = 0;
						stoneid = SSID + stoneid;
						searchAttempts = 0;
					} else {
						timeoutCounter = 0;
						delay = 5000;
						stoneid++;
						operation.window.location = BATTLESSURL + SSID + stoneid;
					}
				}
			} else if (state == STATES.SEARCH) {
				if (stoneid == 0) {
					$.get(BATTLEURL, {
						action : "opponents_for_level",
						from_battle_tab : "level"
					}).then(function(data) {
						console.log('Got Opponents');
						opponents = data.opponents;
						timeoutCounter = 0;
						searchAttempts++;
					}, function() {
						state = STATES.SEARCH;
					});
				} else {
					$.get(BATTLEURL, {
						action : "opponents_for_parts",
						from_battle_tab : "parts",
						target_parts_id : stoneid
					}).then(function(data) {
						console.log('Got Opponents');
						opponents = data.opponents;
						timeoutCounter = 0;
						searchAttempts++;
					}, function() {
						state = STATES.SEARCH;
					});
				}
				state = STATES.PROCESS;
			} else if (state == STATES.PROCESS) {
				if (opponents) {
					timeoutCounter = 0;
					for (i = 0; i < opponents.length; i++) {
						def = opponents[i].detail.defense;
						if (def <= MAXDS) {
							console.log("Attacking: " + opponents[i].detail.userId);
							operation.location.href = KILLURL + opponents[i].detail.userId + "&target_parts_id=" + stoneid;
							state = STATES.RTB;
							delay = 5000;
							break;
						}
					}
					if (searchAttempts >= MAXATTEMPTS) {
						state = STATES.RTB;
						searchAttempts = 0;
					}
					opponents = undefined;
					if (state == STATES.PROCESS) {
						state = STATES.SEARCH;
					}
				}
			}
		}
		displayLogs("------END------");
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
	if (validTeam) {
		delay = 5000; // simple reset.
		$.get(WALKURL); // work around for events built into investigation page
		state = STATES.RTB;
	} else {
		investigating = false;
		validSession = false;
		delay = 40000; // wait out all pending team changes.
		operation.location.href = HOMEURL;
		state = STATES.BASE;
	}

	timeoutCounter = 0;
	window.setTimeout(heartbeat, delay);
}

function getParameterByName(name, loc) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(loc.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function displayLogs(title) {
	if (DISPLAYLOGS) {
		console.log(title);
		console.log("state:" + state);
		console.log("timeoutCounter:" + timeoutCounter);
		console.log("delay:" + delay);
		console.log("validTeam:" + validTeam);
		console.log("validSession:" + validSession);
		console.log("investigating:" + investigating);
		console.log("isGG: " + isGG);
		console.log("ssFound" + ssFound);
		console.log("stoneid:" + stoneid);
		console.log("searchAttempts:" + searchAttempts);
	}
}

heartbeat();