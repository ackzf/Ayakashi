//walks the specified game location endlessly. Negociates without chains.
var investURL = "http://zc2.ayakashi.zynga.com/app.php?_c=adventure&action=stage&island_id=17&area_id=63&stage_id=269";
var remURL = "http://zc2.ayakashi.zynga.com/app.php?_c=item&action=use&item_id=4";

var INVEST = 0;
var DRAMA = 1;
var FIGHT = 2;
var RESULT = 3;
var NEGO = 4;
var ENDNEGO = 5;
var ENDSTATE = 6;

var WAIT = 999;

var current = 0;
var max = 30;
var state = 0;
var invest = window.open(investURL);
var rem = true; // set to false if not remming.

function click() {
	var delay = 1000;
	console.log(current + "/" + max);
	if (invest.document.readyState == 'complete') {
		if (state == INVEST && invest.$ && invest.window.location.href.indexOf("npc_battle") != -1) {
			invest.$(invest.$(".button")[0])[0].click();
			state = DRAMA;
		} else if (state == DRAMA) {
			if (invest.$ && invest.window.location.href.indexOf("drama_id") != -1) {
				invest.window.location = getParameterByName('next_url', invest.location);
				state = FIGHT;
			}
		} else if (state == FIGHT) {
			if (invest.$ && invest.window.location.href.indexOf("battle_scene") != -1) {
				invest.window.location = "http://zc2.ayakashi.zynga.com/app.php?hid=0&encounter_battle_mode=0&_c=npc_battle&action=battle_result";
				state = RESULT;
			}
		} else if (state == RESULT) {
			if (invest.$ && invest.window.location.href.indexOf("battle_result") != -1) {
				invest.$(invest.$(".button")[0])[0].click();
				state = NEGO;
			}
		} else if (state == NEGO) {
			if (invest.$ && invest.window.location.href.indexOf("negotiation") != -1) {
				invest.$(invest.$(".button")[0])[0].click();
				state = ENDNEGO;
			}
		} else if (invest.window.location.href.indexOf("empty_energy") != -1) {
			if (rem) {
				invest.window.location.href = remURL;
				state = INVEST;
			}
		} else if (state == WAIT) {
			invest.window.location.href = investURL;
			state = INVEST;
		} else if (invest.window.location.href.indexOf(investURL) == -1) {
			if (invest.$) {
				invest.window.location.href = "about:blank";
				state = WAIT;
			}
		} else {
			if (invest.$("#card-acquisition-page").hasClass("ui-page-active")) {
				current = parseInt($(invest.$(".current")[0]).html());
				max = parseInt($(invest.$(".max")[0]).html());
				if (current == max)
					state = ENDSTATE;
				invest.$(invest.$(".button")[3]).trigger("click");
			} else if (invest.$("#encounter-other-player-page").hasClass("ui-page-active")) {
				if (invest.$(invest.$(".button")[3]).attr("data-rel") == "back")
					invest.$(invest.$(".button")[3]).trigger("click");
				else
					invest.$(invest.$(".button")[4]).trigger("click");
			} else if (invest.$("#treasure-acquisition-page").hasClass("ui-page-active")) {
				delay = 2000;
				invest.$(invest.$(".button")[3]).trigger("click");
			} else if (invest.$("#parts-pvp-acquisition-page").hasClass("ui-page-active")) {
				invest.$("#btn-adventure-l").trigger("click");
			} else {
				if (!((invest.$("#do-adventure").hasClass("loading")) || (invest.$("#cut-in-window").css("display") == 'block'))) {
					if (current < max) {
						invest.$("#do-adventure").trigger("click");
					} else {
						state = ENDSTATE;
					}
				}
			}
		}
	}
	if (state != ENDSTATE)
		window.setTimeout(click, delay);
}

function getParameterByName(name, loc) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(loc.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function cycle() {
	state = INVEST;
	invest.window.location = investURL;
	click();
}

cycle();