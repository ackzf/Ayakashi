//Automatically walks the stage and sells non-magatama daemons acquired. Create a new window of the target stage before using.

var INVESTIGATE = 0;
var ENDSTATE = 1;

var CYCLETIME = 100;

var current = 0;
var max = 30;

var sold = false;

var state = INVESTIGATE;

function click() {
	console.log(current + "/" + max);
	var delay = 1000;
	if (state == INVESTIGATE) {
		if ($("#card-acquisition-page").hasClass("ui-page-active")) {
			current = parseInt($($(".current")[0]).html());
			max = parseInt($($(".max")[0]).html());
			var acqsrc = $($(".card")).children()[0].src;
			var acqid = parseInt(acqsrc.substring(acqsrc.indexOf("monsters") + 9, acqsrc.indexOf("/l.jpg")));
      console.log(acqid);			
			if (!sold && (acqid < 113 || acqid > 121)) {
				$($("#do-sell")).click();
			} else if (current == max) {
				state = ENDSTATE;
			} else {
				$($(".button")[3]).trigger("click");
				sold = false;
			}
		} else if ($("#sell-monster-popup").hasClass("ui-page-active")) {
			$($("#sell-button")).click();
			sold = true;
		} else if ($("#encounter-other-player-page").hasClass("ui-page-active")) {
			if ($($(".button")[3]).attr("data-rel") == "back")
				$($(".button")[3]).trigger("click");
			else
				$($(".button")[4]).trigger("click");
		} else if ($("#treasure-acquisition-page").hasClass("ui-page-active")) {
			delay = 2000;
			$($(".button")[3]).trigger("click");
		} else if ($("#parts-pvp-acquisition-page").hasClass("ui-page-active")) {
			$("#btn-adventure-l").trigger("click");
		} else {
			if (!($("#do-adventure").hasClass("loading"))) {
				if (current < max) {
					$("#do-adventure").trigger("click");
				} else {
					state = ENDSTATE;
				}
			}
		}
	}
	if (state != ENDSTATE)
		window.setTimeout(click, 1000);
}

function cycle() {
	state = INVESTIGATE;
	window.setTimeout(click, 1000);
}

cycle();                                                  