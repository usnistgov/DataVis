function refreshSelections() {
    for (var key in currentSelections) {
      currentSelections[key].style("opacity", 0);
    }
}


function drawLabels(){
  // Create labels for main diagram
      var passwordLabels = svg.selectAll(".passwordLabels")
          .data(newData)
          .enter().append("text")
            .text(function (d) { return escapeHTMLchars(d['originalPassword']); })
            .attr("x", +150)
            .attr("y", function (d, i) { return i * gridSize + margin.top + gridSize/2; })
            .style("text-anchor", "end")
            .attr("transform", "translate(0," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return "password mono hiderow" })
            .attr("id", function (d, i) { return "labelpassword"+i; });

      var permutedpasswordLabels = svg.selectAll(".permutedpasswordLabels")
          .data(newData)
          .enter().append("text")
            .text(function (d) { return escapeHTMLchars(d['permutedPassword']); })
            .attr("x", function(d, i){ return (columnList.length * (gridSize + 4)) + getStepLeftMargin(columnList.length, breakBounds, breakMargin)+ 150; })
            .attr("y", function (d, i) { return i * gridSize + margin.top + gridSize/2; })
            .style("text-anchor", "start")
            .attr("transform", "translate(0," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return "password mono hiderow" })
            .attr("id", function (d, i) { return "labelpermutedpassword"+i; });

      var stepLabels = svgColumns.selectAll(".stepLabel")
          .data(steps)
          .enter().append("text")
            .text(function(d, i) { return d; })
            .attr("x", 290 * -1)
            .attr("y", function(d, i) { return i * gridSize + 208 + getStepLeftMargin(i, breakBounds, breakMargin); })
            .style("text-anchor", "left", "fill", "#aaa")
            .attr("transform", "rotate(-90)")
            .attr("class", function(d, i){return "label"+columnList[i]+" stepLabel mono axis step "+columnList[i]});
}

function initializeBlocks(obj, name, index, newbreakMargin){
    for(var i = 0; i < columnList.length; i++){
      var newbreakMargin = getStepLeftMargin(i, breakBounds, breakMargin);
      if(i < ((columnList.length/2))){
        $('#password-meta-data-holder').append('<div class="data-holder-'+columnList[i]+' row data-holder-score-row label'+columnList[i]+'"><div class="right-align col-md-4"><p class="">'+steps[i]+':</p></div><div class="col-md-2 score-data" id="'+columnList[i]+'"><p></p></div><div class="col-md-2 score-data" id="new'+columnList[i]+'"><p></p></div><div class="col-md-4"><p>'+steps[i]+'</p></div></div>');
      }
      drawBlocks(columnVarList[i], columnList[i], i, newbreakMargin);
    }

    var colorScale = setColors(currentColorScale, name);
    var thisobj = obj.data(newData);

    // Initialize this block
    // Draw large grid
    thisobj.enter().append("rect")
        .attr("class", function(d, i){return "blockLabel score bordered "+"password"+i+" "+name+" "+d['originalPassword']+" "+ d['permutedPassword']+" "+name+"block hiderow";})
        .attr("id", function(d){return d['originalPassword'] + name;})
        .style("fill", colors[currentColorScale][0])
        .on("mouseover", function(d){return hoverBlock(d, name, this, "over")})
        .on("mouseout", function(d){return hoverBlock(d, name, this, "out")})
        .attr("value", function(d){return d[name];});
    // exit transition
    thisobj
        .exit().transition()
        .duration(1000)
        .attr("width", 0)
        .attr("height", 0)
        .style("fill", function(d) { return colorScale(d[name]); }).remove();

    // Initialize small grid
    var tinyBlock = svgSidebar.selectAll(".tinyblock")
    .data(newData)
      .enter().append("rect")
        .style("fill", function(d) { return colorScale(d[name]); })
        .attr("class", function(d, i){return "tinyscore password"+i+"tinyblock "+name+"tinyblock hiderow";})
        .attr("value", function(d){return d[name];});

    drawBlocks (obj, name, index, newbreakMargin, colorScale);
}

// Draw main grid on left hand side and minimap grid
function drawBlocks (obj, name, index, newbreakMargin, colorScale) {
    // var colorScale = setColors(currentColorScale, name);
    // var thisobj = obj.data(newData);

    // // Initialize this block
    // // Draw large grid
    // thisobj.enter().append("rect")
    //     .attr("class", function(d, i){return "blockLabel score bordered "+"password"+i+" "+name+" "+d['originalPassword']+" "+ d['permutedPassword']+" "+name+"block hiderow";})
    //     .attr("id", function(d){return d['originalPassword'] + name;})
    //     .style("fill", colors[currentColorScale][0])
    //     .on("mouseover", function(d){return hoverBlock(d, name, this, "over")})
    //     .on("mouseout", function(d){return hoverBlock(d, name, this, "out")})
    //     .attr("value", function(d){return d[name];});
    // // exit transition
    // thisobj
    //     .exit().transition()
    //     .duration(1000)
    //     .attr("width", 0)
    //     .attr("height", 0)
    //     .remove();

    // // Draw small map of blocks
    // // Initialize
    // var tinyBlock = svgSidebar.selectAll(".tinyblock")
    // .data(newData)
    //   .enter().append("rect")
    //     .style("fill", function(d) { return colorScale(d[name]); })
    //     .attr("class", function(d, i){return "tinyscore password"+i+"tinyblock "+name+"tinyblock hiderow";})
    //     .attr("value", function(d){return d[name];});


    thisobj = svg.selectAll(name);
    // Update blocks
    svg.selectAll(name)
        .attr("x", function(d, i) { return  index * gridSize + gridMargin + newbreakMargin; })
        .attr("y", function(d, i){return i * gridSize + margin.top + gridSize/2;})
        // .attr("transform", function(d, i){return "translate("+ (index * gridSize + gridMargin + newbreakMargin) + "," + (i * gridSize + margin.top + gridSize/2) +")";})
        // .attr("rx", 50)
        // .attr("ry", 50)
        .transition()
        .duration(1000)
        .attr("width", gridSize)
        .attr("height", gridSize);
        
    // Determine Fill colors
    fillBlock(thisobj, colorScale, name);

    // Update blocks
    svg.selectAll(".tinyscore")
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

function fillBlock(block, colorScale, name) {
    if(gridType == 'changedata'){
      block
        .transition()
        .duration(1000)
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

// Draw navigotion panel
function drawScrollpiece () {
  svgSidebar.selectAll(".scrollpiece")
    .data(d3.range(1).map(function() { return {x: 0, y: 10}; })).enter()
    .append("rect")
    .attr("width", function(){ return columnList.length * tinyBlockSize})
    .attr("height", minimapHeight)
    .style("fill-opacity", 0)
    .style("stroke-opacity", .5)
    .attr("class", "minimapScrollpiece")
    .style("stroke", "red")
    .style("stroke-width", "2")
    // .style("opacity",0)
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
    var columnBreak = 2;
    var leftMargin = 65;

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
        .attr("y", function(d, i) { if(i > 7){var newtopMargin = topMargin + smallgridSize;} else{var newtopMargin = topMargin}return smallgridSize + newtopMargin; })
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
          if(i%(columnList.length/2) > ((columnList.length/2)-3)){
            breakMargin = breakMarginVal;
          } else {
            breakMargin = 0;
          }
          return i * smallgridSize + (smallgridSize/2) + breakMargin + leftMargin;
           })
        .attr("x", (-1 *topMargin + 10) )
        .style("text-anchor", "left")
        .attr("transform", "rotate(-90)")
        .attr("class", function(d, i){return "stepLabelsBreakdown timeLabel mono axis labelbreakdown" + columnList[i]+ " "+columnList[i];});

    // Password labels
    passwordLabelBreakdown
      .data(passwordBreakdownLabels)
      .enter().append("text")
        .text(function(d, i) { if(i == 0){return newData[0]['originalPassword']}else{return newData[0]['permutedPassword']}; }).style("text-anchor", "right")
        .attr("x", leftMargin + (smallgridSize * (columnList.length/2 + 1)) )
        .attr("y", function(d, i) { return i * (smallgridSize) + topMargin + (.65 *smallgridSize); } )
        .attr("class", function(d, i){return "passwordBreakdownLabel mono axis labelBreakdown" + columnList[i]});

    // Left hand password labels
    passwordLabelBreakdownLeft
      .data(passwordBreakdownLabels)
      .enter().append("text")
        .text(function(d, i) { return d;}).style("text-anchor", "right")
        .attr("x", 20 )
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

function hoverBlock(dataObj, name, obj, overVal, rangeList) { 
    $('.original-password-holder h3').html(escapeHTMLchars(dataObj['originalPassword']));
    $('.permuted-password-holder h3').html(escapeHTMLchars(dataObj['permutedPassword']));
    for(var i = 0; i < columnList.length; i++){
      $('#'+columnList[i] + ' p').html(Math.round(dataObj[columnList[i]]));
    }
    if(overVal == "over"){
      var colorScale = setColors("PuRd", name);
      var colorScaleName = "PuRd";
      var textCol = "#E82C0C";

       d3.selectAll(".tinyscore")
          .style("opacity", 0.2);
    } else {
      var colorScale = setColors(currentColorScale, name);
      var colorScaleName = currentColorScale;
      var textCol = "#aaa";

      d3.selectAll(".tinyscore").style("opacity", 1);
    }

    var element = d3.select(obj).attr("class");
    var elemArray = element.split(" ");

    //update color blocks on right hand side
    d3.selectAll(".breakdown").transition()        
        .duration(100)      
        .style("fill", function(d, i){var newcolorScale = setColors("Greys", columnList[i]);return newcolorScale(dataObj[columnList[i]]);});
    d3.selectAll(".passwordBreakdownLabel").transition()        
        .duration(100)      
        .text(function(d, i){if(i == 0){return dataObj['originalPassword']} else{return dataObj['permutedPassword'];}});
    // d3.selectAll(".changeBreakdown").transition()        
    //     .duration(100)      
    //     .style("fill", function(d, i, rangeList){var newcolorScale = setColors("GnYlRd", 0);
    //       var origVal = dataObj[columnList[i]];
    //       var newVal = dataObj[columnList[i + (columnList.length * 1/2)]];
    //       var domain = getColorDomain(columnList[i]);
    //       var change = (newVal - origVal)/domain[1];
          
    //       return newcolorScale(change);
    //     });

    elemArray.splice(0, 3);
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

        function changescaleStep (datum, itemindex) { 
          if(i > 0){
            if(datum < 0) {
              colorScale = setColors("BlWt", columnList[itemindex]);
              return colorScale(datum);
            } else if (datum > 0) {
              colorScale = setColors("WtRd", columnList[itemindex]);
              return colorScale(datum);
            } else {
              return "#ffffff";
            }
          } else {
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
        }

        className = "."+elemArray[1]+"block";
        d3.selectAll(className).transition()        
              .duration(100)
              .style("fill", function(d, i){return changescale(d[name], -1);});

        className = "."+elemArray[1]+"tinyblock";
        d3.selectAll(className)
              .style({"fill": function(d, i){return changescale(d[name], -1);}, "opacity":1});


        className = "."+elemArray[0];console.log(className);
        d3.selectAll(className).transition()        
            .duration(100)      
            .style("fill", function(d, i){return changescaleStep(d[columnList[i]], i);});

        className = "."+elemArray[0]+"tinyblock";
        // console.log(className);
        d3.selectAll(className)      
            .style({"fill": function(d, i){return changescaleStep(d[columnList[i]], i);} , "opacity":1});

    } else {
      className = "."+elemArray[1]+"block";
      d3.selectAll(className).transition()        
            .duration(100)      
            .style("fill", function(d){return colorScale(d[name]);});

      className = "."+elemArray[1]+"tinyblock";
      d3.selectAll(className)
            .style({"fill": function(d){return colorScale(d[name]);}, "opacity":1});

      className = "."+elemArray[0];
      d3.selectAll(className).transition()        
          .duration(100)      
          .style("fill", function(d, i){var newcolorScale = setColors(colorScaleName, columnList[i]);return newcolorScale(d[columnList[i]]);});

      className = "."+elemArray[0]+"tinyblock";
      // console.log(className);
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
            changeCol = "#aaa";
          }
          return changeCol;
        });
}

  // determine direction of movement and move large grid 
  function dragmove(d) {
    // console.log(d3.event.y +" from "+last_position);
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
    //   console.log("increment");
    // } else {
    //   viewBoxValues[1] += orgdy;  // Decrease the y-coordinate value of the viewBox attribute to pan up. 
    //   console.log("decrement");
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
