function LoadingScreen () {

}
LoadingScreen.showScreen = function(data, callback){
  $('#loadingScreen').show();
  spinner.spin(target);
  callback(data, LoadingScreen.hideScreen);
};

LoadingScreen.hideScreen = function(){
  $('#loadingScreen').hide();
  spinner.stop();
};

function guievents (){

  $(".sortBtn").click(function(){
    var id = $(this).children().attr("id");
    $('.display-btn').addClass('active');
    LoadingScreen.showScreen(id, sort);

  });

  $(".databtn").click(function(){
    var id = $(this).children().attr("id");
    $('.display-btn').addClass('active');
    $('#chartBreakdown').toggle();
    LoadingScreen.showScreen(id, changeDataUsed);
  
  });
  
  $(".display-btn").click(function(){
    var id = $(this).attr("id");
    id = id.replace("display", "");
    LoadingScreen.showScreen(id, updateSteps);
  });
  
}

function initializeSliders() {
  // console.log(sliderRanges);
     $( ".slider" ).each(function(){
        var id = $(this).attr("id");
        var labelid = "#" + id + "Range";
        var range = sliderRanges[id];
        $(labelid).html(range[0] + " - " + range[1]);
        // console.log(range);

        currentSelections[id] = d3.selectAll("password");

        $(this).empty().slider({
                orientation: "horizontal",
                range: true,
                min: range[0],
                max: range[1],
                values: range,
                slide: function( event, ui ) {
                  var type = $(event.target).attr("id");
                  console.log(type);
                  filterPasswords( type, ui.values );
                  var labelid = "#" + id + "Range";
                  $(labelid).html(ui.values[0] + " - " + ui.values[1]);
                 // LoadingScreen.showScreen();
                }
        });
     });
}

function filterPasswords (type, range) {
  // Select all passwords and have them appear
  d3.selectAll(".hiderow")    
        .style("opacity", 1);

   // // // Move blocks
   // var  heightCounter = 0;
   // for(var inc = 0; inc < columnList.length/2; inc++){
   //  var thisclassname = "."+columnList[i] + "block";
   //  d3.selectAll(thisclassname)
   //  .attr("transform", function(d, i) { 
   //    if((d[type] >= range[0] && d[type] <= range[1])){
   //      console.log(this);
   //      var t = d3.transform(d3.select(this).attr("transform"));
   //      var x = t.translate[0];
   //      return  "translate(" + x + "," + (heightCounter * gridSize + margin.top + gridSize/2) + ")";
   //      heightCounter += 1;
   //    }
   //  });
   // }
  

  // refresh the selection with this data
  currentSelections[type] = d3.selectAll(".hiderow").filter(function(d) { return (d[type] < range[0] || d[type] > range[1]); });

  // select all previous selections that should be hidden and rehide them
  // select all passwords not apearing because of recent change and hide them

  // loop through currentSelections[]
  refreshSelections();
}
  

function changeDataUsed (type, callback){
  d3.select(".minimapScrollpiece").attr("y", 10);
  svg.remove();
  svgColumns.remove();
  svgBreakdown.remove();
  svgSidebar.remove();
  
  if(type == 'changescore'){
    gridType = "changedata";
    newData = changeData;
    drawGrid(newData, gridType);
  } else if (type == 'rawscore'){
    gridType = "rawdata";
    newData = originalData;
    drawGrid(newData, gridType);
  }
  callback();
}

function sort(type, callback){
  d3.select(".minimapScrollpiece").attr("y", 10);
  svg.remove();
  svgColumns.remove();
  svgBreakdown.remove();
  svgSidebar.remove();
  
  // console.log(originalData);
  
  if(type == "entropy"){
    newData.sort(compareentropy);
  } else if (type == "lpd") {
    newData.sort(comparelpd);
  } else if (type == "keystrokes") {
    newData.sort(comparekeystrokes)
  } else {
    newData.sort(comparepasswords);
  }

  // console.log(newData);
  // console.log(svg.selectAll(".blockLabel"));

  drawGrid(newData, gridType);
  
  // for(var i = 0; i < columnList.length; i++){
  //   var selector = "password" + i;
      // console.log(svg.selectAll(".blockLabel").selectAll(selector));

  //   svg.selectAll(".blockLabel").selectAll(selector)
  //     .transition()
  //     .duration(200)
  //     .attr("transform", function(d, i){return "translate(0,"+ ((i - 1) * gridSize + 350) +")";});
  // }

  callback();
}

// Hide selected columns and move the remaining columns left/right 
function updateSteps(column, callback) {
  var orgcolumn = "."+column;
  var name = orgcolumn+"block";
  var newcolumn = ".new"+column;

  var orgtinycolumn = "."+column+"tinyblock";
  var orgtinynewcolumn = ".new"+column+"tinyblock";

  var orgcolumnindex =  columnList.indexOf(column);
  var newcolumnindex =  orgcolumnindex + columnList/2;
  
  var increment = gridSize;
  var tinyincrement = tinyBlockSize;
  
  if(d3.select(name).attr("width") > 0) {
    d3.selectAll(orgcolumn).transition()
        .duration(200).attr("opacity", 0).attr("width", 0);
    d3.selectAll(newcolumn).transition()
        .duration(200).attr("opacity", 0).attr("width", 0);
    d3.selectAll(orgtinycolumn).transition()
        .duration(200).attr("opacity", 0).attr("width", 0);
    d3.selectAll(orgtinynewcolumn).transition()
        .duration(200).attr("opacity", 0).attr("width", 0);
    
  } else {
    d3.selectAll(orgcolumn).attr("width", gridSize).transition()
        .duration(200).attr("opacity", 1);
    d3.selectAll(newcolumn).attr("width", gridSize).transition()
        .duration(200).attr("opacity", 1);
    d3.selectAll(orgtinycolumn).attr("width", tinyBlockSize).transition()
        .duration(200).attr("opacity", 1);
    d3.selectAll(orgtinynewcolumn).attr("width", tinyBlockSize).transition()
        .duration(200).attr("opacity", 1);
    
    increment *=-1;
    tinyincrement *=-1;
  }
  var numsteps = columnList.length/2;
  for (var i = 0; i < numsteps; i++) {
    if(i < orgcolumnindex){
      var item = "."+columnList[i]+"block";
      var permuteditem = ".new"+columnList[i]+"block";
      var tinyitem = "."+columnList[i]+"tinyblock";
      var tinypermuteditem = ".new"+columnList[i]+"tinyblock";
      var itemlabel = ".label"+columnList[i];
      var permuteditemlabel = ".labelnew"+columnList[i];

      // console.log("inc "+columnList[i]+": "+ increment);
      
      var newitem = d3.selectAll(item);
      var newpermuteditem = d3.selectAll(permuteditem);
      var newitemlabel = d3.selectAll(itemlabel);
      var newpermuteditemlabel = d3.selectAll(permuteditemlabel);
      var newtinyitem = d3.selectAll(tinyitem);
      var newtinypermuteditem = d3.selectAll(tinypermuteditem);

      var t = d3.transform(d3.select(item).attr("transform"));
      var xvar = t.translate[0];

      var t1 = d3.transform(d3.select(permuteditem).attr("transform"));
      var xvarpermuted = t1.translate[0];

      var t2 = d3.transform(d3.select(tinyitem).attr("transform"));
      var xvartiny = t2.translate[0];

      var t3 = d3.transform(d3.select(tinypermuteditem).attr("transform"));
      var xvartinypermuted = t3.translate[0];

      newitem.transition()
        .duration(200).attr("transform", "translate("+(xvar+increment)+", 0)");
      newpermuteditem.transition()
        .duration(200).attr("transform", "translate("+(xvarpermuted+(-1*increment))+", 0)");
      newitemlabel.transition()
        .duration(200).attr("transform", "translate("+(xvar+increment)+", 0)rotate(-90)");
      newpermuteditemlabel.transition()
        .duration(200).attr("transform", "translate("+(xvarpermuted+(-1*increment))+", 0)rotate(-90)");
      newtinyitem.transition()
        .duration(200).attr("transform", "translate("+(xvartiny+tinyincrement)+", 0)");
      newtinypermuteditem.transition()
        .duration(200).attr("transform", "translate("+(xvartinypermuted+(-1*tinyincrement))+", 0)");
    }
  }

  callback();
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
    
    if(!((d3.event.y) < -10 || d3.event.y > $('body').height()+10)) {
        viewBoxValues[1] = d3.event.y * scrollScale;
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