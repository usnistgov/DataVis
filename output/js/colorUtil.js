function getColorDomain (name, rangeList, data) {

            name = name.replace("new", "");
            name = name.replace("original", "");

            var domain = rangeList[name];
            var min = domain[0];
            var max = domain[1];

            if(min == "min"){
              var minOrig = d3.min(data, function (d) { return d[name]; });
              var minNew = d3.min(data, function (d) { return d['new'+name]; });

              if(minOrig < minNew){
                min = minOrig;
              } else {
                min = minNew;
              }
            }

            if(max == "max"){
              var maxOrig = d3.max(data, function (d) { return d[name]; });
              var maxNew = d3.max(data, function (d) { return d['new'+name]; });

              if(maxOrig > minNew){
                max = maxOrig;
              } else {
                max = maxNew;
              }
            } 

            domain = [min, max];
            return domain;
          }

function setColors(colorScheme, name, rangeList, data){
  console.log(rangeList);

  if(name == 0){
    var colorScale = d3.scale.linear()
        .domain([-1, 1])
        .range(colors[colorScheme]);
  } else {
    var colorScale = d3.scale.quantile()
        .domain(getColorDomain(name, rangeList, data), rangeList)
        .range(colors[colorScheme]);
  }
  
  return colorScale;
}