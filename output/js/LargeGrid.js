function LargeGrid (gridEnvironment) {
    this.gridMargin = 180;
    this.gridEnvironment = gridEnvironment;
    this.viewBox = "0 0 " + $('#chart').width() + " " + ($('body').height() - 300);
    this.svg;
    this.svgColumns;
    this.breakMargin = 20;

	this.bBox;

    this.breakBounds = computeBreakBounds();

    function computeBreakBounds () {
    	var values = [];

    	$.each(gridEnvironment.originalColumnList, function () key, value) {
    		if(key == 'lpd', key == 'ipadkeystrokes') {
    			values.push(value);
    		} else if (key == 'newentropy',key == 'newdesktopkeystrokes'){
    			values.push(value - 1);
    		}

    	});
		console.log(this.breakBounds)
    	return [6, 9, 11, 14];
    }
}

LargeGrid.prototype.drawGrid = function() {
    for(var ind = 0; ind < columnList.length; ind++){
      var name = gridEnvironment.columnList[ind]; //key for current column
      var colorScale = setColors(currentColorScale, name);
      // var thisobj = columnVarList[i];
      console.log(name);

      // Initialize this block
      // Draw large grid
      var thisobj = columnVarList[name].data(thisData);
      
      thisobj
          .enter()
          .append("rect")
          .attr("class", function(d, i){return "blockLabel score bordered "+"password"+i+" "+name+" "+d['originalPassword']+" "+ d['permutedPassword']+" "+name+"block hiderow";})
          .attr("id", function(d){return d['originalPassword'] + name;})
          .style("fill", colors[currentColorScale][0])
          .on("mouseover", function(d, i){console.log(ind+":  "+columnList[ind]); return hoverBlock(d, columnList[ind], this, "over", rangeList)}) //dataObj, name, obj, overVal, rangeList
          .on("mouseout", function(d, i){return hoverBlock(d, columnList[ind], this, "out", rangeList)})
          .attr("value", function(d){return d[name];});
      // exit transition
      thisobj
          .exit().transition()
          .duration(1000)
          .attr("width", 0)
          .attr("height", 0)
          .style("fill", function(d) { return colorScale(d[name]); }).remove();
      console.log(thisobj);


      // Initialize
      var tinyBlock = svgSidebar.selectAll(".tinyblock")
      .data(thisData)
        .enter().append("rect")
          .style("fill", function(d) { return colorScale(d[name]); })
          .attr("class", function(d, i){return "tinyscore password"+i+"tinyblock "+name+"tinyblock hiderow";})
          .attr("value", function(d){return d[name];});

        // drawBlocks(columnVarList[i], columnList[i], i, newbreakMargin); //obj, name, index, newbreakMargin
    }
}