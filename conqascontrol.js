//periodically summons a conq beast to kill depending on the desired AS value regenerated to.

var EVID = 76;

var fightURL = "http://zc2.ayakashi.zynga.com/app.php?_c=raid_event&action=exec_battle&evid=" + EVID;
var investURL = "http://zc2.ayakashi.zynga.com/app.php?_c=adventure&action=stage&island_id=3&area_id=8&stage_id=11";
var endURL = "http://zc2.ayakashi.zynga.com/app.php?evid=" + EVID + "&_c=raid_event";
var mainWindowURL = "http://zc2.ayakashi.zynga.com/app.php?_c=entry&action=mypage";

var maxAS = 344; //maximum AS
var asControl = []; //cap AS targets for each level.

var INVESTIGATE = 0;
var CONQ = 1;
var ENDSTATE = 2;

var ATTACKING = 0; // endInvest
var WAITING = 1;
var DRINKING = 2;
var RECOVERING = 3;

var state = INVESTIGATE;
var substate = 0;
var wait = false;
var continueCheck = false;

var a = window.open("about:blank");

function click() {
	console.log("State: " + state);
	console.log("Substate: " + substate);
	console.log("Wait: " + wait);
	var delay = 1000;
	if (state == INVESTIGATE) {
		if (a.document.readyState == 'complete' && a.$) {
			if (a.window.location.href.indexOf("empty_energy") != -1) {
				state = CONQ;
				substate = ATTACKING;
				a.window.location.href = "about:blank";
				wait = false;
			} else if (a.window.location.href.indexOf(investURL) == -1) {
				a.window.location.href = investURL;
			} else {
				if (a.document.readyState == 'complete' && a.$) {
					if (a.$("#card-acquisition-page").hasClass("ui-page-active")) {
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
							a.$("#do-adventure").trigger("click");
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
			state = ENDSTATE;
		} else if (a.window.location.href == endURL) {
			state = ENDSTATE;
		} else if (!wait) {
			if (substate == ATTACKING) {
				a.window.location.href = fightURL;
				substate = WAITING;
				wait = true;
			} else if (substate == WAITING || substate == RECOVERING) {
				a.window.location.href = "about:blank";
				resetCounter = 0;
				substate = ATTACKING;
			}
		} else if (a.document.readyState == 'complete' && a.$) {
			wait = false;
		}
	}
	if (state == ENDSTATE){
		a.window.location.href = "about:blank";
		window.setTimeout(heartbeat, 3000);
	}
	else
		window.setTimeout(click, 1000);
}

function heartbeat() {
	a.window.location.href = mainWindowURL;
	checkAS();
}

function checkAS() {
	if (a.window && a.document && a.document.readyState == 'complete' && a.$) {
		if (a.window.location.href != mainWindowURL) {
			a.window.location.href = mainWindowURL;
			continueCheck = true;
		} else if (a.$(".value") != null && a.$(".value").length > 7) {
			console.log("Remaining AS:" + a.$(".value")[7].innerHTML);
			var currentas = parseInt(a.$(".value")[7].innerHTML);
			state = INVESTIGATE;
			substate = ATTACKING;
			wait = false;
			a.window.location.href = investURL;
			var killcount = 0;
			var kills = a.$(".openface-num")[1].innerHTML;
			if (kills != "---")
				killcount = parseInt(kills);
			if (killcount < asControl.length)
				window.setTimeout(click, 1000 * 60 * (asControl[killcount] - currentas));
			else
				window.setTimeout(click, 1000 * 60 * (maxAS - currentas));
			continueCheck = false;
		}
	} else {
		continueCheck = true;
	}
	if (continueCheck)
		window.setTimeout(checkAS, 1000);
}

heartbeat();