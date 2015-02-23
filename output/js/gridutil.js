// Dim rows of passwords
function refreshSelections() {
    for (var key in currentSelections) {
      currentSelections[key].style("opacity", 0.1);
    }
}

// Draw password labels, column labels
function drawLabels(){
  // Insert filename into HTML
  $('#fileDisplayed').html(vizFilename);
  $('#numPasswords').html(newData.length)

  // Create labels for main diagram
  var passwordLabels = svg.selectAll(".passwordLabels")
      .data(newData)
      .enter().append("text")
        .text(function (d) { return d['originalPassword']; })
        .style("text-anchor", "end")
        .attr("transform", function (d, i) {

          return "translate(" + (labelsMargin) + "," +  (i * gridSize + margin.top + gridSize/.85) + ")";
        })
        .attr("class", function (d, i) { return "password mono hiderow" })
        .attr("id", function (d, i) { return "labelpassword"+i; });

  var permutedpasswordLabels = svg.selectAll(".permutedpasswordLabels")
      .data(newData)
      .enter().append("text")
        .text(function (d) { return d['permutedPassword']; })
        .style("text-anchor", "start")
        .attr("transform", function (d, i) {

          return "translate(" + ((columnList.length * gridSize )+ getStepLeftMargin(columnList.length, breakBounds, breakMargin) + (gridMargin-labelsMargin
            )+ gridMargin) + "," +  (i * gridSize + margin.top + gridSize/.85) + ")";
        })
        .attr("class", function (d, i) { return "password mono hiderow" })
        .attr("id", function (d, i) { return "labelpermutedpassword"+i; });

  var stepLabels = svgColumns.selectAll(".stepLabel")
      .data(steps)
      .enter().append("text")
        .text(function(d, i) { return d; })
        // .attr("x", 290 * -1)
        // .attr("y", function(d, i) { return i * gridSize + 208 + getStepLeftMargin(i, breakBounds, breakMargin); })
        .style("text-anchor", "start", "fill", "#000")
        .attr("transform", function(d, i) {



          return "translate(" + (((i+1) * gridSize) + (gridSize/3) + gridMargin + getStepLeftMargin(i, breakBounds, breakMargin)) + ", " + 300 + "), rotate(-70)";
        })
          .attr("class", function(d, i){return "label"+columnList[i]+" stepLabel mono axis step "+columnList[i]});
}

// Create blocks for tier 1 and 2
function initializeBlocks(thisData){
    for(var ind = 0; ind < columnList.length; ind++){
      if(ind < ((columnList.length/2))){
        $('#password-meta-data-holder').append('<div class="data-holder-'+columnList[ind]+' row data-holder-score-row label'+columnList[ind]+'"><div class="right-align col-md-4"><p class="">'+steps[ind]+':</p></div><div class="col-md-2 score-data" id="'+columnList[ind]+'"><p></p></div><div class="col-md-2 score-data" id="new'+columnList[ind]+'"><p></p></div><div class="col-md-4"><p>'+steps[ind]+'</p></div></div>');
      }
      var name = columnList[ind]; //key for current column
      var colorScale = setColors(currentColorScale, name);
      // var thisobj = columnVarList[i];

      // Initialize this block
      // Draw large grid
      var thisobj = columnVarList[name].data(thisData);
      
      thisobj
          .enter()
          .append("rect")
          .attr("class", function(d, i){return "blockLabel score bordered "+"password"+i+" "+name+" "+d['originalPassword']+" "+ d['permutedPassword']+" "+name+"block hiderow";})
          .attr("id", function(d){return d['originalPassword'] + name;})
          .style("fill", colors[currentColorScale][0])
          .on("mouseover", function(d, i){

            return hoverBlock(d, columnList[ind], this, "over", rangeList)}) //dataObj, name, obj, overVal, rangeList
          .on("mouseout", function(d, i){return hoverBlock(d, columnList[ind], this, "out", rangeList)})
          .attr("value", function(d){return d[name];});
      // exit transition
      thisobj
          .exit().transition()
          .duration(1000)
          .attr("width", 0)
          .attr("height", 0)
          .style("fill", function(d) { return colorScale(d[name]); }).remove();

      // Initialize
      var tinyBlock = svgSidebar.selectAll(".tinyblock")
      .data(thisData)
        .enter().append("rect")
          .style("fill", function(d) { return colorScale(d[name]); })
          .attr("class", function(d, i){return "tinyscore password"+i+"tinyblock "+name+"tinyblock hiderow";})
          .attr("value", function(d){return d[name];});
    }

    drawBlocks();
}

// Draw main grid on left hand side and minimap grid
// Draws column by column
function drawBlocks() {
    for(var index = 0; index < columnList.length; index++){
          var newbreakMargin = getStepLeftMargin(index, breakBounds, breakMargin);
          var name = columnList[index]; //key for current column
          var colorScale = setColors(currentColorScale, name);
          
          var classname = "." + name;
          thisobj = svg.selectAll(classname);

          // Update blocks
          thisobj
              // .attr("x", function(d, i) { return  ((index * gridSize) + gridMargin + newbreakMargin); })
              // .attr("y", function(d, i){return i * (gridSize + margin.top + gridSize/2);})
              .attr("transform", function(d, i){return "translate("+ ((index * gridSize) + gridMargin + newbreakMargin) + "," + (((gridSize + margin.top) * i) + (gridSize/2)) +")";})
              .transition()
              .duration(1000)
              .attr("width", gridSize)
              .attr("height", gridSize);
              
          // Determine Fill colors
          fillBlock(thisobj, colorScale, name);

          var tinyblockname = "." + name+"tinyblock";
          var tinyBlock = svgSidebar.selectAll(tinyblockname);
          // Update blocks
          tinyBlock
              .attr("x", function(d, i) { return  index * tinyBlockSize; })
              .attr("y", function(d, i) { return (i) * tinyBlockSize + 10; })
              // .attr("transform", function(d, i){return "translate("+ (index * tinyBlockSize) + "," + ((i) * tinyBlockSize + 10) +")";})
              // .attr("rx", 50)
              // .attr("rx", 50)
              // .attr("ry", 50)
              .attr("width", tinyBlockSize)
              .attr("height", tinyBlockSize);

          // Determine fill colors
          fillBlock(tinyBlock, colorScale, name);
    }
}

// Determine and color each block
function fillBlock(block, colorScale, name) {
  if(gridType == 'changedata'){
    block
      .style("fill", function(d) { 
        if(d[name] < 0) {
          colorScale = setColors("BlWt", name);
          return colorScale(d[name]);
        } else if (d[name] > 0) {
          colorScale = setColors("WtRd", name);
          return colorScale(d[name]);
        } else {
          return "#ffffff"
        }
      });

  } else {
    block
      .style("fill", function(d) { return colorScale(d[name]); });
  }
}

// Draw navigation panel
function drawScrollpiece () {
  svgSidebar.selectAll(".scrollpiece")
    .data(d3.range(1).map(function() { return {x: 0, y: 10}; })).enter()
    .append("rect")
    .attr("width", function(){ return columnList.length * tinyBlockSize})
    .attr("height", minimapHeight)
    .style("fill-opacity", .5)
    .style("stroke-opacity", .5)
    .attr("class", "minimapScrollpiece scrollpiece")
    .style("stroke", "grey")
    .style("fill", "white")
    .style("stroke-width", "2")
    // .style("opacity",0)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("x", function(d, i) { return  d.x; })
    .attr("y", function(d, i) { return d.y; })
    .call(drag);
}

// Draw grid breakdown on right hand side
function drawBreakdownBlocks (obj, index, substeps, stepLabelsBreakdown) {
    // Properties
    var breakMargin = 0; // Holder for margin value. 
    var breakMarginVal = 20; // Margin for column break. Edit this one
    topMargin = 250; 
    var columnBreak = 1;
    var leftMargin = 55;

    var smallgridSize = gridSize;
    var thisobj = obj.data(columnList);
    
    // Draw blocks
    thisobj.enter()
        .append("rect")
        .attr("x", function(d, i) {
          var xVal = 0;
          if(i < columnList.length/2){ //Draw first row
            xVal =  ((i%(columnList.length/2)) * smallgridSize); 
            if(i%(columnList.length/2) > ((columnList.length/2)-columnBreak-1)){
              breakMargin = breakMarginVal;
            } else {
              breakMargin = 0;
            }
          }
          else{ // Draw second row
            xVal =  (((columnList.length - (i%(columnList.length/2)) - 1)) * smallgridSize) - (smallgridSize*((columnList.length/2)));
            if((i%(columnList.length/2)) < columnBreak){
              breakMargin = breakMarginVal;
            } else {
              breakMargin = 0;
            }
          }

          return xVal + breakMargin + leftMargin;
        })
        .attr("y", function(d, i) { if(i > columnList.length/2-1){var newtopMargin = topMargin + smallgridSize;} else{var newtopMargin = topMargin}return smallgridSize + newtopMargin; })
        // .attr("rx", 50)
        // .attr("ry", 50)
        .attr("class", function(d, i){return "score bordered breakdown "+d;})
        .attr("id", function(d){return d + "breakdown";})
        .attr("width", smallgridSize)
        .attr("height", smallgridSize)
        .attr("value", function(d, i){return newData[columnList[i]];})
        .style("fill", colors["PuRd"][0])
        .transition()
        .duration(1000)
        .style("fill", function(d, i) { var colorScale = setColors("Greys", d); return colorScale(newData[index][d]); });
    thisobj.exit().transition()
        .duration(1000)
        .attr("width", 0)
        .attr("height", 0)
        .style("fill", function(d) { return colorScale(d[name]); }).remove();
    topMargin += smallgridSize;   

    // Draw score change table
    changeBreakdown
      .data(substeps)
        .enter().append("g").append("text")
        .text(function(d, i){return " ";})
        .attr("class", function(d, i){return " score bordered breakdownPC changeBreakdown change step "+columnList[i];})
        .attr("x", function(d, i) {
          var xVal = 0;
          if(i < columnList.length/2){
            xVal =  ((i%(columnList.length/2)) * smallgridSize); 
            if(i%(columnList.length/2) > ((columnList.length/2)-columnBreak-1)){
              breakMargin = breakMarginVal;
            } else {
              breakMargin = 0;
            }
          }
          else{
            xVal =  (((columnList.length - (i%(columnList.length/2)) - 1)) * smallgridSize) - (smallgridSize*((columnList.length/2)));
            if((i%(columnList.length/2)) < columnBreak){
              breakMargin = breakMarginVal;
            } else {
              breakMargin = 0;
            }
          }
          return xVal + breakMargin + leftMargin + smallgridSize/2;
        })
        .attr("y", function(d, i) { return topMargin + smallgridSize * 3; })
        .attr("class", function(d, i){return "mono score bordered breakdownPC percentChangeBreakdown percentChange "+ columnList[i]+"breakdownchange";})
        // .attr("id", function(d){return d + "breakdownPercentChange";})
        .attr("value", function(d, i){return newData[columnList[i]];})
        .style("text-anchor", "middle")
        .transition()
        .duration(1000);
    
    // Label for every step (vertical)
    stepLabelsBreakdown
      .data(substeps)
      .enter().append("text")
        .text(function(d) { return d; })
        .attr("y", function(d, i) { 
          if(i%(columnList.length/2) > (columnList.length/2-1) - columnBreak){
            breakMargin = breakMarginVal;
          } else {
            breakMargin = 0;
          }
          return i * smallgridSize + (smallgridSize/2) + breakMargin + leftMargin;
           })
        .attr("x", (-1 * topMargin + 10) )
        .style("text-anchor", "left")
        .attr("transform", "rotate(-90)")
        .attr("class", function(d, i){return "stepLabelsBreakdown timeLabel mono axis labelbreakdown" + columnList[i]+ " "+columnList[i];});

    // Password labels
    passwordLabelBreakdown
      .data(passwordBreakdownLabels)
      .enter().append("text")
        .text(function(d, i) { if(i == 0){return newData[0]['originalPassword']}else{return newData[0]['permutedPassword']}; }).style("text-anchor", "right")
        .attr("x", leftMargin + 10 + (smallgridSize * (columnList.length/2 + 1)) )
        .attr("y", function(d, i) { return i * (smallgridSize) + topMargin + (.65 *smallgridSize); } )
        .attr("class", function(d, i){return "passwordBreakdownLabel mono axis labelBreakdown" + columnList[i]});

    // Left hand password labels
    passwordLabelBreakdownLeft
      .data(passwordBreakdownLabels)
      .enter().append("text")
        .text(function(d, i) { return d;}).style("text-anchor", "right")
        .attr("x", 0 )
        .attr("y", function(d, i) { return i * (smallgridSize) + topMargin + (.65 *smallgridSize); } )
        .attr("class", function(d, i){return "passwordBreakdownLabelLeft mono axis labelBreakdown" + columnList[i]});

    // Change Label
    svgBreakdown
        .append("text")
        .text("Change").style("text-anchor", "right")
        .attr("x", 0 )
        .attr("y", topMargin + smallgridSize * 3 )
        .attr("class", "PCbreakdownLabel mono axis label");

}

// Color blocks based on mousehover of tier 2 (main large grid)
function hoverBlock(dataObj, name, obj, overVal) { 
    var element = d3.select(obj).attr("class");
    var elemArray = element.split(" ");
    elemArray.splice(0, 3);

    // Fill in metrics for individual password/tier 3 view
    $('.original-password-holder h4').html(escapeHTMLchars(dataObj['originalPassword']));
    $('.permuted-password-holder h4').html(escapeHTMLchars(dataObj['permutedPassword']));
    for(var i = 0; i < columnList.length; i++){
      $('#'+columnList[i] + ' p').html(Math.round(dataObj[columnList[i]]));
    }

    name = elemArray[1];

    if(overVal == "over"){
      var colorScale = setColors("PuRd", name);
      var colorScaleName = "PuRd";
      var textCol = "#E82C0C";

       d3.selectAll(".tinyscore")
          .style("opacity", 0.1);

      // dim scrollpiece
      svgSidebar.selectAll(".scrollpiece")
        .style("fill-opacity", 0);

      d3.selectAll(".blockLabel")
        .style("opacity", 0.1);

    } else {
      var colorScale = setColors(currentColorScale, name);
      var colorScaleName = currentColorScale;
      var textCol = "#000";

      d3.selectAll(".tinyscore").style("opacity", 1);
      d3.selectAll(".blockLabel").style("opacity", 1);

      // dim scrollpiece
      svgSidebar.selectAll(".scrollpiece")
        .style("fill-opacity", .5);
    }

    

    //update color blocks on right hand side
    d3.selectAll(".breakdown").transition()        
        .duration(100)      
        .style("fill", function(d, i){var newcolorScale = setColors("Greys", columnList[i]);return newcolorScale(dataObj[columnList[i]]);});
    d3.selectAll(".passwordBreakdownLabel").transition()        
        .duration(100)      
        .text(function(d, i){if(i == 0){return dataObj['originalPassword']} else{return dataObj['permutedPassword'];}});
    
    var className = "#label"+elemArray[0];
      d3.select(className).transition()        
          .duration(100)      
          .style("fill", textCol);

    className = "#labelpermuted"+elemArray[0];
      d3.select(className).transition()        
          .duration(100)      
          .style("fill", textCol);

    className = ".label"+elemArray[1];
    svgColumns.selectAll(className).transition()        
        .duration(100)      
        .style("fill", textCol);
    className = className.replace("new", "");
    className = className.replace("breakdown", "");
    $(className).css('color', textCol);
    className = ".labelbreakdown"+elemArray[1];
    className = className.replace("new", "");
    svgBreakdown.selectAll(className).transition()        
        .duration(100)      
        .style("fill", textCol);

    if((gridType == 'changedata')&&(overVal == 'out')){
       // Change color scale for each row
       function changescale (datum) { 
          if(datum < 0) {
            colorScale = setColors("BlWt", name);
            return colorScale(datum);
          } else if (datum > 0) {
            colorScale = setColors("WtRd", name);
            return colorScale(datum);
          } else {
            return "#ffffff";
          }
        }

        // Change color scale for each step (column)
        function changescaleStep (datum, itemindex) { 
            if(datum < 0) {
              colorScale = setColors("BlWt", columnList[itemindex]);
              return colorScale(datum);
            } else if (datum > 0) {
              colorScale = setColors("WtRd", columnList[itemindex]);
              return colorScale(datum);
            } else {
              return "#ffffff";
            }
        }

        className = "."+elemArray[1]+"block";
        d3.selectAll(className).transition()        
              .duration(100)
              .style("fill", function(d, i){return changescale(d[name]);});

        className = "."+elemArray[1]+"tinyblock";
        d3.selectAll(className)
              .style({"fill": function(d, i){return changescale(d[name]);}, "opacity":1});


        className = "."+elemArray[0];
        d3.selectAll(className).transition()        
            .duration(100)      
            .style("fill", function(d, i){return changescaleStep(d[columnList[i]], i);});

        className = "."+elemArray[0]+"tinyblock";
        d3.selectAll(className)      
            .style({"fill": function(d, i){return changescaleStep(d[columnList[i]], i);} , "opacity":1});
            // console.log("changedata");

    } else {
      // Color columns
      className = "."+elemArray[1]+"block";
      d3.selectAll(className)     
            .style({"fill": function(d, i){return colorScale(d[name]);}, "opacity": function(d, i){if(overVal =="over"){return 1;} else{return 0;} }});

      className = "."+elemArray[1]+"tinyblock";
      d3.selectAll(className)
            .style({"fill": function(d, i){return colorScale(d[name]);}, "opacity":1});

      // Color rows
      className = "."+elemArray[0];
      d3.selectAll(className)      
          .style({"fill": function(d, i){var newcolorScale = setColors(colorScaleName, columnList[i]);return newcolorScale(d[columnList[i]]);}, "opacity":1});

      className = "."+elemArray[0]+"tinyblock";
      d3.selectAll(className)      
          .style({"fill": function(d, i){var newcolorScale = setColors(colorScaleName, columnList[i]);return newcolorScale(d[columnList[i]]);} , "opacity":1});


      // Refresh selection for hidden blocks
      refreshSelections();
    }

    var changeCol = "#000"; 
    className = "."+elemArray[1]+"breakdownchange";
    var passnum = elemArray[0].replace("password", "");
    passnum = parseInt(passnum);
    d3.selectAll(".breakdownPC")  
        .text(function(d, i){
          var valoriginal = Math.round(newData[passnum][columnList[i]]);
          var newname = "new"+columnList[i];
          var valnew = Math.round(newData[passnum][newname]);

          var result = valnew - valoriginal;
         
          return result;
        })
        .style("fill", function(d, i){
           var valoriginal = Math.round(newData[passnum][columnList[i]]);
          var newname = "new"+columnList[i];
          var valnew = Math.round(newData[passnum][newname]);

          var result = valnew - valoriginal;
           if(result < 0){
            changeCol = "#E82C0C";
          } else {
            changeCol = "#000";
          }
          return changeCol;
        });
}

// determine direction of movement and move large grid 
function dragmove(d) {
  var orgdy = last_position - d3.event.y * -1;
  
  svgsidebarelement = document.getElementById('chartsvg');
  var viewBox = svgsidebarelement.getAttribute('viewBox'); // Grab the object representing the SVG element's viewBox attribute.
  var viewBoxValues = viewBox.split(' ');       // Create an array and insert each individual view box attribute value (assume they're seperated by a single whitespace character).

  viewBoxValues[0] = parseFloat(viewBoxValues[0]);    
  viewBoxValues[1] = parseFloat(viewBoxValues[1])   // Convert string "numeric" values to actual numeric values.
  
  d3.select(this)
    .attr("x", d.x = minimapX )
    .attr("y", d.y = Math.max(10, Math.min($('body').height() - minimapHeight, d3.event.y)));
  
  if(!((d3.event.y) < -10 || d3.event.y > $('body').height())) {
      viewBoxValues[1] = (d3.event.y - 10) * scrollScale;
  }
   
  
  // // Move downward
  // if(orgdy < 0){
  //   viewBoxValues[1] += d3.event.y * scrollScale;  // Increase the y-coordinate value of the viewBox attribute to pan down.
  // } else {
  //   viewBoxValues[1] += orgdy;  // Decrease the y-coordinate value of the viewBox attribute to pan up. 
  // }

  svgsidebarelement.setAttribute('viewBox', viewBoxValues.join(' ')); // Convert the viewBoxValues array into a string with a white space character between the given values.
  last_position = d3.event.y;
}        

// Determines whether there should be a margin in the main diagram 
function getStepLeftMargin (i, breakBounds, breakMargin) {
  if(i > breakBounds[3]){
    return breakMargin*4;
  } else if(i > breakBounds[2]){
    return breakMargin*3;
  } else if(i > breakBounds[1]){
    return breakMargin*2;
  } else if (i > breakBounds[0]) {
    return breakMargin;
  }
    return 0;
}
