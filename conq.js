var GCQ = "guild_raid_event";
var SCQ = "raid_event";

var EVID = 77;
var eventType = GCQ;

var fightURL = "http://zc2.ayakashi.zynga.com/app.php?_c=" + eventType + "&action=exec_battle&evid=" + EVID;
var investURL = "http://zc2.ayakashi.zynga.com/app.php?_c=adventure&action=stage&island_id=3&area_id=8&stage_id=11";
var waterURL = "http://zc2.ayakashi.zynga.com/app.php?_c=item&action=use&item_id=5";
var endURL = "http://zc2.ayakashi.zynga.com/app.php?evid=" + EVID + "&_c=" + eventType;
var cancelURL = "http://zc2.ayakashi.zynga.com/app.php?_c=" + eventType + "&action=exec_battle&evid=" + EVID;

var STOPHP = 15000; // if enemy has this amount of HP or less, only hit once.

var continuous = false; // true to investigate for more, false to stop when beast is killed
var water = true; // true to auto water, false to stop when out of spirit

var INVESTIGATE = 0;
var CONQ = 1;
var ENDSTATE = 2;

var ATTACKING = 0;
var WAITING = 1;
var DRINKING = 2;
var RECOVERING = 3;

var current = 0;
var max = 30;
var HP = 15001;

var state = INVESTIGATE;
var substate = 0;
var wait = false;

var a = window.open("about:blank");

function click() {
	//console.log("State: " + state);
	//console.log("Substate: " + substate);
	//console.log(current + "/" + max);
	//console.log("HP: " + HP);
	//console.log("Wait: " + wait);
	var delay = 1000;
	if (state == INVESTIGATE) {
		if (a.window.location.href.indexOf("encounter") != -1) {
			a.window.location.href = investURL;
		} else if (a.window.location.href.indexOf("empty_energy") != -1) {
			state = CONQ;
			substate = ATTACKING;
			a.window.location.href = "about:blank";
			wait = false;
		} else if (a.window.location.href.indexOf(investURL) == -1) {
			a.window.location.href = investURL;
		} else {
			if (a.document.readyState == 'complete' && a.$) {
				if ($(a.$(".has-active-enemy")[0]).hasClass("on")) {
					state = CONQ;
					substate = ATTACKING;
					a.window.location.href = "about:blank";
					wait = false;
				} else if (a.$("#card-acquisition-page").hasClass("ui-page-active")) {
					current = parseInt($(a.$(".current")[0]).html());
					max = parseInt($(a.$(".max")[0]).html());
					if (current == max)
						state = ENDSTATE;
					a.$(a.$(".button")[3]).trigger("click");
				} else if (a.$("#encounter-other-player-page").hasClass("ui-page-active")) {
					if (a.$(a.$(".button")[3]).attr("data-rel") == "back")
						a.$(a.$(".button")[3]).trigger("click");
					else
						a.$(a.$(".button")[4]).trigger("click");
				} else if (a.$("#treasure-acquisition-page").hasClass("ui-page-active")) {
					delay = 2000;
					a.$(a.$(".button")[3]).trigger("click");
				} else if (a.$("#parts-pvp-acquisition-page").hasClass("ui-page-active")) {
					a.$("#btn-adventure-l").trigger("click");
				} else {
					if (!(a.$("#do-adventure").hasClass("loading"))) {
						if (current < max) {
							a.$("#do-adventure").trigger("click");
						} else {
							state = ENDSTATE;
						}
					}
				}
			}
		}
	} else if (state == CONQ) {
		if (!wait && (a.$ && a.$(a.$("#errors-403")).length > 0 || a.window.location.href == fightURL)) {
			a.window.location.href = "about:blank";
			substate = RECOVERING;
		} else if (substate == WAITING && !wait && a.window.location.href.indexOf("empty_energy") != -1) {
			if (water) {
				substate = DRINKING;
				a.window.location.href = waterURL;
				wait = true;
			} else
				substate = ENDSTATE;
		} else if (a.window.location.href == endURL || a.window.location.href == cancelURL) {
			if (!wait && continuous) {
				state = INVESTIGATE;
				a.window.location.href = investURL;
				wait = true;
			} else if (!wait && !continuous)
				state = ENDSTATE;
		} else if (!wait) {
			if (substate == DRINKING && a.window.location.href.indexOf("use") != -1) {
				substate = ATTACKING;
			} else if (substate == ATTACKING) {
				if (HP > STOPHP) {
					a.window.location.href = fightURL;
					substate = WAITING;
					wait = true;
				} else
					state = ENDSTATE;
			} else if (substate == WAITING || substate == RECOVERING) {
				a.window.location.href = "about:blank";
				resetCounter = 0;
				substate = ATTACKING;
			}
		} else if (a.document.readyState == 'complete' && a.$) {
			wait = false;
			if (a.window.location.href.indexOf("battle_scene") != -1 && a.document.readyState == 'complete' && a.$) {
				HP = parseInt(a.$(a.$(".asset")[1]).attr("data-max-hit-point"));
			}
			//console.log(HP);
		}
	}
	if (state != ENDSTATE)
		window.setTimeout(click, 1000);
}

function cycle() {
	HP = 15001;
	state = INVESTIGATE;
	substate = ATTACKING;
	wait = false;
	a.window.location.href = investURL;
	window.setTimeout(click, 1000);
}

cycle();
