  function drawGrid(newData, type) {
    // console.log(newData);
    initializeValues(newData, type);
    setupGrid();
    drawLabels();
    

    $('#password-meta-data-holder').html(' ');
    // console.log(columnList);
    // Draw all the blocks
    initializeBlocks(newData);

    drawScrollpiece();

    if(type == "changedata"){
    } else {
      drawBreakdownBlocks(blockLabels, 0, substeps, stepLabelsBreakdown);
    }
    
    LoadingScreen.hideScreen();
  }

function initializeValues(newData, type){
   if(type == "changedata"){
      // Set range to different ranges
      rangeList = changeRangeList;
    } else {
      rangeList = actualValRangeList;
    }

    sliderRanges['passwordlength'] = d3.extent(newData, function(d){ return d.passwordlength; });
    sliderRanges['numLetters'] = d3.extent(newData, function(d){ return d.numLetters; });
    sliderRanges['numNumbers'] = d3.extent(newData, function(d){ return d.numNumbers; });
    sliderRanges['numSymbols'] = d3.extent(newData, function(d){ return d.numSymbols; });
    // console.log(sliderRanges);

    currentSelection = d3.selectAll(".password");
    // console.log(currentSelection);
}

function setupGrid(){
  createsvg();
      // Create variables for each step/column
  // For left hand side

  tinyBlockSize = Math.min(4, ($('body').height()-10)/newData.length);
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

    initializeSliders();
}

function createsvg(){
//Create main svg where large graphic will reside
 svg = d3.select("#chart").append("svg")
            .attr("viewBox", viewBox)
            .attr("overflow", "visible")
            .attr("id", "chartsvg")
            .attr("preserveAspectRatio", "xMidYMin meet");

   svgColumns = d3.select('#chart-columns').append("svg")
      .attr("height", "300")
      .attr("width", "100%")
      .attr("overflow", "visible");

  svgBreakdown = d3.select('#chartBreakdown').append("svg")
      .attr("viewBox", smallviewBox)
      .attr("height", "340")
      .attr("overflow", "visible")
      .attr("preserveAspectRatio", "xMidYMin meet");

  svgSidebar = d3.select('#chartsidebar').append("svg")
      .attr("overflow", "visible")
      .attr("viewBox", viewBoxsidebar)
      .attr("id", "svgSidebar")
      .attr("preserveAspectRatio", "xMidYMin meet");

  svg.append("g");
  svgBreakdown.append("g");

  var svgelem = document.getElementById('chartsvg');
  bBox = svgelem.getBBox();
  height = bBox.height;
  // console.log("height: "+bBox);
}


          
