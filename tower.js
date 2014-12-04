var EVID = 74;

var investURL = "http://zc2.ayakashi.zynga.com/app.php?_c=extra_quest_event_adventure&evid=" + EVID;
var altInvestURL = "http://zc2.ayakashi.zynga.com/app.php?evid=" + EVID + "&_c=extra_quest_event_adventure";
var altInvestURL2 = "http://zc2.ayakashi.zynga.com/app.php?island_id=1&area_id=1&stage_id=1&no_drama=1&evid=74&newest=1&_c=ExtraQuestEventAdventure&action=stagehttp://zc2.ayakashi.zynga.com/app.php?island_id=1&area_id=1&stage_id=1&no_drama=1&evid=" + EVID + "&newest=1&_c=ExtraQuestEventAdventure&action=stage"
var baseURL = "http://zc2.ayakashi.zynga.com/app.php?";
var homeURL = "http://zc2.ayakashi.zynga.com/app.php?_c=entry&action=mypage";
var resultURL = "http://zc2.ayakashi.zynga.com/app.php?hid=0&encounter_battle_mode=1&evid=" + EVID + "&_c=extra_quest_event_npc_battle&action=battle_result";
var encounterURL = "http://zc2.ayakashi.zynga.com/app.php?&encounter_battle_mode=1&evid=" + EVID + "&_c=extra_quest_event_npc_battle&action=confirm&battle_id=";
var acceptURL = "http://zc2.ayakashi.zynga.com/app.php?_c=extra_quest_event_negotiation&action=negotiate&method=use&evid=" + EVID;
var rejectURL = "http://zc2.ayakashi.zynga.com/app.php?_c=extra_quest_event_negotiation&action=resign&evid=" + EVID;

var SKIP = 999;

var leads = {
    "101527" : "20686",
    "101528" : "51852",
    "101529" : "21736",
    "101530" : "103826"
}

var teams = {
    "101527" : "21736,21917,77312,51852",
    "101528" : "21736,21917,77312,52060",
    "101529" : "95937,93019,64128,52060",
    "101530" : "60512,64128,52060,130"
}

var costs = {
    "101527" : 24,
    "101528" : 36,
    "101529" : 63,
    "101530" : 102
}

var INVEST = 0;
var DRAMA = 1;
var FIGHT = 2;
var RESULT = 3;
var AFTERDRAMA = 4;
var NEGO = 5;
var ENDNEGO = 6;
var ENDSTATE = 7;
var HOME = 998;
var WAIT = 999;
var RETURN = 997;
var RECOVER = 996;

var current = 0;
var max = 30;
var state = ENDSTATE;
var lead = "";
var team = "";
var enemy = "";
var cost = 999;
var invest = window.open(investURL);
var recoverCount = 0;

function click() {
    var delay = 1000;
    if (invest.document.readyState == 'complete') {
        if (state == INVEST && invest.window.location.href.indexOf("battle_id") != -1) {
            enemy = getParameterByName('battle_id', invest.location)
            cost = costs[enemy];
            if (cost != undefined) {
                if (cost == SKIP) {
                    console.log("Skipping: " + enemy);
                    invest.window.location = "about:blank";
                    state = RECOVER;
                } else {
                    console.log("Fighting: " + enemy);
                    invest.window.location = homeURL;
                    state = HOME;
                }
            } else {
                state = ENDSTATE;
            }
        } else if (state == HOME) {
            if (invest.window.location == homeURL) {
                if (invest.document.readyState == 'complete' && invest.$ && invest.$(".value") != null && invest.$(".value").length > 7) {
                    console.log("Remaining AS:" + invest.$(".value")[7].innerHTML);
                    if (parseInt(invest.$(".value")[7].innerHTML) >= cost) {
                        console.log("Resetting Team...");
                        lead = leads[enemy];
                        team = teams[enemy];
                        $.get(baseURL, {
                            _c : "monster",
                            action : "resetPriority",
                            list_type : "offense"
                        }).then(function() {
                            console.log("Reset Complete, Setting Leader...");
                            $.get(baseURL, {
                                _c : "monster",
                                action : "setLeader",
                                inventory_monster_id : lead
                            });
                        }, function() {
                            console.log("Failed, Stopping");
                            state = 7;
                        }).then(function() {
                            window.setTimeout(function() {
                                console.log("Leader Set, Setting Team...");
                                $.post(baseURL, {
                                    _c : "monster",
                                    action : "AttackBulk",
                                    inventory_monster_ids : team
                                }).then(window.setTimeout(function() {
                                    invest.window.location = encounterURL + enemy;
                                    state = RETURN;
                                    console.log("Team Set, Returning...");
                                }, 20000));
                            }, 3000);
                        }, function() {
                            console.log("Failed, Stopping");
                            state = 7;
                        });
                        state = WAIT;
                    } else {
                        state = ENDSTATE;
                    }
                }
            }
        } else if (invest.$ && state == RETURN) {
            if (invest.window.location.href.indexOf("battle_id") != -1) {
                invest.$(invest.$(".button")[0])[0].click();
                state = DRAMA;
            }
        } else if (state == DRAMA) {
            if (invest.window.location.href.indexOf("drama_id") != -1) {
                invest.window.location = getParameterByName('next_url', invest.location);
                state = FIGHT;
            }
        } else if (state == FIGHT) {
            if (invest.window.location.href.indexOf("battle_scene") != -1) {
                invest.window.location = resultURL;
                state = RESULT;
            }
        } else if (invest.$ && state == RESULT) {
            if (invest.window.location.href.indexOf("battle_result") != -1) {
                invest.$(invest.$(".button")[0])[0].click();
                state = AFTERDRAMA;
            }
        } else if (state == AFTERDRAMA) {
            if (invest.window.location.href.indexOf("drama_id") != -1) {
                invest.window.location = getParameterByName('next_url', invest.location);
            } else if (invest.window.location.href.indexOf("negotiation") != -1) {
                invest.window.location = "about:blank";
                state = NEGO;
            }
        } else if (state == NEGO) {
            invest.window.location = rejectURL;
            state = INVEST;
            lead = "";
            team = "";
            enemy = "";
            cost = 999;
            console.log("Fighting Finished");
        } else if (invest.window.location.href.indexOf("empty_energy") != -1) {
            state = ENDSTATE;
        } else if (state != WAIT && state != HOME && state != RETURN && state != RECOVER && invest.$ && invest.window.location.href.indexOf(investURL) == -1 && invest.window.location.href.indexOf(altInvestURL) == -1 && invest.window.location.href.indexOf(altInvestURL2) == -1) {
            invest.window.location = "about:blank";
            state = RECOVER;
        } else if (state == RECOVER) {
            invest.window.location.href = investURL;
            state = INVEST;
        } else if (invest.$) {
            if (invest.$("#card-acquisition-page").hasClass("ui-page-active")) {
                current = parseInt($(invest.$(".current")[0]).html());
                max = parseInt($(invest.$(".max")[0]).html());
                if (current == max) {
                    state = ENDSTATE;
                    console.log("Inventory Full, Ending");
                }
                invest.$(invest.$(".button")[2]).trigger("click");
            } else if (invest.$("#event-point-acquisition-page").hasClass("ui-page-active")) {
                invest.$(invest.$(".button")[2]).trigger("click");
            } else if (invest.$("#level-up-page").hasClass("ui-page-active")) {
                invest.$(invest.$(".button")[2]).trigger("click");
            } else if (invest.$("#treasure-acquisition-page").hasClass("ui-page-active")) {
                delay = 2000;
                invest.$(invest.$(".button")[2]).trigger("click");
            } else {
                if (!(invest.$("#do-adventure").hasClass("loading"))) {
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
    invest.window.location = "about:blank";
    if (state == ENDSTATE) {
        state = RECOVER;
        click();
    } else {
        state = RECOVER;
    }
}

function reattack() {
    console.log("Fighting: " + enemy);
    cost = costs[enemy];
    invest.window.location = "about:blank";
    window.setTimeout(function() {
        if (state == ENDSTATE) {
            invest.window.location = homeURL;
            state = HOME;
            click();
        } else {
            invest.window.location = homeURL;
            state = HOME;
        }
    }, 1000);

}

cycle();