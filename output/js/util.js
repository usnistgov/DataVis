// Basic utilities

// Index:
// 		Compare functions
// 			Entropy
// 			LPD
// 			Keystrokes
// 		Color functions
// 			color domain
// 			set colors
// 		Escape characters into HTML friendly codes

// Compare passwords based on entropy
function compareentropy (a, b) {
	if (a['entropy'] < b['entropy'])
	   return -1;
	if (a['entropy'] > b['entropy'])
	   return 1;
	// a must be equal to b
	return 0;
}

// Compate passwords based on lpd score
function comparelpd (a, b) {
	if (a['newlpd'] < b['newlpd'])
	   return -1;
	if (a['newlpd'] > b['newlpd'])
	   return 1;
	// a must be equal to b
	return 0;
}

// compate passwords based on number of keystrokes
function comparekeystrokes (a, b) {
	if (a['newkeystrokes'] < b['newkeystrokes'])
	   return -1;
	if (a['newkeystrokes'] > b['newkeystrokes'])
	   return 1;
	// a must be equal to b
	return 0;
}

// Return the color domain for the column name passwed
// @param name of the column
// column name must exist in variable "rangeList"
function getColorDomain (name) {

	name = name.replace("new", "");
	name = name.replace("original", "");

	var domain = rangeList[name];
	var min = domain[0];
	var max = domain[1];

	if(min == "min"){
	  var minOrig = d3.min(newData, function (d) { return d[name]; });
	  var minNew = d3.min(newData, function (d) { return d['new'+name]; });

	  if(minOrig < minNew){
	    min = minOrig;
	  } else {
	    min = minNew;
	  }
	}

	if(max == "max"){
	  var maxOrig = d3.max(newData, function (d) { return d[name]; });
	  var maxNew = d3.max(newData, function (d) { return d['new'+name]; });

	  if(maxOrig > minNew){
	    max = maxOrig;
	  } else {
	    max = maxNew;
	  }
	} 

	domain = [min, max];
	return domain;
}

// Return color scale variable for set of passwords
function setColors(colorScheme, name){

	if(name == 0){
	  var colorScale = d3.scale.linear()
	      .domain([-1, 1])
	      .range(colors[colorScheme]);
	} else {
	  var colorScale = d3.scale.quantile()
	      .domain(getColorDomain(name))
	      .range(colors[colorScheme]);
	}

	return colorScale;
}

// Escape html characters
function escapeHTMLchars (str) {
  str = str.replace("&", "&amp;");
  str = str.replace("<", "&lt;");
  str = str.replace(">", "&gt;");

  return str;
}