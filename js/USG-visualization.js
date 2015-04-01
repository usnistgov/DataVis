/*


*/
USG.visualization = {};
(function(){
	// environment
	this.environment = ( function(){

		/* Private Methods */
		
		// Class EnvironmentInstance
		// Holds a dataset and associated visualizations for that dataset.
		var EnvironmentInstance = function( callback ){

			this.createData = dataset;
			this.datasets = []; // Array of dataset objects stored here ( loadData(); )
			this.metricSet = metric.createSet(  ); // Set of all metrics used in this environment 
			this.visualizations = []; // Array of visualization objects for this environment ( heatmap, etc. )

			gui.initialize( callback ); // Set up gui (Asychronous) then execute callback

		};
		EnvironmentInstance.prototype = {
			
			// Adds a HeatmapSet visualization to the environment
			// @Param: dataLocation: String. Key representing where the dataFile is located ( no .csv )
			// @Param: config: String. What type of configuration should the heatmap use. Accepted type(s): "default"
			addHeatmapSet: function ( dataLocation, config ){
				// If the dataset exists, visualize
				if( this.datasets[ dataLocation ] ){

					// Create visualization key
					var visualizationKey = "heatmap-" + dataLocation;

					// Create heatmap in visualizations[] with "heatmap-[dataLocation] as a key"
					// Parameters: dataLocation: where data is located, visualizationKey: unique identifier for this visualization , dataset: dataset object corresponding with the dataLocation identifier, config: type of configuration the heatmap is using, metricSet: metricSet object 
					this.visualizations[visualizationKey] = heatmap.create( dataLocation , visualizationKey , this.datasets[ dataLocation ] , config , this.metricSet );


				} else {

					console.log("No data found. Try loading " + dataLocation + " using environment.loadData( \"fileLocation\" )")
				}
				
			},

			// Loads a .csv file into the visualization. Creates metric objects used in the visualization
			// @param: 
			// 		dataLocation - String. Url of releative location of csv file
			// 		callback - function(). Optional. 
			loadData: function( dataLocation, callback ){
				
				var thisObj = this;

				// Load data using d3.js
				d3.csv( dataLocation , function parseRows ( d ) {

					// For each property in a row ( d ) 
		        	for ( var prop in d ) {

		        			// Add metric to the metric set
		            		thisObj.metricSet.addMetric( prop );

		            		// if datatype is not a string
		            		// All unidentified metrics will be assumed to be Strings
		            		if( !thisObj.metricSet.isString( prop ) ) {
		            			d[prop] = +d[ prop ];
		            		}

		            }

		            return d;

		        }, function done ( error, data ) {
					
		        	var rReplace = /\.csv/g;
					dataLocation = dataLocation.replace(rReplace, "");

					if ( data ) {
						console.log( "Metrics created:");
						console.log( thisObj.metricSet );
						dataset = data;
						console.log( "Data Loaded:");
						console.log( data );
					}
					
					if ( error ){
						console.log( error.stack );
					}

					// Add dataset
					thisObj.datasets[ dataLocation ] = thisObj.createData.create( data );

					// Initialize metric domains
					thisObj.metricSet.setDomains( thisObj.datasets[ dataLocation ], dataLocation );
					callback();

				});
	
			}
		};

		/* Public Methods */

		// Create and return environmentInstance
		var create = function( callback ){
			return new EnvironmentInstance( callback );
		};

		var dataset = ( function(){
			
			var DatasetInstance = function ( data ) {
				this.dataset = data; // Holds data 
				this.metrics = []; // List of which metrics the data has


				for( prop in this.dataset[0]){
					this.metrics[prop] =  true;
				}

			};
			DatasetInstance.prototype = {
				hasMetric: function ( metricName ) {
					
					if(this.metrics[metricName]){

						return true;
					
					} 

					return false;

				},
				sortData: function ( byMetricType ){

					var metricName = byMetricType;

					var sortDataset = function ( a , b ) {

						if (a[ metricName ] < b[ metricName ])
						   return -1;
						if (a[ metricName ] > b[ metricName ])
						   return 1;
						// a must be equal to b
						return 0;

					};

					this.dataset.sort( sortDataset );

				},
				getData: function () {
					return this.dataset;
				}
			};

			var create = function( data ){
				if( data ){

					return new DatasetInstance( data );
				
				} else {
				
					console.log("No data found. Cannot create Dataset");
				
				}
				
			};

			return {
				create: create
			};
		})();

		// environment.heatmap
		var heatmap = ( function(){
			var thisObj = this;

			/* Private Methods */
			// Class HeatmapSet
			// Holds a dataset and associated visualizations for that dataset
			var HeatmapSet = function ( dataKey , visualizationKey , dataset , config , metricSet ){
				
				this.key = visualizationKey; // Key for specific heatmap
				this.dataKey = dataKey; // Key for data heatmap is representing

				this.tiers = [];
				this.metricSet = metricSet;

				this.dataset = dataset;

				this.colorscheme = {
					normal: USG.constants.colors.colorbrewer.Greys[9],
					highlight: USG.constants.colors.colorbrewer.WtRd[9]
				}


				var thisObj = this;

				var addHTML = function( tiers ) {
					var tierHTML = "";
					for(var i = 0; i < tiers.length; i++){
						tierHTML += '' + tiers[i].getHTML();
					}
					var html = ('<div class="col-sm-12 full-height"><div class="container-fluid full-height"><div class ="row heatmap" id=' + thisObj.key + '>' + tierHTML + '</div></div></div>');
						
					// Append a container and contents for the heatmap
					$( "#vizualizations-holder" ).append( html );

					// Opt in bootstrap tooltips ( hint callouts )
					$(function () {
					  $('[data-toggle="tooltip"]').tooltip();
					})
				};

				var initializeTiers = function() {
					if ( thisObj.tiers ) {
						
						for (var i = 0; i < thisObj.tiers.length; i++) {
							thisObj.tiers[i].initialize();
						};

					}
				};
				
				var init = function ( config, thisObj ) {
					
					thisObj.setMetricColorScheme();
					
					thisObj.metricSet.setDefaultVisibility( thisObj.dataKey , thisObj.key );

					// default config	
					if( config == "default" ){

						console.log("Create heatmap with default config");

						// Create new tier1, tier2, tier3
						var defTiersCreated = $.Deferred();
						thisObj.createTiers([2, 1, 3]);
						thisObj.connectTiers([0,1,2]);
						thisObj.connectTiers([1,0,2]);
						thisObj.connectTiers([2,0,1]);
						defTiersCreated.resolve(thisObj.tiers);

						// Load html for tiers
						defTiersCreated.done(function(tiers){

							$.when( tiers[0].loadHTML() , tiers[1].loadHTML() , tiers[2].loadHTML() ).done(function () {
								addHTML( tiers );
								initializeTiers( thisObj.categories );
							}); 

						});
						
					}
				}

				init( config , thisObj );

				
			};
			HeatmapSet.prototype = {
				// Set the color scheme for the metrics using this heatmap's key
				setMetricColorScheme: function ( ) {
				
					this.metricSet.setColorScheme( this.dataKey , this.key , this.colorscheme );

				}, 
				// Create and add tiers to this object.
				// @Param: whichTiers: Array. Each index in the array represents a new tier to create. The value of each index represents the type of tier to create.
				createTiers: function ( whichTiers ) {
					var thisObj = this;

					for (var i = 0; i < whichTiers.length; i++) {
						var index = thisObj.tiers.length; // Represents the unique identifier of the new tier

						// Ensure the type is accounted for
						if( whichTiers[i] == 1 || whichTiers[i] == 2 || whichTiers[i] == 3){
							// Will append html to the heatmap container
							// dataKey, key, type , dataset, htmlElem, metricSet
							thisObj.tiers.push ( tier.create( thisObj.dataKey, index, ( whichTiers[i] ) , thisObj.dataset , thisObj.key , thisObj.metricSet ) );
						}
						
						
					}

				},
				// Connect tiers to each other.
				// @Param: whichTiers. Array of the indexes of this.tiers[] to be connected.
				// whichTiers[0] is the tier to be connected to whichTiers[i]
				connectTiers: function ( whichTiers ) {

					for(var i = 1; i < whichTiers.length; i++) {
						var tier = this.tiers[ whichTiers[i] ];

						this.tiers[ whichTiers[0] ].connect( tier );

						console.log(whichTiers[0] + " connected to " + whichTiers[i]);
					
					}

				}
			};

			/* Public Methods */
			// Create and return HeatmapSet
			var create = function( dataKey , visualizationKey , dataset, config , metricSet ){
				// Create HeatmapSet and return it
				return new HeatmapSet( dataKey , visualizationKey , dataset , config , metricSet );
			};

			// environment.heatmap.gui
			var gui = ( function(){

				// Url to the heatmap html template file to be loaded.
				var EXTERNAL_HTML = {
				
					heatmapHolder: "html/heatmap.html"
				
				}

				return {

					EXTERNAL_HTML: EXTERNAL_HTML
				
				};

			})();

			// environment.heatmap.tiers
			var tier = ( function(){

				/* Private Methods */

				// Generic tier
				// Generic version of heatmap grid.
				var TierInstance = function( type , dataKey , key , dataset , htmlElem , metricSet ){
					var thisObj = this;
					this.key = key;
					this.parentKey = htmlElem;
					this.dataKey = dataKey;
					this.dataset = dataset;
					this.metricSet = metricSet;

					// this.gridmetricSet = metricSet.getOrderedMetrics();

					this.orderedMetrics = metricSet.orderCategories( dataKey , this.parentKey );

					this.html = {
						parentContainer: htmlElem,
						id: "",
						url: "html/tier" + type + ".html",
						markup: {}
					};

					this.grid = {
						size: {
							width: 5,
							height: 5
						}
					}

					this.margin = {
						top: 0
					};

					this.type = type;

					this.connectedTiers = [];

					this.hiddenRows = {};

					this.totalGutterCount = 0;

				};
				TierInstance.prototype = {
					// Loads html into this.html. Returns deferred promise object.
					loadHTML: function () {
						var deferred = $.Deferred(); // Create deferred object
						var thisObj = this; 

						// Load HTML
						var request = $.ajax({
							url: this.html.url,
							dataType: 'html'
						});

						// Process loaded HTML
						$.when(request).done(function( data ){

							var rId = "id=\"heatmap-tier" + thisObj.type + "\""
							var rId = new RegExp( rId , "g" );

							// Add specialized id for this tier
							var rReplace = "id=\"tier" + thisObj.type + "-" + ( thisObj.html.parentContainer ) + "\""; 
							data = data.replace( rId , rReplace );
							
							thisObj.html.markup = data;
							thisObj.html.id = "tier" + thisObj.type + "-" + thisObj.html.parentContainer;
							deferred.resolve(); 

						});
							
						return deferred.promise();
					},
					// Counts the total count of gutters ( spaces between column categories )
					countGutters: function () { 
						var gutterFlag = false;
						var thisObj = this;
						this.gutterCount = 0;

						for(var categoryIndex = 0; categoryIndex < thisObj.orderedMetrics.length ; categoryIndex++ ){
							
							var categoryName = thisObj.orderedMetrics[categoryIndex].name;

							if(!thisObj.metricSet.categories[categoryName].allString){

								for(var metricIndex = 0; metricIndex < thisObj.orderedMetrics[categoryIndex].metrics.length; metricIndex++ ){
									
									var metricName = thisObj.orderedMetrics[categoryIndex].metrics[metricIndex];

									
									if( (!thisObj.metricSet.isString( metricName )) ){

										if( thisObj.metricSet.isVisible( metricName , thisObj.dataKey , thisObj.parentKey ) ){

											thisObj.visibleColumnCount++;
											gutterFlag = true;

										}

									}

								} // End metric loop

								if ( gutterFlag ) {

									thisObj.gutterCount++;
									gutterFlag = false;

								}
							}
						
						} //End category Loop

						this.totalGutterCount = thisObj.gutterCount;
					},
					// Establishes the visuals of the tier. Needs to be implemented by a subclass. 
					visualize: function () { 

						var nameclass = this.html.id;
							
						$(nameclass).html('');

					},
					// Defines svg properties and creates svg objects for the tier. Needs to be implemented by a subclass. 
					createsvg: function () { 

						console.log( " Implement this method. " );

					},
					// Starts up the visualization of the tier. Initializes all properties.
					initialize: function ( ) {

						this.createsvg();
						this.visualize();
							

					},
					// Returns the HTML markup of this tier.
					getHTML: function (  ) {
						return this.html.markup;
					}, 
					// Loops through all non-string metrics and executes the passed draw function 
					draw: function ( drawFunction, selector ) {

						var currentMetricIndex = 0,
							thisObj = this;
							nonPermutedMetricCount = 0,
							permutedFlag = false, 
							gutterFlag = false;
						
						thisObj.countGutters();
						this.gutterCount = 0;

						thisObj.visibleColumnCount = 0;

						for(var categoryIndex = 0; categoryIndex < thisObj.orderedMetrics.length ; categoryIndex++ ){
							
							var categoryName = thisObj.orderedMetrics[categoryIndex].name;

							if(!thisObj.metricSet.categories[categoryName].allString){

								for(var metricIndex = 0; metricIndex < thisObj.orderedMetrics[categoryIndex].metrics.length; metricIndex++ ){
									
									var metricName = thisObj.orderedMetrics[categoryIndex].metrics[metricIndex];

									
									if( (!thisObj.metricSet.isString( metricName )) ){

										if( thisObj.metricSet.isPermuted( metricName ) ){

											var currentMetricCount = currentMetricIndex - nonPermutedMetricCount;

										} else {

											var currentMetricCount = currentMetricIndex;

										}

										// Determine column x value
										var totalColumns = thisObj.visibleColumnCount + thisObj.gutterCount;

										var totalIndex = ((thisObj.metricSet.getCount( thisObj.dataKey , thisObj.parentKey , "visible" ) + (thisObj.totalGutterCount))/2); // total columns + gutters / 2
										var offsetIndex =  totalColumns - totalIndex;

										var offset = (offsetIndex * (thisObj.grid.size.width - .2));
										var x = offset + thisObj.svg.dimensions.widthMidpoint + (thisObj.grid.size.width/2);

										if( drawFunction ){
											drawFunction( thisObj , thisObj.gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x );
										}
										

										currentMetricIndex++;

										if( thisObj.metricSet.metrics[metricName].permuted.type != "permuted"  ){

											nonPermutedMetricCount++;

										}

										if( thisObj.metricSet.isVisible( metricName , thisObj.dataKey , thisObj.parentKey ) ){

											thisObj.visibleColumnCount++;
											gutterFlag = true;

										}

									}

								} // End metric loop

							}

							if ( gutterFlag ) {

								thisObj.gutterCount++;
								gutterFlag = false;

							}
						
						} //End category Loop

						this.totalGutterCount = thisObj.gutterCount;

					},
					// Template for what a draw function could look like
					drawFunction: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {

						console.log("Implement this method");

					},
					drawGrid: function ( ) {
							var thisObj = this;
							
							var gutter = thisObj.totalGutterCount;
							var offsetIndex =  (thisObj.metricSet.getCount( thisObj.dataKey , thisObj.parentKey , "visible" ) + gutter)/2;
									
							var offset = -1 * thisObj.grid.size.width * offsetIndex;

							var x = offset + thisObj.svg.dimensions.widthMidpoint;

							// this.svg.obj.append("circle")
							// 	.attr("x" , function(){
							// 		return x;
							// 	})
							// 	.attr("r", (thisObj.grid.size.width/4))
							// 	.attr("transform", function(d, i) {
									
							// 		return "translate(" + x + ", " + ((thisObj.grid.size.height/2) + thisObj.margin.top) + ")";
							
							// 	})
							// 	.attr("style", "fill: #FF2525")
							// 	.attr("fill-opacity", 0.2)
							// 	.attr("class", "rowSelector");

							// this.svg.obj.append("circle")
							// 	.attr("r", (thisObj.grid.size.width/4))
							// 	.attr("transform", function(d, i) {
									
							// 		var gutter = thisObj.totalGutterCount;
							// 		var offsetIndex =  (thisObj.metricSet.getCount( thisObj.dataKey , thisObj.parentKey , "visible" ) + gutter)/2;
											
							// 		var offset = (-1 * thisObj.grid.size.width * offsetIndex) + thisObj.grid.size.width;

							// 		var x = offset + thisObj.svg.dimensions.widthMidpoint ;
									
							// 		return "translate(" + x + ", " + (thisObj.margin.top/2) + ")";
							
							// 	})
							// 	.attr("y", function(){ 
							// 		return (thisObj.margin.top/2);
							// 	})
							// 	.attr("style", "fill: #FF2525")
							// 	.attr("fill-opacity", 0.2)
							// 	.attr("class", "columnSelector");

							this.draw( thisObj.initializeBlocks );
							this.draw( thisObj.drawBlocks );

							var thisObj = this;
							var dataset = thisObj.dataset.getData();
							var length = (dataset.length + 8) * thisObj.grid.size.height;

							
							
							// this.svg.obj.append("line")
							// 	.attr("x1", thisObj.svg.dimensions.widthMidpoint)
							// 	.attr("x2", thisObj.svg.dimensions.widthMidpoint)
							// 	.attr("y1", 0)
							// 	.attr("y2", length)
							// 	.attr("stroke-opacity" , 0.2)
							// 	.attr("style", "stroke: #FF2525");

							

					},
					initializeBlocks: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {

						var gridsvg = thisObj.svg.obj;

						var nameClass = "." + metricName;

						var dataset = thisObj.dataset.getData();

						// Initialize this block
						// Draw large grid
						var columnObj = gridsvg.selectAll(nameClass);

						columnObj
							.data(dataset)
							.enter()
							.append("rect")
							.attr("class", function(d, i){
								return i + " "+metricName+" "+ metricName + i + " " + d['originalPassword']+" "+ d['permutedPassword']+" block hiderow";
							})
							.attr("id", function(d){return d['originalPassword'] + metricName;})
							.on("mouseover", function(d, i){ 
								return thisObj.hoverTrigger( d, metricName , this , "mouseover" ) 
							})
							.on("mouseout", function(d, i){
								return thisObj.hoverTrigger( d, metricName , this , "mouseout" ) 
							});

					
					},
					drawBlocks: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {

						var svg = thisObj.svg.obj;
						
						var nameClass = "." + metricName;	
						
						var colorScale = thisObj.metricSet.getNormalColorScale( metricName , thisObj.dataKey , thisObj.parentKey );

						// Initialize this block
						// Draw large grid
						var columnObj = svg.selectAll(nameClass);

						columnObj
							.attr("width", thisObj.grid.size.width)
      						.attr("height", thisObj.grid.size.height)
      						.style("fill", function(d) { return colorScale(d[metricName]); });

      					thisObj.shiftColumns( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x );

      					thisObj.hideRows();
			
					},
					// Connect tiers.
					// @param tier: tier object to connect 
					// Connected tiers will respond to events 
					connect: function ( tier ) {

						this.connectedTiers.push( tier );
						
					}, 
					// Color the hovered row and column. If entering a block, row and column will be highlighted. Otherwise, they will be recolored the default color.
					colorColumnRow: function ( metricName , type , selector , row ) {

						var thisObj = this,
					    svg = thisObj.svg.obj;
					    thisObj.hoverType = type; // Temporarily stores the type of hover
						var columnClass = "." + metricName, // Class selector for the column
						blocks = svg.selectAll(".block");


						// Determine hover type and choose normal or highlight colorscale
						if(thisObj.hoverType == "mouseover") {

							var colorScale = thisObj.metricSet.getHighlightColorScale( metricName , thisObj.dataKey , thisObj.parentKey );

							// Dim all blocks 
							blocks.style("fill-opacity", .25);

							var rowClass = "." + metricName + row;
							var position = $(rowClass).position();

								
				    	} else {

				    		// Choose normal colorscale
				    		var colorScale = thisObj.metricSet.getNormalColorScale( metricName , thisObj.dataKey , thisObj.parentKey );

				    		// Dim non-highlighted blocks 
							blocks.style("fill-opacity", 1);
				    	
				    	}

					    // Color column 
					    // Set style
				    	var columnObj = svg.selectAll(columnClass);
						columnObj.style("fill", function(d) { return colorScale(d[ metricName ]); })
							.style("fill-opacity", 1);

						// Color row 
						var colorRow = function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
							
							var rowClass = "." + metricName + row ; // Class representing row hovered

							var rowObj = svg.selectAll(rowClass); 
					    	
					    	// Color with highlight color
					    	if(thisObj.hoverType == "mouseover") {

								var colorScale = thisObj.metricSet.getHighlightColorScale( metricName , thisObj.dataKey , thisObj.parentKey );
					    	
					    	// Recolor default color
					    	} else {

					    		var colorScale = thisObj.metricSet.getNormalColorScale( metricName , thisObj.dataKey , thisObj.parentKey );
					    	
					    	}

					    	// Set style
							rowObj.style( "fill", function( d , i ){ return colorScale( d[ metricName ]) })
								.style("fill-opacity", 1);

						};


						thisObj.draw( colorRow , row );

					},
					// Trigger hover function for this tier and connected tiers.
					hoverTrigger: function (dataObj , name , obj , type) { 
					    
					    var thisObj = this,
					    svg = thisObj.svg.obj;
					    thisObj.hoverType = type;

					    // Get name of current block 
					    var element = d3.select(obj).attr("class"),
					    className = element.split(" "),
					    row = className[0], // Row number 
					    metricName = className[1], // Name of metric
					    selector = className[2]; 

					    // Color hovered column and row
					    thisObj.colorColumnRow( metricName , type , selector , row );
					    
					    // Color blocks for connected tiers
					    for(var i = 0; i < thisObj.connectedTiers.length; i++){
					    	
					    	if( thisObj.connectedTiers[i].hover ) {
					    		thisObj.connectedTiers[i].hover( metricName , type , selector , row );
					    	}

					    }
				
					},
					// Activates same hover function as hoverTrigger. If a tier is connected to this tier, it will activate this function on hover.
					hover: function ( metricName , type , selector , row ) {

						if( type === "mouseover" || type === "mouseout" ){

							this.colorColumnRow( metricName , type , selector , row );

						} 
	
					},
					// Set filter min and max values for passed metric.
					// Determines which metrics have been filtered.
					filterPasswords: function ( metricName, values ) {
						
						this.hiddenRows[metricName] = {
							range: {
								min: values[0],
								max: values[1]
							},
							obj: [] 
						};

						this.hideRows();

					},
					// Hide rows of passwords indicated in this.hiddenRows
					hideRows: function ( ) {
						var svg = this.svg.obj;
						svg.selectAll(".hiderow").style("opacity", 1);

						for(var prop in this.hiddenRows){
							
							var max = this.hiddenRows[ prop ].range.max;
							var min = this.hiddenRows[ prop ].range.min;
							
							this.hiddenRows[ prop ].obj = svg.selectAll(".hiderow").filter(function(d) { return (d[prop] < min || d[prop] > max); })
							this.hiddenRows[ prop ].obj.style("opacity", 0);
						
						}
					
					},
					// Hide column as named by metricName
					hideColumns: function ( metricName ) {
						var thisObj = this;
						thisObj.draw( thisObj.shiftColumns );

					},
					// Determine x position of columns
					shiftColumns: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {

						var visible = thisObj.metricSet.isVisible( metricName , thisObj.dataKey , thisObj.parentKey );
						var svg = thisObj.svg.obj;
						
						var nameClass = "." + metricName;	

						var obj = svg.selectAll(nameClass);

						if( visible ){
							obj
								.attr("width", thisObj.grid.size.width)
								.attr("transform", function(d, i) {

									var y = thisObj.grid.size.height * i + thisObj.margin.top

									return "translate(" + x + ", " + y + ")";
							
								});
							

						} else {

							obj.attr("width", 0);
							
						}
						
					}

				};


				// Represents svg properties and functions
				// @Param: height: Integer. Desired height of the svg. Usually set to the container height.
				//	width: Integer. Desired width of the svg. Usually set to the container width. 
				//	id: HTML id of the resutling svg
				//	parentContainer: HTML container where the resulting svg element will reside 
				var Svg = function ( height, width, id, parentContainer ) {
					
					this.html = {
						container: {
							id: parentContainer
						},
						id: id
					};
					this.obj = {};
					this.viewBox = {};
					this.dimensions = {
						height: height,
						width: width
					};

					var init = function (thisObj) {
						var svgSelector = "#" + thisObj.html.container.id + " " + thisObj.html.id;
						svgSelector = $(svgSelector).toArray();

						// Determine size of SVG viewBox using parent container dimensions
						thisObj.viewBox = "0 0 " + $( thisObj.html.id ).width() + " " + (thisObj.dimensions.height);

						// SVG
						thisObj.obj = d3.selectAll(svgSelector).append("svg")
							.attr("viewBox", thisObj.viewBox)
							// .attr("overflow", "scroll")
							.attr("height", thisObj.dimensions.height)
							.attr("id" , thisObj.html.id)
				 			// .attr("width", thisObj.dimensions.width)
							// .attr("preserveAspectRatio", "xMidYMin meet")
							;

						// Determine mid point of height and width 
						thisObj.dimensions.heightMidpoint = thisObj.dimensions.height / 2;
						thisObj.dimensions.widthMidpoint = thisObj.dimensions.width / 2;

					};

					init(this);

				};
				Svg.prototype = {
					updateViewboxY: function ( yVal ) {
						var thisObj = this;

						var svgSelector = "#" + thisObj.html.container.id + " " + thisObj.html.id;
						svgSelector = $(svgSelector).toArray();

						thisObj.viewBox = "0 " + yVal + " " + $( thisObj.html.id ).width() + " " + (thisObj.dimensions.height);
						
						// SVG
						thisObj.obj.attr("viewBox", thisObj.viewBox);
					}
				};


				// Specialized tiers
				//// Small view, sidebar
				var Tier1 = function ( type , dataKey , key , dataset , htmlElem , metricSet  ) {
					// Call superclass
					TierInstance.call( this , type , dataKey , key , dataset , htmlElem , metricSet );
					
					// Custom grid size
					this.grid = {
						size: {
							width: 2,
							height: 2
						}
					};
					
					this.html.id = "#" + htmlElem;

				};
				Tier1.prototype = Object.create( TierInstance.prototype, {
					visualize: {
						value: function ( ) {
							this.draw();
							var nameclass = this.html.id;
							
							$(nameclass).html('');
							this.drawGrid();
							this.draw( this.addFunctionality )
							
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					createsvg: {
						value: function () {
							var id = "#" + this.html.id,
							height = $( "#vizualizations-holder" ).height(),
							width = $( id ).width();

							this.svg = new Svg(height, width, id, this.html.parentContainer);

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					scrollTo: {
						value: function ( row ) {
							var thisObj = this;

							// Color blocks for connected tiers
						    for(var i = 0; i < thisObj.connectedTiers.length; i++){
						    	if( thisObj.connectedTiers[i].scrollTo ) {
						    		thisObj.connectedTiers[i].scrollTo( row );
						    	}

						    }
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					addFunctionality: {
						value: function ( thisObj, categoryIndex , metricIndex , metricName , currentMetricIndex ) {
							var gridsvg = thisObj.svg.obj;

						var nameClass = "." + metricName;

						var dataset = thisObj.dataset.getData();

						// Initialize this block
						// Draw large grid
						var columnObj = gridsvg.selectAll(nameClass);

						columnObj
							.on("click", function(d, i){
								return thisObj.scrollTo( i ); 
							});
						}
					}
				}); 
				Tier1.prototype.constructor = Tier1;


				// Medium view, scrollable
				var Tier2 = function ( type , dataKey , key , dataset , htmlElem , metricSet  ) {
					TierInstance.call(this, type , dataKey , key , dataset , htmlElem , metricSet );

					
					this.grid = {
						size: {
							width: 17,
							height: 17
						},
						margin: {
							top: 0,
							column: 10 
						}
					}

					this.labels = {
						password: {
							margin: {
								left: 15
							}
							
						}, 
						column: {
							margin: {
								bottom: 10
							},
							size: {
								line: 5
							}
						}
					}

				
				};
				Tier2.prototype = Object.create( TierInstance.prototype, {
					visualize: {
						value: function ( ) {
							this.draw();
							var nameclass = this.columnsSvg.html.id + " svg";
							$(nameclass).html('');

							var nameclass = this.svg.html.id + " svg";
							$(nameclass).html('');

							this.drawGrid();
							this.drawLabels();


						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					}, 
					createsvg: {
						value: function () {
							var id = "#heatmap-tier2-columns-svg-container";
							
							var height = 250;
							var width = $( id ).width();
							this.columnsSvg = new Svg( height, width, id, this.html.parentContainer );
							
							id = "#heatmap-tier2-grid-svg-container";
							height = $( "#vizualizations-holder" ).height() - this.columnsSvg.dimensions.height
							
							width = $( id ).width();

							this.svg = new Svg( height, width, id, this.html.parentContainer );

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					hideColumns: {
						value: function ( metricName ) {
							var thisObj = this;
							thisObj.draw();
							thisObj.draw( thisObj.shiftColumns );
							thisObj.draw( thisObj.shiftColumnLabels );
							thisObj.shiftPasswordLabels();

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					drawLabels:{
						value: function ( ) {
							var thisObj = this;

							this.drawPasswordLabels();
							this.draw( thisObj.drawColumnLabels );

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					drawPasswordLabels: {
						value: function ( ) {
							var thisObj = this;
							var dataset = thisObj.dataset.getData();
							var gridsvg = thisObj.svg.obj;
							var columnssvg = thisObj.columnsSvg.obj ;

							// Create password labels for main diagram
							var passwordLabels = gridsvg.selectAll(".passwordLabels")
								.data(dataset)
								.enter().append("text")
								.text(function (d) { return d['originalPassword']; })
								.style("text-anchor", "end")
								.attr("transform", function (d, i) { 
									return "translate(" + (( -1 * thisObj.grid.size.width * ( (thisObj.metricSet.getCount( thisObj.dataKey , thisObj.parentKey , "visible" ) +  thisObj.orderedMetrics.length - 1)/2)) - thisObj.labels.password.margin.left + thisObj.svg.dimensions.widthMidpoint) + "," +  ((i * thisObj.grid.size.height) + thisObj.grid.margin.top + (thisObj.grid.size.height * .8)) + ")";
								})
								.attr("class", function (d, i) { return "password mono hiderow passwordLabels" })
								.attr("id", function (d, i) { return "labelpassword"+i; });


							// Create password labels for main diagram
							var passwordLabelsPermuted = gridsvg.selectAll(".passwordLabelsPermuted")
								.data(dataset)
								.enter().append("text")
								.text(function (d) { return d['permutedPassword']; })
								.style("text-anchor", "start")
								.attr("transform", function (d, i) { return "translate(" + (( thisObj.grid.size.width * ( (thisObj.metricSet.getCount( thisObj.dataKey , thisObj.parentKey , "visible" ) +  thisObj.orderedMetrics.length - 1)/2)) + thisObj.labels.password.margin.left + thisObj.svg.dimensions.widthMidpoint) + "," +  ((i * thisObj.grid.size.height) + thisObj.grid.margin.top + (thisObj.grid.size.height * .8)) + ")";
								})
								.attr("class", function (d, i) { return "password mono hiderow passwordLabelsPermuted" })
								.attr("id", function (d, i) { return "labelpassword"+i; });	

							thisObj.shiftPasswordLabels();
							
							// Create labels for columns
							var labels = columnssvg.selectAll(".metricLabel")
								.data(thisObj.orderedMetrics)
								.enter().append("g")
								.attr("class", function(d, i){
									return (d.name + i + "");
								});

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					shiftPasswordLabels: {
						value: function ( ) {

							var thisObj = this;
							var gridsvg = this.svg.obj;
							var x = 0;
							var offset = 0;

							var gutter = thisObj.totalGutterCount;
							var offsetIndex =  (thisObj.metricSet.getCount( thisObj.dataKey , thisObj.parentKey , "visible" ) + gutter)/2;
							
							// Create password labels for main diagram
							var passwordLabels = gridsvg.selectAll(".passwordLabels")
							
								.attr("transform", function (d, i) { 
									
									offset = -1 * thisObj.grid.size.width * offsetIndex;

									x = offset - thisObj.labels.password.margin.left + thisObj.svg.dimensions.widthMidpoint ;
									return "translate(" + x + "," +  ((i * thisObj.grid.size.height) + thisObj.margin.top + (thisObj.grid.size.height * .8)) + ")";
								});

							// Create password labels for main diagram
							var passwordLabelsPermuted = gridsvg.selectAll(".passwordLabelsPermuted")
								.attr("transform", function (d, i) { 
									offset = ( thisObj.grid.size.width * (offsetIndex));
									x = offset + thisObj.labels.password.margin.left + thisObj.svg.dimensions.widthMidpoint;

									return "translate(" + x + "," +  ((i * thisObj.grid.size.height) + thisObj.margin.top + (thisObj.grid.size.height * .8)) + ")";
								});

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					drawColumnLabels: {
						value: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
							var columnssvg = thisObj.columnsSvg.obj ;
						
							var id = "." + thisObj.orderedMetrics[categoryIndex].name + categoryIndex + "";
							var labels = columnssvg.selectAll(id);

							labels.append("text")
								.text(function(d, i){

									return thisObj.metricSet.metrics[metricName].label;
								})
								.style("text-anchor", "start")
								.attr("class", function(){return "label"+ metricName +" columnLabel mono axis step "+ metricName});


							// labels.append("line")
							// 	.attr("x1", 0)
							// 	.attr("x2", thisObj.labels.column.size.line)
							// 	.attr("y1", 0)
							// 	.attr("y2", 0)
							// 	.attr("style", "stroke: #000")
							// 	.attr("class", function(){return metricName + "Line" });


							thisObj.shiftColumnLabels( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x );
						
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					shiftColumnLabels: {
						value: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
							var svg = thisObj.columnsSvg.obj,
								nameClass = "." + metricName,
								obj = svg.selectAll( nameClass ),
								isVisible = thisObj.metricSet.isVisible( metricName , thisObj.dataKey , thisObj.parentKey ),
								nameClassLine = "." + metricName + "Line"
								lineObj = svg.selectAll(nameClassLine);

							if( isVisible ){
								obj
									.attr("fill-opacity", 1)
									.attr("transform", function(d, i) {

										return "translate(" + (x + (thisObj.grid.size.width * .5)) + ", " + (thisObj.columnsSvg.dimensions.height) + "), rotate(-70)";
								
									});

								lineObj
									.attr("stroke-opacity", 0.2)
									.attr("transform", function(d, i) {
										return "translate(" + (x + (thisObj.grid.size.width * .5)) + ", " + thisObj.columnsSvg.dimensions.height + "), rotate(-90)";
								
									});
								

							} else {

								obj.attr("fill-opacity", 0);
								lineObj.attr("stroke-opacity", 0);
								
							}
						
					},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					scrollTo: {
						value: function ( row ) {
							thisObj = this; 

							var svg = thisObj.svg.obj;
							var classname = "." + row;

							var position = $(classname).position();

							var yVal = thisObj.grid.size.height * row;

							if(yVal > this.svg.dimensions.heightMidpoint){
								yVal -= this.svg.dimensions.heightMidpoint; 
							} else {
								yVal = 0;
							}
							
							this.svg.updateViewboxY( yVal );
						

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					}

				}); 
				Tier2.prototype.constructor = Tier2;


				//// Close up view  
				var Tier3 = function ( type , dataKey , key , dataset , htmlElem , metricSet  ) {
					TierInstance.call(this, type , dataKey , key , dataset , htmlElem , metricSet );

					// Size and margin information for grid
					this.grid = {
						size: {
							width: 15,
							height: 15
						},
						margin: {
							top: 80,
							right: 0,
							left: 0
						}
					};

					// Id of the SVG HTML element
					// this.svg.html.id = "#heatmap-tier3-svg-container";
					
				};
				Tier3.prototype = Object.create( TierInstance.prototype, {
					visualize: {
						value: function ( ) {

							this.drawLabels();
							this.drawBlocks();
							this.initializeControls();

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					createsvg: {
						value: function () {
							var thisObj = this;
							var id = "#heatmap-tier3-svg-container",
							width = $( id ).width(),
							height = (thisObj.grid.size.height * thisObj.metricSet.getCount( thisObj.dataKey , thisObj.parentKey )) + 50 ;

							this.svg = new Svg( height, width, id, this.html.parentContainer )

							this.grid.margin.left = this.svg.dimensions.width - (this.grid.size.width * 10) + 5;

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					}, 
					initializeControls: {
						value: function () {
							var thisObj = this;
							var dataset = thisObj.dataset.getData();
							// About this dataset

							// File displayed 
							$('.about-dataset-holder').append('<tr><th>File displayed:<td id="fileDisplayed"></td></tr>');
							$('#fileDisplayed').html(thisObj.dataKey);

							// Number of passwords
							$('.about-dataset-holder').append('<tr><th>Number of passwords:<td id="numPasswords"></td></tr>');
							$('#numPasswords').html(dataset.length);

							// Filter, Rank, Show/hide columns 
							for(var prop in thisObj.metricSet.categories){
								
								// If there is at least one metric in this category with a non-string data type
								if( thisObj.metricSet.categories[prop].metricOrder.length != 0 && !thisObj.metricSet.categories[prop].allString){ 

									// Filter: Append category title
									$('.filter-holder').append('<h4>' + prop + '</h4>');

									// Rank by: Append category title 
									$('.rank-holder').append('<br><h4 class="rank-category-label" >' + prop + '</h4>');

									// Show/hide columns 
									$('.hide-columns-holder').append('<br><h4 class="hide-columns-label" >' + prop + '</h4>');


									// Add each metric in category
									for( var i = 0; i < thisObj.metricSet.categories[prop].metricOrder.length; i++  ){

										var metricName = thisObj.metricSet.categories[prop].metricOrder[i],
										metricObj = thisObj.metricSet.metrics[metricName],
										metricLabel = metricObj.label,
										sliderlabelid =  metricName + '-sliderRange'
										sliderid = metricName;

										// If the metric has a domain, add to GUI
										if(metricObj.domainVal) {
											// Filter 
											var html = '<div class="row">';
											
											html += '<div class="col-sm-12"><h5>' +  metricLabel + ':  <span id="' + sliderlabelid + '" ></h5></div>';
											
											html += '<div class="col-sm-12"><div id="' + sliderid + '" style="" class="slider"></div></div>';

											html += '</div>';

											$('.filter-holder').append(html);
											html = '';

											// Retrieve min and max of metric domain
											var min = Math.round(metricObj.domainVal[thisObj.dataKey].min * 100)/100,
												max = Math.round(metricObj.domainVal[thisObj.dataKey].max * 100)/100,
												id = "#"+sliderlabelid;

											$(id).append( min + " - " + max);

											id = '#' + sliderid;

											 // Filter: Activate sliders
											$(id).empty().slider({
												orientation: "horizontal",
												range: true,
												min: min,
												max: max,
												values: [min,max],
												slide: function( event, ui ) {
													
													var metricName = $(event.target).attr("id");
													
													thisObj.filterPasswords( metricName, ui.values );
													var labelID = "#" + metricName + "-sliderRange";
													$(labelID).html(ui.values[0] + " - " + ui.values[1]);

												}
											});


											// Rank by 
											$('.rank-holder').append('<label class="sortBtn btn btn-xs btn-default btn-block"><input type="radio" name="options" id="' + metricName + '">' + metricLabel + '</label>');


											// Show only columns visible in the grid ( gridmetricSet )
											if( thisObj.metricSet.isString(metricName) != "String" ){
												// Show/hide Columns
												var activeVal = "";
												if( thisObj.metricSet.isVisible( metricName , thisObj.dataKey , thisObj.parentKey ) ){
													activeVal = "active";
												}
												$( '.hide-columns-holder' ).append( '<label class="btn btn-xs btn-block btn-default ' + activeVal + ' hide-column-btn" id="' + metricName + '-hide-column" style="margin:2px;"><input type="checkbox">' + metricLabel + '</label>' );
											}
											

										}


										
									}

									

									
									// Filter: add space after category
									$('.filter-holder').append('<div class="row"><hr></div>');
									$('.rank-holder').append('<br><hr>');


									// // Hide columns: add "Hide All" button
									// $('.hide-columns-holder').append('<br><label class="btn btn-xs btn-block btn-default active hide-column-btn" id="' + prop + '-hide-column" style="margin:2px;"><input type="checkbox"> Hide All </label>');
							}
							
						}

							html += '</div>';

							$('.filter-holder').append(html);

							for(var prop in thisObj.metricSet.categories){
								if( thisObj.metricSet.categories[prop].metricOrder.length != 0 && !thisObj.metricSet.categories[prop].allString){

									for( var i = 0; i < thisObj.metricSet.categories[prop].metricOrder.length; i++  ){
										var metricName = thisObj.metricSet.categories[prop].metricOrder[i],
										metricObj = thisObj.metricSet.metrics[metricName];
										
									}
								}
							}

							// Rank by
							// Add event handler for sorting data
							$(".sortBtn").click(function(){
							    var id = $(this).children().attr("id");
							    $('.display-btn').addClass('active');

							    thisObj.sortPasswords( id );

							});

							// Show/hide columns
							$(".hide-column-btn").click(function(){
								var id = $(this).attr("id");
								id = id.replace("-hide-column", "");
								
								thisObj.triggerHideColumns( id );
							});

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					drawLabels: {
						value: function () {
							var thisObj = this;
							var svg = thisObj.svg.obj;
							var x = thisObj.grid.margin.left;
							// Create labels for columns
							// Each category has <g> 
							var breakdownLabel = svg.selectAll(".breakdownLabel")
								.data(thisObj.orderedMetrics)
								.enter().append("g").attr("class", function(d, i){
									return d.name + i + " breakdownLabel";
								});

							svg.append("text")
								.text("Original")
								.attr("transform", function(){
									return "translate(" + (x + (thisObj.grid.size.width * .5)) + ", " + (thisObj.grid.margin.top - 25) + ")rotate(-70)";
								})
								.attr("class", function(){
									return "mono";
								});

							svg.append("text")
								.text("Permuted")
								.attr("transform", function(){
									return "translate(" + (x + (thisObj.grid.size.width * 4)) + ", " + (thisObj.grid.margin.top - 25) + ")rotate(-70)";
								})
								.attr("class", function(){
									return "mono";
								});

							svg.append("text")
								.text("Permuted")
								.attr("font-weight", "bolder")
								.attr("transform", function(){
									return "translate(" + (x + (thisObj.grid.size.width * 3) - (thisObj.grid.size.width/2)) + ", " + (thisObj.grid.margin.top - 7) + ")";
								})
								.attr("class", function(){
									return "mono permuted";
								});

							svg.append("text")
								.style("text-anchor", "end")
								.text("Original")
								.attr("font-weight", "bolder")
								.attr("transform", function(){
									return "translate(" + (x + (thisObj.grid.size.width * 1.8) - (thisObj.grid.size.width/2)) + ", " + (thisObj.grid.margin.top - 7) + ")";
								})
								.attr("class", function(){
									return "mono original";
								});

							// svg.append("text")
							// 	.text("Change")
							// 	.attr("transform", function(){
							// 		return "translate(" + (x + (thisObj.grid.size.width * 6)) + ", " + (thisObj.grid.margin.top - 5) + ")rotate(-70)";
							// 	})
							// 	.attr("class", function(){
							// 		return "mono";
							// 	});

							var draw = function (  thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {

								var svg = thisObj.svg.obj; 

								var leftMargin = thisObj.grid.margin.left;
								var topMargin = thisObj.grid.margin.top;

								var name = metricName;

								var className = "." + thisObj.orderedMetrics[categoryIndex].name + categoryIndex;
								var label = svg.selectAll(className);

								if(thisObj.metricSet.metrics[name].permuted.type != "permuted"){
		
									label.append("text")
									.text(function() { 
	
										return thisObj.metricSet.metrics[name].label;
								 
									})
									.style("text-anchor", "end")
									.attr("transform", function() {
										
										return "translate(" + (leftMargin - 20) + ", " + ((thisObj.grid.size.height * (currentMetricIndex + categoryIndex))+ topMargin + (thisObj.grid.size.height * .75)) + "), rotate(0)";
									
									})
									.attr("class", function(d, i){return "breakdownlabel-"+ name +" mono  "+ name + " new"+name + " breakdownlabel-new"+ name });

									label.append("text")
									.text(function() { 
	
										return " 0 ";
								 
									})
									.style("text-anchor", "middle")
									.attr("transform", function() {
										
										return "translate(" + ((leftMargin - 1) ) + ", " + ((thisObj.grid.size.height * (currentMetricIndex+ categoryIndex))+ topMargin + (thisObj.grid.size.height * .75)) + "), rotate(0)";
									
									})
									.attr("class", function(){return "breakdown-holder-"+name+" mono "+name});

								} else {

									label.append("text")
										.text(function() { 
		
											return " 0 ";
									 
										})
										.style("text-anchor", "middle")
										.attr("transform", function(d , i) {
											

											var x = ((leftMargin - 1) + (thisObj.grid.size.width * 4))
											
											var padding = (thisObj.grid.size.height * .75);
											var gridHeight = thisObj.grid.size.height;

											var offsetIndex = (nonPermutedMetricCount) - ( ( currentMetricIndex - nonPermutedMetricCount ) + ( categoryIndex) );
											var offset = gridHeight * offsetIndex;
																						
											var y = (offset + topMargin + padding);

											return "translate(" + x + ", " + y + "), rotate(0)";
										})
										.attr("class", function(){return "breakdown-holder-"+name+" mono "+name});

								}

							};
								
							thisObj.draw( draw );	
		
							thisObj.draw( thisObj.populateValues , 1 );
							

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					drawBlocks: {
						value: function () {
							var thisObj = this;
							var svg = thisObj.svg.obj;

							var leftMargin = thisObj.grid.margin.left;
							var topMargin = thisObj.grid.margin.top;


							// Create labels for blocks
							var breakdownBlocks = svg.selectAll(".breakdownBlock")
								.data(thisObj.orderedMetrics)
								.enter().append("g").attr("class", function(d, i){
									return d.name + i + "-block";
								});

							
								
							var draw = function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {

										
								var className = "." + thisObj.orderedMetrics[categoryIndex].name + categoryIndex + "-block";
								var block = svg.selectAll(className);
								var permutedFlag = false;
						

								if(thisObj.metricSet.metrics[metricName].permuted.type != "permuted"){
									
									block.append("rect").text(function(d,i){
										return
									})
									.attr( "width", thisObj.grid.size.width )
									.attr( "height", thisObj.grid.size.height )
									.attr("transform", function(){
										return "translate(" + ((leftMargin - 1) + thisObj.grid.size.width) + ", " + ((thisObj.grid.size.height * (currentMetricIndex+ categoryIndex))+ topMargin) + "), rotate(0)";
									})
									.attr("class", function(){return "block-"+ metricName});
									
								// Draw permuted block
								} else {

									block.append("rect").text(function(d,i){
										return
									})
									.attr( "width", thisObj.grid.size.width )
									.attr( "height", thisObj.grid.size.height )
									.attr("transform", function(){
											var x = ((leftMargin - 1) + (thisObj.grid.size.width * 2))
											
											var padding = 0;
											var gridHeight = thisObj.grid.size.height;
											
											// Nonpermuted - ( current Permuted index + gutter )
											var offsetIndex = (nonPermutedMetricCount) - ( ( currentMetricIndex - nonPermutedMetricCount ) + ( (categoryIndex) ) );

											var offset = gridHeight * offsetIndex;
																						
											var y = (offset + topMargin + padding);

											return "translate(" + x + ", " + y + "), rotate(0)";
									})
									.attr("class", function(){return "block-"+metricName});

								}

							}

							thisObj.draw( draw );

							thisObj.draw( thisObj.colorBlocks , 1 );

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					hover: {
						value: function ( metricName , type , selector , row ) {
							console.log(row)
							if( row ){
								this.draw( this.populateValues , row );
								this.draw( this.colorBlocks , row );

								this.boldLabels( metricName , type );
							}
							

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					populateValues: {
						value: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
							
							var svg = thisObj.svg.obj;
							var dataset = thisObj.dataset.getData();
							var data = dataset[selector];
							
							var rowClass = ".breakdown-holder-" + metricName ;

							var rowObj = svg.selectAll(rowClass);
					    	
							rowObj.text( function( ){ return Math.floor(data[ metricName ]); });

							var password = svg.selectAll(".original");
							password.text( function( ){ return data[ "originalPassword" ]; } );

							password = svg.selectAll(".permuted");
							password.text( function( ){ return data[ "permutedPassword" ]; } );

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					boldLabels: {
						value: function ( metricName , type ) {
							var thisObj = this;
							var svg = this.svg.obj;
							var columnClass = "." + metricName ;
							var svgObj = svg.selectAll(columnClass);
							console.log(svgObj)
							console.log(type)

							var allObj = svg.selectAll("text");
							
							var labelClass = ".breakdownlabel-" + metricName;
							var labelObj = svg.selectAll(labelClass);
							console.log(labelObj)

							if( type == "mouseover" ) {

								svgObj.attr("font-weight" , "900").style("fill", "#F00");
								var text = labelObj.text();
								labelObj.text(" ");

								labelObj.text(function(){
									return " ☞ " + text;
								});

							} else {
								svgObj.attr("font-weight" , "lighter").style("fill", "#000");;
								
								var text = labelObj.text();
								
								text = text.substring(3, text.length);
								labelObj.text(" ");

								labelObj.text(function(){
									return text;
								});

							}



						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					colorBlocks: {
						value: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
							
							var svg = thisObj.svg.obj;
							var dataset = thisObj.dataset.getData();
							var data = dataset[selector];
							
							var rowClass = ".block-" + metricName ;

							var rowObj = svg.selectAll(rowClass);

					    	var colorScale = thisObj.metricSet.getNormalColorScale( metricName , thisObj.dataKey , thisObj.parentKey );

							rowObj.style( "fill", function( d , i ){ return colorScale( data[ metricName ]) });

							rowClass = "." + metricName ;
							rowObj = svg.selectAll(rowClass);
							rowObj.attr()

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					filterPasswords: {
						value: function ( metricName, values ) {
							var thisObj = this;

							// Color blocks for connected tiers
						    for(var i = 0; i < thisObj.connectedTiers.length; i++){
						    	if( thisObj.connectedTiers[i].filterPasswords ) {
						    		thisObj.connectedTiers[i].filterPasswords( metricName, values );
						    	}

						    }
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					sortPasswords: {
						value: function ( metricName ) {

							console.log("Sort by " + metricName);

							this.dataset.sortData( metricName );

							// Color blocks for connected tiers
						    for(var i = 0; i < this.connectedTiers.length; i++){
						    	if( this.connectedTiers[i].visualize ) {
						    		this.connectedTiers[i].visualize();
						    	}

						    }	
						},
						enumerable: true,
					    configurable: true, 
					    writable: true	
					},
					hideColumns: {
						value: function ( metricName ) {


								
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					triggerHideColumns: {
						value: function ( metricName ) {

							var thisObj = this,
							visible;

							if( this.metricSet.isVisible (metricName ,  this.dataKey , this.parentKey ) ){

								visible = false;

							} else {

								visible = true;

							}

							thisObj.metricSet.setVisibility( metricName , this.dataKey , this.parentKey  , visible );

							thisObj.hideColumns( metricName );

							// Color blocks for connected tiers
						    for(var i = 0; i < thisObj.connectedTiers.length; i++){
						    	if( thisObj.connectedTiers[i].hideColumns ) {
						    		thisObj.connectedTiers[i].hideColumns( metricName );
						    	}

						    }
								
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					}
				} ); 
				Tier3.prototype.constructor = Tier3;

				var types = {
					1: Tier1,	 
					2: Tier2, 
					3: Tier3
				};


				/* Public Methods */
				var create = function( dataKey, key, type , dataset, htmlElem, metricSet ){
					if( types[type] ){

						var tier = types[type];
						return new tier( type , dataKey , key , dataset , htmlElem , metricSet );
					
					}
					
				};
			
				return {
					create: create
				};
			 
			})();


			return {
				create: create
			};

		})();

		// environment.metric
		var metric = ( function(){
			
			/* Private Methods */

			// Holds metric type data
			// Defined in USG-constants file
			// USG.constants.metric
			var METRIC_PROP = USG.constants.metric;
			
			// Class MetricSet
			// Holds a metric and associated specifications for that metric.
			var MetricSet = function(  ){
				this.metrics = {};
				this.metricList = [];
				this.categories = [];

				this.count = {};

				var init = function (thisObj) {
					thisObj.categories[ "uncategorized" ] = new Category ( "uncategorized" );
				};

				init(this);
			};
			MetricSet.prototype = {
				addMetric: function ( type ) {
					thisObj = this;

					// Check if metric exists 
					if ( !this.metrics[ type ] ) {
						
						// Create metric
						var thisMetric = this.metrics[ type ] = new MetricInstance( type );
						thisObj.metricList.push( thisMetric );

						// If has category type, add to that category
						if ( thisMetric.category.name ) {
							
							// Create a category, if doesn't exist
							if( !thisObj.categories[ thisMetric.category.name ] ){
								console.log("category created:")
								console.log(thisMetric.category.name);
								thisObj.categories[ thisMetric.category.name ] = new Category( thisMetric.category.name , thisMetric.permuted );
							}

							// Add metric to that category
							thisObj.categories[ thisMetric.category.name ].add( thisMetric );

						// Add to "uncategorized" 
						} else {

							thisObj.categories[ "uncategorized" ].add( thisMetric );

						}

					}
				},

				// Set domain for all metrics
				setDomains: function ( dataset , dataLocation ) {
					thisObj = this;

					for( var prop in thisObj.metrics ){

						// Set domain for specific dataset
						thisObj.metrics[ prop ].setDomain( dataset , dataLocation );

					}

				},

				setDefaultVisibility: function ( key , visualizationKey ) {
					var thisObj = this;

					for( var prop in thisObj.metrics ){

						// Set domain for specific dataset
						thisObj.metrics[ prop ].setVisibility( key , visualizationKey , true );

					}

					thisObj.setCategoryVisibility( "lpd" , key , visualizationKey , false );
					thisObj.setCategoryVisibility( "passwordStructure" , key , visualizationKey , false );
					thisObj.setCategoryVisibility( "entropySummary" , key , visualizationKey , false );
					thisObj.setVisibility( "lpd" , key , visualizationKey , true );
					thisObj.setVisibility( "newlpd" , key , visualizationKey , true );

				},
				setCategoryVisibility: function ( categoryName , key , visualizationKey , visible ) {
					var thisObj = this;

					if( thisObj.categories[ categoryName ] ){

						var category = thisObj.categories[ categoryName ];

						for( var prop in category.metrics ){

							// Set domain for specific dataset
							category.metrics[ prop ].setVisibility( key , visualizationKey , visible );
							
						}
					}
					

				},
				hasMetric: function ( type ) {
					
					if(this.metrics[ type ]){
					
						return true;
					
					}

					return false;
					
				},
				getCount: function ( key , visualizationKey, type ) {
					
					if( this.count[ key ][ visualizationKey ] ) {
						if( type == "visible" ){

							return this.count[ key ][ visualizationKey ].visible;

						} else {
	
							return this.count[ key ][ visualizationKey ].total;

						}
						
					}

					console.log("Count for " + visualizationKey + ", " + type + " not set.")

				},
				changeCount: function ( key , visualizationKey , type , increase ) {
					
					if( increase ) {
						var increment = 1;
					} else {
						var increment = -1;
					}

					if( this.count[ key ][ visualizationKey ] ) {
						if( type == "visible" ){

							this.count[ key ][ visualizationKey ].visible += increment;

						} else {
	
							this.count[ key ][ visualizationKey ].total += increment;

						}
						
					}


					
				},
				orderCategories: function ( key , visualizationKey ) {
					
					var categoryArray = []; // Used for sorting categories by size
					var categoriesToBeAdded = []; // Holds categories that don't have permuted pairs
					this.orderedCategories = []; // Ordered metric array

					this.count[key] = {};

					var totalCount = 0;
					var visibleCount = 0;

					// Add categories to an array to be sorted
					for(var prop in this.categories){
						categoryArray.push( [ prop , this.categories[ prop ] ] );
					}

					// Sort categories from smallest to largest
					categoryArray.sort(function(a, b){

						var a = a[1];
						var b = b[1];
						return a.metricOrder.length - b.metricOrder.length;

					});

					// Start with the largest category and add to the array
					// Add metrics with permuted pairs first
					// Original metrics
					for( var i = categoryArray.length - 1; i > 0 ; i-- ) {
						// Add original 
						if( categoryArray[i][1].isPermuted ){

							var obj = categoryArray[i][1];

							var metricArray = [];
							

							for(var j = 0; j < obj.metricsOriginal.length; j++){
								if(obj.metrics[ obj.metricOrder[ j ] ].dataType != "String"){

									metricArray.push( obj.metricsOriginal[ j ] );
									totalCount++;

									if( obj.metrics[ obj.metricOrder[ j ] ].isVisible( key , visualizationKey ) ){
										visibleCount++;
									}

								}
							}

							// Add category
							this.orderedCategories.push( {name: obj.name, metrics: metricArray } );

						} else {

							categoriesToBeAdded.push( categoryArray[i] );

						}
				
					}

					// Add metrics without permuted pairs
					for( var i = 0; i < categoriesToBeAdded.length; i++ ) {
						if(!categoriesToBeAdded[i][1].allString){
							// Add metrics
							var obj = categoriesToBeAdded[i][1];

							var metricArray = [];

							for(var j = 0; j < obj.metricOrder.length; j++){
								if(obj.metrics[ obj.metricOrder[ j ] ].dataType != "String"){
									
									metricArray.push( obj.metricOrder[ j ] );
									totalCount++;

									if( obj.metrics[ obj.metricOrder[ j ] ].isVisible( key , visualizationKey ) ){
										visibleCount++;
									}
								}
							}

							// Add category
							this.orderedCategories.push( {name: obj.name, metrics: metricArray } ); 
						}
					
					}

					// Add metrics with permuted pairs again
					// Permuted metrics
					for( var i = 0; i < categoryArray.length ; i++ ) {
						
						// Add permuted 
						if( categoryArray[i][1].isPermuted ){
							var obj = categoryArray[i][1];

							var metricArray = [];

							for(var j = obj.metricsPermuted.length-1; j > -1 ; j--){
								if(obj.metrics[ obj.metricOrder[ j ] ].dataType != "String"){

									metricArray.push( obj.metricsPermuted[ j ] );
									totalCount++;

									if( obj.metrics[ obj.metricOrder[ j ] ].isVisible( key , visualizationKey ) ){
										visibleCount++;
									}
								}

							}

							// Add category
							this.orderedCategories.push( {name: obj.name, metrics: metricArray } ); 
						}

					}
					
					this.count[key][visualizationKey] = {
						visible: visibleCount,
						total: totalCount
					};

					console.log(this.orderedCategories);
					return this.orderedCategories;
			
				},
				getOrderedCategories: function ( key , visualizationKey ) {

						return this.orderCategories();

				},
				isString: function ( type ) {

					if( this.metrics[ type ][ "dataType" ] == "String") {
						return true;
					} else {
						return false;
					}
				},
				isPermuted: function ( type ) {

					if( this.metrics[ type ].permuted ) {
						return true;
					} else {
						return false;
					}

				},
				setColorScheme: function ( dataKey, heatmapKey , colorscheme ) {
					
					for( var prop in this.metrics ){	

						this.metrics[ prop ].setColorScheme( dataKey , heatmapKey , colorscheme );

					}

				},
				getNormalColorScale: function ( metricName , dataKey , visualizationKey ) {

					return this.metrics[ metricName ].getNormalColorScale( dataKey , visualizationKey );

				},
				getHighlightColorScale: function ( metricName , dataKey , visualizationKey ) {

					return this.metrics[ metricName ].getHighlightColorScale( dataKey , visualizationKey );

				},
				setVisibility: function ( metricName , dataKey , visualizationKey , visible ) {

					this.metrics[ metricName ].setVisibility( dataKey , visualizationKey , visible );

					if(!this.count[ dataKey ]){
						this.orderCategories( dataKey , visualizationKey );
					}

					this.changeCount( dataKey , visualizationKey , "visible" , visible );

				},
				isVisible: function ( metricName , dataKey , visualizationKey ) {
					
					return this.metrics[ metricName ].isVisible( dataKey , visualizationKey );

				}
			};

			var Category = function ( name , permuted ) {
				this.name =  name;
				this.metrics = {};
				this.metricOrder = [];
				this.metricsOriginal = [];
				this.metricsPermuted = [];

				if( permuted ){
					this.isPermuted = true;
				} else {
					this.isPermuted = false;
				}

			} 
			Category.prototype = {
				add: function ( metric ) {
					thisObj = this;

					// Add metric to global list
					thisObj.metrics[ metric.key ] = metric;

					if ( metric.permuted && (metric.category.index || metric.category.index == 0) ) {

						if( metric.permuted.type === "original" ){
							
							// insert into original
							thisObj.metricsOriginal[ metric.category.index ] = metric.key;
						
						} else {

							// insert into permuted
							thisObj.metricsPermuted[ metric.category.index ] = metric.key;

						}
					
					} 
						
					if(METRIC_PROP.CATEGORY_TYPES[metric.category.name] && METRIC_PROP.CATEGORY_TYPES[metric.category.name].allString == true ){
						thisObj.allString = true;

					} else {
						thisObj.allString = false;
					}
					
					var lastPosition = this.metricOrder.length;
					this.metricOrder[ lastPosition ] = metric.key;

				}
			};

			// Class MetricInstance
			// Holds a metric and associated specifications for that metric.
			var MetricInstance = function( type ){
				if( type ){
					
					this.label;
					this.dataType;
					this.domainType;
					this.visualizationType = {};
					this.domainVal = {
						global: {}
					};
					this.key = type;

					this.colorScale = {
						global: {}
					};

					this.visible = {
						global: {}
					}

					var rPermuted = /(new)/g;
					var label = ""; // Holds "new" if metric identified as permuted
					var permutedData = {
						type: "original"
					};

					if ( type.match( rPermuted 	) ) {
				
							type = type.replace(rPermuted, "");
							label = "New ";
							permutedData = {
								type: "permuted"
							}
				
					}
					
					// If metric type exists in USG.constants
					if( METRIC_PROP.METRIC_TYPES[ type ]) {

						for( var prop in METRIC_PROP.METRIC_TYPES[ type ] ){

							// Insert "new" if label
							if( prop == "label" ){

								this[ prop ] = label + METRIC_PROP.METRIC_TYPES[ type ][ prop ];

							} else {

								this[ prop ] = METRIC_PROP.METRIC_TYPES[ type ][ prop ];

							}
							
						}

						if ( this.permuted ) {
							this.permuted = permutedData;
						}

					} else {

						// Default metric settings
						this.label = this.key; // Name of the metric, for putting into arrays, etc.
						this.dataType = "String"
						// Standard maximum and minimum values for this metric
						this.domainType = METRIC_PROP.DOMAIN_TYPES.MIN_MAX;

					}

					// Determine if can be visualized by a grid
					if( this.dataType == "String" ) {
						this.visualizationType.grid = false; // Cannot be visualized by a grid
					} else {
						this.visualizationType.grid = true;
					}

				} else {
					console.log("Error: MetricInstance constructor missing type name. ")
				}

			};
			MetricInstance.prototype = {
				setDomain: function ( data , dataLocation ) {
					var thisObj = this; // The current Metric Instance
					var dataset = data.getData();
					this.domainVal[ dataLocation ] = {}; // Stores max and min for the current dataset

					// If domain type not null (meaning it's not a string), set the domain values
					if ( this.domainType ) {

						// Min needs to be calculated
						if ( this.domainType.min === "min" ) {

							// Find and store minimum for current dataset
							var newDataMin = d3.min( dataset , function (d) { return d[ thisObj.key ]; });
							this.domainVal[ dataLocation ].min = newDataMin;

							// Compare with existing global minimum and store result
							this.domainVal.global.min = d3.min([ newDataMin, thisObj.domainVal.global.min]);

						// There is the same min for all datasets
						} else {

							// Set the min for this dataset
							this.domainVal[ dataLocation ].min = this.domainType.min;
							
							// Initialize global min
							if(!this.domainVal.global.min) {
							
								this.domainVal.global.min = this.domainType.min;
							
							}
							
						}

						// Max needs to be calculated
						if ( this.domainType.max === "max" ) {
							
							// Find and store maximum for current dataset
							var newDataMax = d3.max( dataset , function (d) { return d[ thisObj.key ]; });
							this.domainVal[ dataLocation ].max = newDataMax;

							// Compare with existing global maximum and store result
							this.domainVal.global.max = d3.max([ newDataMax, thisObj.domainVal.global.max]);

						// There is the same max for all datasets
						} else {
							
							// Set the max for this dataset
							this.domainVal[ dataLocation ].max = this.domainType.max;
							
							// Initialize global max
							if(!this.domainVal.global.max) {
							
								this.domainVal.global.max = this.domainType.max;
							
							}
					
						}

					}
				},
				setColorScheme: function ( key , visualizationKey , colorscheme ) { 
					var thisObj = this;

					if ( thisObj.domainType ) {	
					
						var min =  thisObj.domainVal[ key ].min;
						var max =  thisObj.domainVal[ key ].max;
	 					var domain = [min, max];
	
						if( !this.colorScale[ key ] ){
							this.colorScale[ key ] = {};
							this.colorScale[ key ][ visualizationKey ] = {};
						}
	
						this.colorScale[ key ][ visualizationKey ].normal = d3.scale.quantile()
							.domain(domain)
							.range(colorscheme.normal);

						this.colorScale[ key ][ visualizationKey ].highlight = d3.scale.quantile()
							.domain(domain)
							.range(colorscheme.highlight);
					}
				},
				getNormalColorScale: function ( key , visualizationKey ) {

					return this.colorScale[ key ][ visualizationKey ].normal;

				},
				getHighlightColorScale: function ( key , visualizationKey ) {

					return this.colorScale[ key ][ visualizationKey ].highlight;

				},
				setVisibility: function ( key , visualizationKey , visiblility ) {

					if( !this.visible[ key ] ){

						this.visible[ key ] = {};
						this.visible[ key ][ visualizationKey ] = visiblility;

					}

					this.visible[ key ][ visualizationKey ] = visiblility;

				},
				isVisible: function ( key , visualizationKey ) {

					return this.visible[ key ][ visualizationKey ];
					
				}
			}
			
			/* Public Methods */

			// Create metric and return it
			var createSet = function( ){

				return new MetricSet( );
			
			};

			return {

				createSet: createSet
	
			};
		})();

		var gui = ( function(){
			
			/* Private Methods */
			// HTML to be loaded
			var EXTERNAL_HTML = {
				initialize: "html/visualizations-holder.html"
			}


			/* Public Methods */
			var initialize = function ( callback ) { 
				// Load external html: Navigation, main 
				$("#USG-body").load(EXTERNAL_HTML.initialize, function done () {
					
					// Calculate navbar height
					var navHeight = $('#navbar-main').outerHeight() + 20;
					// Calculate how tall the visualization should be
					var vizHeight = $('body').outerHeight() - navHeight;

					// Adjust height of visualization container to maximum height
					$("#vizualizations-holder, #vizualizations-holder-container").css("height", vizHeight);

					$("#loadingScreen").hide(); // Hide loading screen div

					callback();
				});

			};
			

			return {
				initialize: initialize
			};
		})();

		// Public methods
		return {
			// Create environment
			create: create,

			// Components of an environment
			metric: metric
		};
	
	})();
}).apply( USG.visualization );

$( document ).ready( function(){
	
	var environment;

	var printtoC = function(){
	
		environment.addHeatmapSet( "catCode-results-1hundred-2015-01-15" , "default" );
	
	};
	
	var loadData = function () {
	
		environment.loadData( "catCode-results-1hundred-2015-01-15.csv", printtoC );
	
	}

	environment = USG.visualization.environment.create( loadData , "#USG-body" );

});







	
