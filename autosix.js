//performs free six summons until points are exhausted.
var summonURL = "http://zc2.ayakashi.zynga.com/app.php?_c=gacha&action=roll_multi&gacha_id=2&type=2";

var a = window.open();
var summonlag = true;
var count = 0;
function heartbeat() {
	if (summonlag) {
		count++;
		if (count == 3) {
			summonlag = false;
			count = 0;
		}
	} else if (a.window.location.href != summonURL) {
		a.window.location.href = summonURL;
		summonlag = true;
	}
	window.setTimeout(heartbeat, 1000);
}

heartbeat();