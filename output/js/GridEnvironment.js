function GridEnvironment () {
	gridENvironment = this;

    this.margin = { top: 0, right: 0, bottom: 0, left: 300 };
	this.width = 960;
	this.height = 800;
	this.gridSize = Math.floor(height / 40);
	this.tinyBlockSize = 2;
	this.legendElementWidth = gridSize*2;
	this.buckets = 9;
	this.steps = ["Symbol start", "Number of Chunks", "Number of Characters", "Unsentence-like capitalization", "Mixed Character String", "Pronounceable", "Total LP Difficulty", "# of Desktop keystrokes" ,"# of Android Keystrokes", "# of iPad Keystrokes", "entropy", "New entropy",  "New # of iPad Keystrokes", "# of Android Keystrokes", "New # of Desktop Keystrokes", "Permuted LP Difficulty", "New Pronounceable", "New Mixed Character String", "New Unsentence-like capitalization", "New Number of Characters", "New Number of Chunks", "New Symbol Start"];
	this.substeps = steps.slice(0, (steps.length/2)); 
	this.gridMargin = 180;

	//Generate list of current columns to be edited on the fly    
	this.originalColumnList = ["symbolStart", "chunks", "characters", "unsentenceLikeCaps", "mixedCharacterString", "pronounceable", "lpd", "desktopkeystrokes", "androidkeystrokes", "ipadkeystrokes", "entropy", "newentropy","newipadkeystrokes", "newandroidkeystrokes", "newdesktopkeystrokes", "newlpd", "newpronounceable", "newmixedCharacterString", "newunsentenceLikeCaps", "newcharacters", "newchunks", "newsymbolStart"];
	this.columnList = originalColumnList;

	// Create array holding range of values for each step(column)
	// Global rangeList
	this.rangeList = [];
	rangeList['symbolStart'] = [0,1];
	rangeList['chunks'] = [0,"max"];
	rangeList['characters'] = [0,5];
	rangeList['unsentenceLikeCaps'] = [0,"max"];
	rangeList['mixedCharacterString'] = [0,1];
	rangeList['pronounceable'] = ["min",0];
	rangeList['lpd'] = ["min","max"];
	rangeList['entropy'] = ["min","max"];
	rangeList['androidkeystrokes'] = ["min", "max"];
	rangeList['ipadkeystrokes'] = ["min", "max"];
	rangeList['desktopkeystrokes'] = ["min", "max"];


	this.actualValRangeList = rangeList;
	this.changeRangeList =[];
	for (var i = 0; i < (this.originalColumnList.length-1/2); i++) {
		changeRangeList[this.originalColumnList[i]] = ["min", "max"];
	};
	console.log(changeRangeList);

	//Set up color palettes
	colors = [];
	colors['YlGnBu'] = colorbrewer.YlGnBu[buckets];
	colors['GnYlRd'] = colorbrewer.GnYlRd[buckets];
	colors['PuRd'] = colorbrewer.PuRd[buckets];
	colors['BlWt'] = colorbrewer.BlWt[buckets];
	colors['WtRd'] = colorbrewer.WtRd[buckets];
	colors['WtBl'] = colorbrewer.WtBl[buckets];
	colors['Greys'] = colorbrewer.Greys[buckets];
	currentColorScale = 'WtBl';

	//Create svgs
	var svgSidebar;
	var svgsidebarelement;
	var bBox;
	this.gridType = "originalData";

	// Set viewbox size
	var viewBoxsidebar = "0 0 " + $('#chartsidebar').width() + " " + $('body').height();

	// Data variables
	this.originalData;
	this.newData;
	this.changeData;

	// Label variables
	var blockLabels; 
	var stepLabelsBreakdown;
	var passwordLabelBreakdown;
	var changeBreakdown;
	var changeBreakdownLabels;
	var passwordBreakdownLabels;
	var passwordLabelBreakdownLeft;

	// Column properties
	this.columnVarList = [];
	this.breakBounds = [6, 9, 11, 14];

	// Minimap Properties
	var minimapWidth = 200;
	var minimapHeight = 93;
	var minimapX = 0;

	// scrolling properties
	var panrate = 520;
	var last_position = 0;
	var scrollScale;
	for (var i = 0; i < (originalColumnList.length/2); i++) {
	  $('.display-input-holder').append('<label class="btn btn-xs btn-default active display-btn" id="display'+columnList[i%(columnList.length/2)]+'" style="margin:2px;"><input type="checkbox">'+steps[i]+'</label>');
	};

	// drag behavior
	var drag = d3.behavior.drag()
	      .origin(function(d) { return d; })
	      .on("drag", dragmove);

	// Slider values
	var sliderRanges = [];
	var currentSelections = [];

	// Holds currently visible items
	var currentSelection;
}