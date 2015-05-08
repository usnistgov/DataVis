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
function comparenewentropy (a, b) {
	if (a['newentropy'] < b['newentropy'])
	   return -1;
	if (a['newentropy'] > b['newentropy'])
	   return 1;
	// a must be equal to b
	return 0;
}

// Compate passwords based on lpd score
function comparenewlpd (a, b) {
	if (a['newlpd'] < b['newlpd'])
	   return -1;
	if (a['newlpd'] > b['newlpd'])
	   return 1;
	// a must be equal to b
	return 0;
}

// compate passwords based on number of keystrokes
function comparenewkeystrokes (a, b) {
	if (a['newkeystrokes'] < b['newkeystrokes'])
	   return -1;
	if (a['newkeystrokes'] > b['newkeystrokes'])
	   return 1;
	// a must be equal to b
	return 0;
}

// Returns a [i, j] array representing the minimum and maximum values for the column specified
//  @param 
//    name: String, name of the column. column name must exist in variable "rangeList"
//    rangeList: Array, list of keys for each column name containing strings representing the domain of that data type
//    data: Data to be checked. 
function getColorDomain (name) {
    // Remove 'new' from column name
	name = name.replace("new", "");
	name = name.replace("original", "");

	// Get domain for a particular column
	var domain = rangeList[name];
	var min = domain[0];
	var max = domain[1];

	// Determine the minimum value for that column in the dataset
	if(min == "min"){
	  var minOrig = d3.min(newData, function (d) { return d[name]; });
	  var minNew = d3.min(newData, function (d) { return d['new'+name]; });

	  if(minOrig < minNew){
	    min = minOrig;
	  } else {
	    min = minNew;
	  }
	}

	// Determine the maximum value for that column in the dataset
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

// Return color scale object for set of passwords
//  @param 
//		name: String, name of the column. column name must exist in variable "rangeList"
// 		colorScheme: String, color scheme. Should be a key existing in colors representing an array of color values.
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