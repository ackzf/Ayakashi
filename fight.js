//automatically searches for enemies to fight.

var waterURL = "http://zc2.ayakashi.zynga.com/app.php?_c=item&action=use&item_id=5";
var homeURL = "http://zc2.ayakashi.zynga.com/app.php?_c=entry&action=mypage";
var battleURL = "http://zc2.ayakashi.zynga.com/app.php?_c=battle";
var killURL = "http://zc2.ayakashi.zynga.com/app.php?_c=parts_pvp_event&action=exec_battle&target_user_id=";
var baseURL = "http://zc2.ayakashi.zynga.com/app.php?_c=parts_pvp_event";

var EVID = 78;

var LOWDS = 0;
var LOWAS = 1;

var ORIENTING = 0;
var REFRESH = 1;
var SEARCH = 2;
var ATTACKING = 3;
var BASE = 4;
var WATER = 5;
var ENDSTATE = 6;

var leadList = [ 1, 3, 4, 5, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 31, 37, 47, 49, 50, 51, 55, 57, 59, 60, 63, 64, 65, 66, 67, 68, 70, 71, 74, 77, 79, 80, 82, 83, 84, 86, 89, 90, 91, 92, 95, 96, 101, 102, 103, 104, 105, 106, 109, 111, 113, 114, 116, 117, 119, 120, 128, 131, 133, 134, 136, 137, 139, 141, 142, 144, 145, 146, 149, 150, 153, 154, 155, 159, 162, 163, 164, 165, 166, 167, 168, 169, 171, 172, 174, 176, 177, 179, 181, 182, 184, 186, 189, 190, 191, 192, 193, 194, 196, 197, 200, 201, 203, 204, 205, 206, 215, 216, 217, 218, 219, 221, 222, 223, 224, 232, 233, 234, 237, 238, 241, 242, 247, 250, 251, 252, 254, 256, 257, 258, 259, 260, 261, 264, 267, 268, 269, 270, 271, 272, 275, 301, 302, 303, 304, 305, 306, 307, 311, 318, 319, 320, 321, 323, 325, 326, 327, 341, 342, 343, 344, 346, 347, 350, 351, 352, 353, 354, 355, 360, 361, 362, 364, 365, 366, 376, 378, 381, 383, 385, 386, 387, 388, 389, 390, 391, 398, 399, 400, 403, 404, 405, 407, 409, 430, 431, 432, 433, 438, 439, 441, 443, 444, 448, 450, 452, 455, 459, 461, 465, 466, 468, 470, 471, 476, 478, 480, 481, 482, 483, 484, 487, 491, 492, 493, 495, 496, 497, 521, 522, 523, 527, 528, 530, 531, 532, 533, 534, 535, 536, 537, 538, 540, 553, 554, 557, 559, 561, 562, 566, 569, 570, 571, 572, 573, 574, 575, 577, 580, 582, 585, 591, 592, 593, 600, 601, 602, 603, 604, 605, 606, 607, 609, 613, 614, 617, 624, 630, 637, 652, 653, 654, 655, 660, 661, 662, 664, 665, 666, 667, 668, 671, 681, 684, 685, 686, 689, 691, 695, 696, 701, 703, 706, 709, 710, 711, 712, 713, 714, 715, 716, 717, 718, 721, 723, 724, 725, 726, 728, 732, 739, 741, 743, 745, 746, 747, 748, 749, 752, 753, 756, 757, 759, 760, 761, 762, 763, 768, 769, 770, 771, 772, 775, 776, 777, 778, 779, 781, 782, 783, 785, 790, 791, 792, 795, 798, 799, 804, 806, 808, 809, 810, 811, 813, 814, 815, 818, 820, 821, 822, 823, 824, 826, 832, 834, 836, 837, 839, 840, 841, 842, 844, 845, 846, 847, 848, 849, 850, 851, 852, 853, 854, 857, 860, 861, 862, 863, 865, 868, 874, 875, 877, 880, 881, 882, 884, 888, 892, 893, 895, 896, 897, 900, 901, 903, 906, 909, 910, 911, 912, 913, 915, 917, 918, 920, 925, 927, 929, 932, 933, 935, 937, 938, 940, 946, 947, 948, 949, 950, 951, 953, 954, 955, 956, 957, 958, 960, 961, 963, 965, 966, 967, 969, 971, 974, 979, 982, 983, 984, 987, 989, 991, 994, 995, 999, 1001, 1004, 1006, 1007, 1008, 1009, 1013, 1015, 1017, 1018, 1019, 1020, 1025, 1027, 1028, 1030, 1031, 1034, 1035, 1036, 1039, 1040, 1041, 1045, 1047, 1050, 1052, 1053, 1054, 1055, 1056, 1058, 1059, 1060, 1061, 1062, 1063, 1065, 1066, 1067, 1068, 1075, 1078, 1079, 1080, 1083, 1085, 1086, 1087, 1091, 1094, 1095, 1097, 1098, 1099, 1100, 1101, 1105, 1107, 1109, 1110, 1112, 1117, 1118, 1121, 1122, 1123, 1124, 1125, 1126, 1129, 1135, 1136, 1138, 1139, 1140, 1141, 1143, 1145, 1146, 1147, 1152, 1153, 1155, 1157, 1159, 1163, 1164, 1165, 1167, 1169, 1170, 1172, 1177, 1178, 1180, 1181, 1182, 1183, 1184, 1187, 1188, 1190, 1195, 1198, 1199, 1200, 1201, 1206, 1208, 1213, 1215, 1216, 1219, 1222, 1223, 1225, 1226, 1227, 1228, 1230, 1231, 1232, 1233, 1234, 1235, 1236, 1238, 1240, 1241, 1243, 1247, 1248, 1252, 1254, 1255, 1259, 1260, 1261, 1262, 1264, 1270, 1271, 1272, 1273, 1275, 1276, 1282, 1283, 1284, 1285, 1286, 1290, 1293, 1294, 1298, 1300, 1301, 1304, 1305, 1307, 1312, 1314, 1315, 1317, 1319, 1320, 1324, 1325, 1326, 1327, 1330, 1331, 1332, 1333, 1334, 1335, 1336, 1338, 1339, 1340, 1341, 1343, 1344, 1346, 1349, 1351, 1352, 1353, 1361, 1362, 1364, 1368, 1369, 1371, 1375, 1376, 1377, 1379, 1380, 1381, 1385, 1388, 1390, 1391, 1392, 1393, 1399, 1400, 1402, 1405, 1406, 1407, 1408, 1414, 1415, 1416, 1418, 1419, 1421, 1422, 1424, 1425, 1428, 1430, 1432, 1434, 1437, 1438, 1441, 1444, 1448, 1450, 1451, 1452, 1453, 20007, 20008, 20009, 601354, 601357, 601358, 601394, 601395, 601440, 601441 ];
var mode = LOWDS;
var search = window.open("http://zc2.ayakashi.zynga.com/app.php?_c=battle");
var timeoutCounter = 0;
var maxDS = 45;
var maxLevel = 130;
var stoneid = 0;
var asCost = 29;
var asasCost = 112;
var state = 3;
var delay = 5000;
var TIMEOUT = 10000;
var water = false;
var opponents;

function hunt() {
	if (state == ORIENTING) {
		if (search.document.readyState == 'complete' && search.$ && !$(search.document.getElementsByTagName('html')).hasClass('ui-loading')) {
			for ( var stoneidt = 1; stoneidt < 7; stoneidt++) {
				if ($(search.$(".monster-parts")[0]).hasClass("attribute-" + stoneidt)) {
					stoneid = stoneidt;
					console.log("Current Stone ID: " + stoneid);
					break;
				}
			}
			if (stoneid == 0) {
				timeoutCounter++;
			} else {
				state = REFRESH;
				timeoutCounter = 0;
			}
			if (timeoutCounter > TIMEOUT / delay) {
				delay = 5000;
				search.location.href = homeURL;
				state = BASE;
				timeoutCounter = 0;
			}
		} else if (timeoutCounter > TIMEOUT / delay) {
			delay = 5000;
			search.location.href = homeURL;
			state = BASE;
			timeoutCounter = 0;
		} else {
			timeoutCounter++;
		}
	} else if (state == REFRESH) {
		if (search.$) {
			timeoutCounter = 0;
			$.get(baseURL, {
				action : "battle_opponents",
				evid : EVID,
				target_item_id : stoneid
			}).then(function(data) {
				console.log('Got Opponents');
				opponents = data["opponents"];
			})
			state = SEARCH;
		} else if (timeoutCounter > TIMEOUT / delay) {
			delay = 5000;
			search.location.href = homeURL;
			state = BASE;
			timeoutCounter = 0;
		} else {
			timeoutCounter++;
		}
	} else if (state == SEARCH) {
		if (opponents != undefined) {
			timeoutCounter = 0;
			for ( var i = 0; i < opponents.length; i++) {
				var def = opponents[i]["detail"]["defense"];
				var level = opponents[i]["detail"]["level"];
				var leader = opponents[i]["detail"]["monsterId"];
				if ((mode == LOWDS && def <= maxDS) || (mode == LOWAS && level < maxLevel && leadList.indexOf(leader) != -1)) {
					console.log("Attacking: " + opponents[i]["detail"]["userId"]);
					search.location.href = killURL + opponents[i]["detail"]["userId"] + "&target_item_id=" + stoneid + "&evid=" + EVID;
					state = ATTACKING;
					delay = 5000;
					break;
				}
			}
			opponents = undefined;
			if (state == SEARCH)
				state = REFRESH;
		} else if (timeoutCounter > TIMEOUT / delay) {
			delay = 5000;
			search.location.href = homeURL;
			state = BASE;
			timeoutCounter = 0;
		} else {
			timeoutCounter++;
		}
	} else if (state == ATTACKING) {
		search.location.href = homeURL;
		state = BASE;
		timeoutCounter = 0;
	} else if (state == BASE) {
		if (search.document.readyState == 'complete' && search.$ && search.$(".value") != null && search.$(".value").length > 7) {
			timeoutCounter = 0;
			console.log("Remaining AS:" + search.$(".value")[7].innerHTML);
			var currentas = parseInt(search.$(".value")[7].innerHTML);
			if ((mode == LOWDS && currentas > asCost) || (mode == LOWAS && currentas > asasCost)) {
				stoneid = 0;
				search.location.href = battleURL;
				state = ORIENTING;
				delay = 500;
			} else {
				if (water) {
					search.window.location.href = waterURL;
					state = WATER;
				} else {
				  state = ATTACKING;
					delay = 60 * 1000;
				}
			}
		} else if (timeoutCounter > TIMEOUT / delay) {
			delay = 5000;
			search.location.href = homeURL;
			state = BASE;
			timeoutCounter = 0;
		} else {
			timeoutCounter++;
		}
	} else if (state == WATER) {
		if (search.document.readyState == 'complete' && search.$ && search.window.location.href.indexOf("use") != -1) {
			timeoutCounter = 0;
			stoneid = 0;
			search.location.href = battleURL;
			state = ORIENTING;
			delay = 500;
		} else if (timeoutCounter > TIMEOUT / delay) {
			delay = 5000;
			search.location.href = homeURL;
			state = BASE;
			timeoutCounter = 0;
		} else {
			timeoutCounter++;
		}
	}
	if (state != ENDSTATE)
		setTimeout(hunt, delay);
}

hunt();