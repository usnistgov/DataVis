// Data variables
var vizFilename = "catCode-results-1thousand-2015-01-15.csv";
var originalData;
var newData;
var changeData;

//Set constants and global variables
var margin = { top: 0, right: 0, bottom: 0, left: 300 },
    labelsMargin = 150, // Margin for password labels
    width = 960,
    height = 800, 
    gridSize = Math.floor(height / 40),
    tinyBlockSize = 2,
    legendElementWidth = gridSize*2,
    buckets = 9,
    steps = ["Symbol start", "Number of Chunks", "Number of Characters", "Unsentence-like capitalization", "Mixed Character String", "Pronounceable", "Total LP Difficulty", "# of Desktop keystrokes" ,"# of Android Keystrokes", "# of iPad Keystrokes", "entropy", "New entropy",  "New # of iPad Keystrokes", "# of Android Keystrokes", "New # of Desktop Keystrokes", "Permuted LP Difficulty", "New Pronounceable", "New Mixed Character String", "New Unsentence-like capitalization", "New Number of Characters", "New Number of Chunks", "New Symbol Start"];
    substeps = steps.slice(0, (steps.length/2)); 
var gridMargin = 180;

//Generate list of current columns to be edited on the fly    
var originalColumnList = ["symbolStart", "chunks", "characters", "unsentenceLikeCaps", "mixedCharacterString", "pronounceable", "lpd", "desktopkeystrokes", "androidkeystrokes", "ipadkeystrokes", "entropy", "newentropy","newipadkeystrokes", "newandroidkeystrokes", "newdesktopkeystrokes", "newlpd", "newpronounceable", "newmixedCharacterString", "newunsentenceLikeCaps", "newcharacters", "newchunks", "newsymbolStart"];
var columnList = originalColumnList;

// Create array holding range of values for each step(column)
// Global rangeList
var rangeList = [];
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


var actualValRangeList = rangeList;
var changeRangeList =[];
changeRangeList['symbolStart'] = ["min", "max"];
changeRangeList['chunks'] = ["min","max"];
changeRangeList['characters'] = ["min", "max"];
changeRangeList['unsentenceLikeCaps'] = ["min", "max"];
changeRangeList['mixedCharacterString'] = ["min", "max"];
changeRangeList['pronounceable'] = ["min", "max"];
changeRangeList['lpd'] = ["min","max"];
changeRangeList['entropy'] = ["min","max"];
changeRangeList['desktopkeystrokes'] = ["min", "max"];
changeRangeList['androidkeystrokes'] = ["min", "max"];
changeRangeList['ipadkeystrokes'] = ["min", "max"];

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

// SVG objects for parts of the visualization
var svg; // Tier 2, left hand side large grid
var svgSidebar; // Tier 1, mini map of whole dataset
var svgelem
var svgBreakdown; // Tier 3, right hand side visualization
var svgColumns; // Column labels
var bBox;
var gridType = "originalData";

// Set viewbox size
var viewBox = "0 0 " + $('#chart').width() + " " + ($('body').height() - 300);
var viewBoxsidebar = "0 0 " + $('#chartsidebar').width() + " " + $('body').height();
// Create smaller panel 
var smallviewBox = "0 0 " + $('#chartBreakdown').width() + " 340";

// Label variables
var blockLabels; 
var stepLabelsBreakdown;
var passwordLabelBreakdown;
var changeBreakdown;
var changeBreakdownLabels;
var passwordBreakdownLabels;
var passwordLabelBreakdownLeft;

// Column properties
var columnVarList = [];
var breakMargin = 20;
var breakBounds = [6, 9, 11, 14];

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
var currentSelections = []; // Which rows of passwords are hidden

// Holds currently visible items
var currentSelection;