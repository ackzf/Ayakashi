//automatically feeds normal magatama to the selected daemon. Set order to "Highest Spirit Req First" before using.

var fusionURL = "http://zc2.ayakashi.zynga.com/app.php?_c=merge";

var a = window.open(fusionURL);
var activated = true;
var level = 0;
var continueClick = true;

function heartbeat() {
	console.log("beat, level: " + level);
	if (a.document.readyState == 'complete' && a.$ && a.$(".level").length > 0) {
		level = parseInt(a.$(a.$(".level")[1]).children().children()[1].innerHTML);
		var targetsrc = a.$(a.$(".thumb")[1]).children()[0].src;
		var acqid = targetsrc.substring(targetsrc.indexOf("monsters") + 9);
		acqid = parseInt(acqid.substring(0, acqid.indexOf("/")));
		var select = (acqid > 112 && acqid < 122) || (acqid > 203 && acqid < 207);
//		var select = (acqid == 113);
		if ((select) && a.$(a.$(".level")[0])[0].innerHTML.indexOf("level_cap") == -1) {
			a.$(a.$(".btn-merge")[0]).click();
			a.$(a.$("#button-merge"))[0].click();
			activated = true;
		} else {
			continueClick = false;
		}
	} else if (activated) {
		a.window.location.href = fusionURL;
		activated = false;
	}
	if (continueClick)
		window.setTimeout(heartbeat, 2000);
}

heartbeat();