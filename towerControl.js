//Auto Tower Runner

var EVID = 80;
var SSID = "1599";  //tower SS monster ID;

var investURL = "http://zc2.ayakashi.zynga.com/app.php?_c=extra_quest_event_adventure&evid=" + EVID;
var altInvestURL = "http://zc2.ayakashi.zynga.com/app.php?evid=" + EVID + "&_c=extra_quest_event_adventure";
var altInvestURL2 = "http://zc2.ayakashi.zynga.com/app.php?island_id=1&area_id=1&stage_id=1&no_drama=1&evid=" + EVID + "&newest=1&_c=ExtraQuestEventAdventure&action=stage";
var resultURL = "http://zc2.ayakashi.zynga.com/app.php?hid=0&evid=" + EVID + "&_c=extra_quest_event_npc_battle&action=battle_result&encounter_battle_mode=";
var homeURL = "http://zc2.ayakashi.zynga.com/app.php?_c=entry&action=mypage";
var killURL = "http://zc2.ayakashi.zynga.com/app.php?_c=battle&action=exec_battle&from_battle_tab=&ref=undefined&target_user_id=";
var baseURL = "http://zc2.ayakashi.zynga.com/app.php?";
var battleURL = "http://zc2.ayakashi.zynga.com/app.php?_c=battle";
var encounterURL = "http://zc2.ayakashi.zynga.com/app.php?&evid=" + EVID + "&_c=extra_quest_event_npc_battle&action=confirm&battle_id=";
var acceptURL = "http://zc2.ayakashi.zynga.com/app.php?_c=extra_quest_event_negotiation&action=negotiate&evid=" + EVID;
var rejectURL = "http://zc2.ayakashi.zynga.com/app.php?_c=extra_quest_event_negotiation&action=resign&evid=" + EVID;
var teamDataURL = "http://zc2.ayakashi.zynga.com/app.php?_c=monster&action=jsonlist&list_type=offense&order_by=attack-desc";
var investigateURL = "http://zc2.ayakashi.zynga.com/app.php?_c=ExtraQuestEventAdventure&action=proceed&island_id=1&evid=" + EVID + "&newest=1";

var ORIENTING = 0;
var REFRESH = 1;
var SEARCH = 2;
var ATTACKING = 3;
var BASE = 4;
var ENDSTATE = 5;
var INVEST = 1000;
var RETURN = 1001;
var DRAMA = 1002;
var FIGHT = 1003;
var RESULT = 1004;
var AFTERDRAMA = 1005;
var WAIT = 100999;
var RESETCOMPLETE = 100998;
var LEADING = 100997;
var LEADCOMPLETE = 100996;
var TEAMING = 100995;
var TEAMCOMPLETE = 100994;
var REPLACELEAD = 100993;

var allleads = {
	"A" : {
		"10101590" : "51852",
		"10101591" : "62039",
		"10101592" : "88738",
		"10101593" : "54046",
		"10101594" : "86438",
		"10101595" : "115867"
	},
	"K" : {
		"10101590" : "26116",
		"10101591" : "26232",
		"10101592" : "27250",
		"10101593" : "26232"
	}
};

var allteams = {
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
		"10101592" : "27250,27251,27252,30476"
	}
};

var allcosts = {
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

var allmaxHP = {
	"A" : 600,
	"K" : 200
};
var allasCost = {
	"A" : 100,
	"K" : 100
};
var allmaxDS = {
	"A" : 15,
	"K" : 15
};
var allggLead = {
	"A" : "68293",
	"K" : "27250"
};
var allggTeam = {
	"A" : "77859,22559,21917,21736",
	"K" : "30501,30506,30485,30476"
};
var allggTeamCost = {
	"A" : 51,
	"K" : 44
};
var allggCost = {
	"A" : 39,
	"K" : 32
};

var user = "A";

//DO NOT EDIT
var leads = allleads[user];
var teams = allteams[user]
var costs = allcosts[user]
var maxHP = allmaxHP[user]
var asCost = allasCost[user]
var maxDS = allmaxDS[user]
var ggLead = allggLead[user]
var ggTeam = allggTeam[user]
var ggTeamCost = allggTeamCost[user]
var ggCost = allggCost[user]

var validTeam = true;
var validSession = true;
var timeoutCounter = 0;
var stoneid = 0;
var delay = 5000;
var TIMEOUT = 30000;
var current = 0;
var max = 30;
var state = BASE;
var search = window.open(homeURL);
var invest = search;
var currentHP;
var currentas;
var enemy;
var oldenemy;
var opponents;
var cost;
var lead;
var team;
var teamData;
var isGG = false;

// locals
var line;
var cut;
var stoneidt;
var i;
var def;
var ccost;
var killcost;

function heartbeat() {
//	console.log("-------------");
//	console.log("validTeam:" + validTeam);
//	console.log("validSession:" + validSession);
//	console.log("timeoutCounter:" + timeoutCounter);
//	console.log("stoneid:" + stoneid);
//	console.log("delay:" + delay);
//	console.log("state:" + state);
	if (search.document) {
		if (search.document.readyState == 'complete' && search.$) {
			if (state == ORIENTING) {
				delay = 1000;
				if (!$(search.document.getElementsByTagName('html')).hasClass('ui-loading') && search.$(".monster-parts")[0]) {
					stoneid = 0;
					line = search.$(".monster-parts")[0].innerHTML;
					cut = line.indexOf("monsters");
					line = line.substring(cut + 9);
					cut = line.indexOf("/");
					line = line.substring(0, cut);
					if (line == SSID) {
						for (stoneidt = 1; stoneidt < 7; stoneidt++) {
							if ($(search.$(".monster-parts")[0]).hasClass("attribute-" + stoneidt)) {
								stoneid = SSID + stoneidt;
								console.log("Current Stone ID: " + stoneid);
								break;
							}
						}
						if (stoneid != 0) {
							state = REFRESH;
							timeoutCounter = 0;
						}
					} else {
						state = REFRESH;
						timeoutCounter = 0;
					}
				}
			} else if (state == REFRESH) {
				if (stoneid == 0) {
					$.get(battleURL, {
						action : "opponents_for_level",
						from_battle_tab : "level"
					}).then(function(data) {
						console.log('Got Opponents');
						opponents = data.opponents;
						timeoutCounter = 0;
					}, function() {
						state = REFRESH;
					});
				} else {
					$.get(battleURL, {
						action : "opponents_for_parts",
						from_battle_tab : "parts",
						target_parts_id : stoneid
					}).then(function(data) {
						console.log('Got Opponents');
						opponents = data.opponents;
						timeoutCounter = 0;
					}, function() {
						state = REFRESH;
					});
				}
				state = SEARCH;
			} else if (state == SEARCH) {
				if (opponents) {
					timeoutCounter = 0;
					for (i = 0; i < opponents.length; i++) {
						def = opponents[i].detail.defense;
						if (def <= maxDS) {
							console.log("Attacking: " + opponents[i].detail.userId);
							search.location.href = killURL + opponents[i].detail.userId + "&target_parts_id=" + stoneid;
							state = ATTACKING;
							delay = 5000;
							break;
						}
					}
					opponents = undefined;
					if (state == SEARCH) {
						state = REFRESH;
					}
				}
			} else if (state == ATTACKING) {
				search.location.href = homeURL;
				delay = 5000;
				state = BASE;
				timeoutCounter = 0;
			} else if (state == BASE) {
				if (search.$(".value") != null && search.$(".value").length > 7 && search.$(".current") != null) {
					timeoutCounter = 0;
					console.log("Remaining HP:" + search.$(".current")[0].innerHTML);
					console.log("Remaining AS:" + search.$(".value")[7].innerHTML);
					currentHP = parseInt(search.$(".current")[0].innerHTML, 10);
					currentas = parseInt(search.$(".value")[7].innerHTML, 10);
					delay = 1000;
					if (validSession && validTeam && enemy == oldenemy) {
						state = TEAMCOMPLETE;
					} else {
						console.log("Invalidating Team");
						cost = costs[enemy];
						lead = leads[enemy];
						team = teams[enemy];
						validTeam = false;
						if (!cost) {
							cost = ggTeamCost;
							lead = ggLead;
							team = ggTeam;
						}
						oldenemy = enemy;
						validSession = true;
						console.log("Resetting Team...");
						state = WAIT;
						$.get(baseURL, {
							_c : "monster",
							action : "resetPriority",
							list_type : "offense"
						}).then(function() {
							if (validSession) {
								console.log("Reset Complete...");
								state = RESETCOMPLETE;
							}
						}, function() {
							timeoutCounter = 99999;
						});
					}
				}
			} else if (state == RESETCOMPLETE) {
				validTeam = false;
				console.log("Setting Lead...");
				timeoutCounter = 0;
				delay = 5000;
				$.get(baseURL, {
					_c : "monster",
					action : "setLeader",
					inventory_monster_id : lead
				}).then(function() {
					if (validSession) {
						state = LEADING;
					}
				}, function() {
					timeoutCounter = 99999;
				});
			} else if (state == LEADING) {
				validTeam = false;
				timeoutCounter = 0;
				state = LEADCOMPLETE;
				delay = 5000;
				$.get(teamDataURL).then(function(data) {
					teamData = data;
				}, function() {
					timeoutCounter = 99999;
				});
			} else if (state == LEADCOMPLETE) {
				validTeam = false;
				if (teamData) {
					if (teamData.regularMonsters[0].inventory_monster_id == parseInt(lead, 10)) {
						console.log("Lead Confirmed, Setting Team...");
						timeoutCounter = 0;
						delay = 30000;
						$.post(baseURL, {
							_c : "monster",
							action : "AttackBulk",
							inventory_monster_ids : team
						}).then(function() {
							if (validSession) {
								state = TEAMING;
							}
						}, function() {
							timeoutCounter = 99999;
						});
					} else {
						console.log("Lead Incorrect... Resetting...");
					}
					teamData = undefined;
				}
			} else if (state == TEAMING) {
				validTeam = false;
				timeoutCounter = 0;
				delay = 1000;
				state = TEAMCOMPLETE;
				$.get(teamDataURL).then(function(data) {
					teamData = data;
				}, function() {
					timeoutCounter = 99999;
				});
			} else if (state == TEAMCOMPLETE) {
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
					if (cost == ggTeamCost) {
						killcost = ggCost;
					} else {
						killcost = cost;
					}
					if (enemy && currentas > killcost) {
						invest.window.location = encounterURL + enemy + (isGG ? "" : "&encounter_battle_mode=1");
						state = RETURN;
						delay = 5000;
					} else if (!enemy && currentHP >= maxHP) {
						state = INVEST;
					} else if (!enemy && currentas >= asCost) {
						invest.window.location = battleURL;
						state = ORIENTING;
						delay = 500;
					} else {
						state = ATTACKING;
						delay = 60 * 1000;
					}

				} else if (ccost > 0 && ccost != cost) {
					validTeam = false;
					console.log("Team Incorrect... Resetting...");
					timeoutCounter = 99999;
				}
			} else if (state == RETURN) {
				if (invest.window.location.href.indexOf("battle_id") != -1) {
					invest.$(invest.$(".button")[0])[0].click();
					state = DRAMA;
				}
			} else if (state == DRAMA) {
				if (invest.$ && invest.window.location.href.indexOf("drama_id") != -1) {
					invest.window.location = getParameterByName('next_url', invest.location);
					delay = 5000;
					state = FIGHT;
					timeoutCounter = 0;
				}
			} else if (state == FIGHT) {
				if (invest.$ && invest.window.location.href.indexOf("battle_scene") != -1) {
					invest.window.location = resultURL + ((isGG) ? "0" : "1");
					delay = 5000;
					state = RESULT;
					timeoutCounter = 0;
					enemy = undefined;
				}
			} else if (state == RESULT) {
				if (invest.$ && invest.window.location.href.indexOf("battle_result") != -1) {
					invest.$(invest.$(".button")[0])[0].click();
					delay = 5000;
					state = AFTERDRAMA;
					timeoutCounter = 0;
					enemy = undefined;
				}
			} else if (state == AFTERDRAMA) {
				if (invest.window.location.href.indexOf("drama_id") != -1) {
					invest.window.location = getParameterByName('next_url', invest.location);
					delay = 5000;
					timeoutCounter = 0;
					enemy = undefined;
					state = INVEST;
				}
			} else if (invest.$ && invest.window.location.href.indexOf("negotiation") != -1) {
				if (isGG) {
					invest.window.location = acceptURL;
				}
				invest.window.location = rejectURL;
				delay = 5000;
				state = BASE;
				validTeam = false;
				enemy = undefined;
			} else if (state == INVEST) {
				if (invest.window.location.href.indexOf("npc_battle") != -1) {
					invest.$(invest.$(".button")[0])[0].click();
					delay = 5000;
					enemy = getParameterByName('battle_id', invest.location);
					console.log("Fighting: " + enemy);
					isGG = (enemy.charAt(3) == '5');
					invest.window.location = homeURL;
					state = BASE;
					timeoutCounter = 0;
				} else if (invest.window.location.href.indexOf("empty_energy") != -1) {
					state = ATTACKING;
				} else if (invest.window.location.href.indexOf(investURL) == -1) {
					invest.window.location.href = investURL;
					delay = 5000;
					timeoutCounter = 0;
				} else {
					delay = 1000;
					if (invest.$("#card-acquisition-page").hasClass("ui-page-active")) {
						current = parseInt($(invest.$(".current")[0]).html(), 10);
						max = parseInt($(invest.$(".max")[0]).html(), 10);
						if (current == max) {
							state = ATTACKING;
						}
						invest.$(invest.$(".button")[2]).trigger("click");
						timeoutCounter = 0;
					} else if (invest.$("#encounter-other-player-page").hasClass("ui-page-active")) {
						if (invest.$(invest.$(".button")[2]).attr("data-rel") == "back") {
							invest.$(invest.$(".button")[2]).trigger("click");
						} else {
							invest.$(invest.$(".button")[2]).trigger("click");
						}
						timeoutCounter = 0;
					} else if (invest.$("#treasure-acquisition-page").hasClass("ui-page-active")) {
						delay = 2000;
						invest.$(invest.$(".button")[2]).trigger("click");
						timeoutCounter = 0;
					} else if (invest.$("#parts-pvp-acquisition-page").hasClass("ui-page-active")) {
						invest.$("#btn-adventure-l").trigger("click");
						timeoutCounter = 0;
					} else if (invest.$("#event-point-acquisition-page").hasClass("ui-page-active")) {
						invest.$(invest.$(".button")[2]).trigger("click");
						timeoutCounter = 0;
					} else if (invest.$("#level-up-page").hasClass("ui-page-active")) {
						invest.$(invest.$(".button")[2]).trigger("click");
						timeoutCounter = 0;
					} else if (invest.$("#do-adventure")[0]) {
						if (!((invest.$("#do-adventure").hasClass("loading")) || (invest.$("#cut-in-window").css("display") == 'block'))) {
							if (current < max) {
								invest.$("#do-adventure").trigger("click");
							} else {
								state = ATTACKING;
							}
						}
					}
				}
			}
		}
		if (timeoutCounter > TIMEOUT / delay) {
			console.log("Timeout");
			purge();
		} else {
			timeoutCounter++;
			if (state != ENDSTATE) {
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
		delay = 5000;  // simple reset.
		$.get(investigateURL);
	} else {
	  validSession = false;
		delay = 40000; // wait out all pending team changes.
	}
	search.location.href = homeURL;
	state = BASE;
	timeoutCounter = 0;
	window.setTimeout(heartbeat, delay);
}

function getParameterByName(name, loc) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(loc.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

heartbeat();