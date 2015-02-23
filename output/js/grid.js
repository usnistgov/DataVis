// Initialize values and draw all grid components
function drawGrid(newData, type) {
  initializeValues(newData, type);
  setupGrid();
  drawLabels();
  
  // Clear tier 3 HTML
  $('#password-meta-data-holder').html(' ');
  
  // Draw all the blocks
  initializeBlocks(newData);


  drawScrollpiece();

  if(type == "changedata"){
  } else {
    drawBreakdownBlocks(blockLabels, 0, substeps, stepLabelsBreakdown);
  }
  
  LoadingScreen.hideScreen(); // Loading wheel disappears
}

// Initialize values of rangeList (determine color scale) and slider ranges for right hand side customization options
function initializeValues(newData, type){
    // Set reference for rangeList
   if(type == "changedata"){
      rangeList = changeRangeList;
    } else {
      rangeList = actualValRangeList;
    }

    // Determine slider ranges
    sliderRanges['passwordlength'] = d3.extent(newData, function(d){ return d.passwordlength; });
    sliderRanges['numLetters'] = d3.extent(newData, function(d){ return d.numLetters; });
    sliderRanges['numNumbers'] = d3.extent(newData, function(d){ return d.numNumbers; });
    sliderRanges['numSymbols'] = d3.extent(newData, function(d){ return d.numSymbols; });
    initializeSliders();

    // Holds currently visible items
    currentSelection = d3.selectAll(".password");
}

// Set up the svg
function setupGrid(){
  createsvg();

  // Determine size of tier 1 blocks
  tinyBlockSize = Math.max(Math.min(4, ($('body').height()-10)/newData.length), 2.5);
  
  // Determine how scrolling scales from tier 1 to tier 2
  scrollScale = gridSize/tinyBlockSize;
  
  // Create array of variables for main diagram
  columnVarList = [];
  $.each( columnList, function(index, value){
    var name = "." + value
    columnVarList[value] = svg.selectAll(name);
  });
  

  // Create all right hand side labels and variables
  blockLabels = svgBreakdown.selectAll(".blockLabel"); //actual blocks to be drawn
  stepLabelsBreakdown = svgBreakdown.selectAll(".stepLabelsBreakdown"); 
  passwordLabelBreakdown = svgBreakdown.selectAll(".passwordLabelBreakdown");
  changeBreakdown = svgBreakdown.selectAll("g.percentChangeBreakdown");
  changeBreakdownLabels = svgBreakdown.selectAll(".percentChangeBreakdownLabels");
  passwordBreakdownLabels = ['Orig', "Perm"];
  passwordLabelBreakdownLeft = svgBreakdown.selectAll(".passwordLabelBreakdownLeft");

}

// Create SVG elements
function createsvg(){
  //Create tier 2 SVG (large grid for center)
  svg = d3.select("#chart").append("svg")
    .attr("viewBox", viewBox)
    .attr("overflow", "visible")
    .attr("id", "chartsvg")
    .attr("preserveAspectRatio", "xMidYMin meet");
  svg
    .append("g"); // Creates a group to contain the data elements to be added (rect)
  
  // Create svg for column labels
  svgColumns = d3.select('#chart-columns').append("svg")
    .attr("height", "300")
    .attr("width", "100%")
    .attr("overflow", "visible");

  // Create svg for tier 3 (right hand side visualization)
  svgBreakdown = d3.select('#chartBreakdown').append("svg")
    .attr("viewBox", smallviewBox)
    .attr("height", "340")
    .attr("overflow", "visible")
    .attr("preserveAspectRatio", "xMidYMin meet");
  svgBreakdown
    .append("g"); // Creates a group to contain the data elements to be added (rect)

  // Create svg for tier 1 (sidebar/scrollbar) in the middle of the page
  svgSidebar = d3.select('#chartsidebar').append("svg")
    .attr("overflow", "visible")
    .attr("viewBox", viewBoxsidebar)
    .attr("id", "svgSidebar")
    .attr("preserveAspectRatio", "xMidYMin meet");

  // Get height of SVG element
  svgelem = document.getElementById('chartsvg');
  bBox = svgelem.getBBox();
  height = bBox.height;

}