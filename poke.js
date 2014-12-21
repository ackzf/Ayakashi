//pokes all crewmates. Scroll to the bottom of crew list first before use.

var idnum = 0;
var list = $(".touch-button");

function click() {
	$(list[idnum]).trigger("click");
	idnum = idnum + 1;
	console.log(idnum);
	if (idnum < list.size())
		window.setTimeout(click, 1000);
}

click()
